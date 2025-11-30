import React, { useRef, useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { styled, useTheme, type SxProps } from "@mui/material/styles";
import type { Theme } from "@emotion/react";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import download from "downloadjs";

interface FileUploadProps {
  name?: string;
  label?: string;
  multiple?: boolean;
  sx?: SxProps<Theme>;
  templateName?: string;
  onDownloadTemplate?: () => Promise<void>;
}

const DropZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.light}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create(["backgroundColor"], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeOut,
  }),
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

export default function FileUpload({
  name,
  label = "Upload files",
  multiple,
  sx,
  templateName,
  onDownloadTemplate,
}: FileUploadProps) {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileList, setFileList] = useState<File[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setFileList(fileArray);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
    if (inputRef.current) {
      const dt = new DataTransfer();
      Array.from(files).forEach((f) => dt.items.add(f));
      inputRef.current.files = dt.files;
    }
  };

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    if (!inputRef.current?.files) return;
    const dt = new DataTransfer();
    Array.from(inputRef.current.files)
      .filter((_, i) => i !== index)
      .forEach((f) => dt.items.add(f));
    inputRef.current.files = dt.files;
    setFileList(Array.from(dt.files));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ...sx }}>
      <input
        ref={inputRef}
        type="file"
        name={name}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        hidden
      />

      <DropZone
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleBrowse}
      >
        <Typography variant="body1" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Drag and drop files here, or click to browse
        </Typography>
      </DropZone>

      {fileList.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          {fileList.map((file, index) => (
            <Box
              key={index}
              sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}
            >
              <Box>
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {file.name}
                </Typography>
                <Typography fontSize={12} color="textSecondary">
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => handleRemoveFile(index)}>
                <DeleteRounded color="error" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {!!onDownloadTemplate && (
        <button
          onClick={onDownloadTemplate}
          className="hover:underline cursor-pointer ml-auto text-xs italic"
          style={{
            color: theme.palette.text.secondary,
          }}
        >
          Dowload{" "}
          {templateName ? templateName.toLocaleLowerCase() : "template.csv"}
        </button>
      )}
    </Box>
  );
}
