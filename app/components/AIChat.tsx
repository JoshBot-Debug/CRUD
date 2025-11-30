import { useEffect, useRef, useState } from "react";
import {
  alpha,
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, useSubmit } from "react-router";

import SendRounded from "@mui/icons-material/SendRounded";
import MicRounded from "@mui/icons-material/MicRounded";
import useWebsocket from "~/hooks/useWebsocket";
import { usePlayAudioDelta } from "~/hooks/usePlayAudioDelta";
import useStreamMicrophone from "~/hooks/useStreamMicrophone";
import AssistantModel from "./AssistantModel";

type Message = { from: string; message: string };

export default function AIChat({ token }: any) {
  const theme = useTheme();
  const { play, stop, analyser } = usePlayAudioDelta();
  const [messages, setMessages] = useState<Message[]>([]);
  const submit = useSubmit();

  const socket = useWebsocket(
    "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
    {
      key: token,
      protocols: [
        "realtime",
        "openai-insecure-api-key." + token,
        "openai-beta." + "realtime-v1",
      ],
      onMessage: (e: MessageEvent<any>) => {
        const data = JSON.parse(e.data);

        if (data.type === "response.created") stop();

        if (data.type === "response.audio.delta") play(data.delta);

        if (
          data.type === "conversation.item.input_audio_transcription.completed"
        ) {
          if (data.transcript)
            setMessages((prev) => [
              ...prev,
              { from: "user", message: data.transcript },
            ]);
        }

        if (data.type === "conversation.item.created") {
          const questions = data?.item?.content?.map((c: any) => ({
            from: "user",
            message: c.text,
          }));
          if (questions) setMessages((prev) => [...prev, ...questions]);
        }

        if (data.type === "response.done") {
          const replies = data?.response?.output
            ?.map((o: any) =>
              o.content.map((c: any) => ({ from: "ai", message: c.transcript }))
            )
            ?.flat();
          if (replies) setMessages((prev) => [...prev, ...replies]);
        }
      },
    }
  );

  const microphone = useStreamMicrophone((audio) => {
    if (!socket.conn) return;
    socket.conn.send(
      JSON.stringify({ type: "input_audio_buffer.append", audio })
    );
  });

  const isReady = !!analyser && socket.connected;

  useEffect(() => {
    assertToken();
  }, []);

  async function assertToken() {
    if (token) return;
    await submit("", { method: "POST" });
  }

  async function onSendMessage(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    assertToken();

    const text = new FormData(e.currentTarget).get("message");

    if (!text) return;

    socket.conn?.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text }],
        },
      })
    );

    socket.conn?.send(
      JSON.stringify({
        type: "response.create",
        response: { modalities: ["text", "audio"] },
      })
    );

    {
      // @ts-expect-error
      e.target.querySelector('input[name="message"]').value = "";
    }
  }

  async function onStreamMicrophone() {
    if (microphone.streaming) microphone.stop();
    else {
      assertToken();
      microphone.start();
    }
  }

  return (
    <Paper
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        px: "30%",
        py: 2,
        overflow: "hidden",
      }}
    >
      <AssistantModel />
      <AudioVisualizer
        analyser={analyser}
        width={500}
        height={500}
        color={alpha(theme.palette.divider, 0.2)}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        {messages.map(({ from, message }, i) => (
          <Typography
            key={i}
            sx={from !== "user" ? undefined : { ml: 20, alignSelf: "flex-end" }}
          >
            {message}
          </Typography>
        ))}
      </Box>
      <Form onSubmit={onSendMessage}>
        <TextField
          name="message"
          placeholder="Ask anything"
          autoComplete="off"
          disabled={!isReady}
          fullWidth
          slotProps={{
            input: {
              sx: { borderRadius: 8, p: "4px", pl: 2 },
              endAdornment: (
                <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                  <IconButton
                    size="small"
                    sx={{ borderRadius: 8, border: "none" }}
                    onClick={onStreamMicrophone}
                    disabled={!isReady}
                  >
                    <MicRounded
                      color={microphone.streaming ? "error" : undefined}
                    />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ borderRadius: 8, border: "none" }}
                    type="submit"
                    disabled={!isReady}
                  >
                    <SendRounded />
                  </IconButton>
                </Box>
              ),
            },
          }}
        />
      </Form>
    </Paper>
  );
}

interface Props {
  analyser: AnalyserNode | null;
  width: number;
  height: number;
  color: string;
}

function AudioVisualizer({ analyser, width, height, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const buffer = new Uint8Array(analyser.frequencyBinCount);

    let frameId: number;

    const draw = () => {
      analyser.getByteFrequencyData(buffer);

      const avg = buffer.reduce((sum, v) => sum + v, 0) / buffer.length;

      const minRadius = 50;
      const maxRadius = Math.min(width, height) / 2;
      const radius = minRadius + (avg / 255) * (maxRadius - minRadius);

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.fill();

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(frameId);
  }, [analyser, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width,
        height,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
