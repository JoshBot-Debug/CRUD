import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router";

import AddCircleRounded from "@mui/icons-material/AddCircleRounded";

export interface NavigationPageItemProps {
  Icon: React.ReactNode;
  label: string;
  href: string;
  hrefAdd?: string;
}

export default function NavigationPageItem(props: NavigationPageItemProps) {
  return (
    <Box sx={{ display: "flex" }}>
      {/* @ts-ignore */}
      <Button
        startIcon={props.Icon}
        variant="outlined"
        size="large"
        LinkComponent={Link}
        to={props.href}
        sx={{
          justifyContent: "flex-start",
          flex: 1,
          borderTopRightRadius: !props.hrefAdd ? undefined : 0,
          borderBottomRightRadius: !props.hrefAdd ? undefined : 0,
          borderRight: !props.hrefAdd ? undefined : 0,
        }}
      >
        {props.label}
      </Button>
      {/* @ts-ignore */}
      <IconButton
        hidden={!props.hrefAdd}
        size="large"
        LinkComponent={Link}
        to={props.hrefAdd}
        sx={{
          justifyContent: "flex-start",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderLeft: 0,
        }}
      >
        <AddCircleRounded />
      </IconButton>
    </Box>
  );
}
