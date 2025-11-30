import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebsocket(
  endpoint: `wss://${string}`,
  options?: {
    key?: string;
    protocols?: string[];
    disableAutoConnect?: boolean;
    onMessage?: (e: MessageEvent) => void;
  }
) {
  const conn = useRef<WebSocket | null>(null);
  const handlerRef = useRef(options?.onMessage);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    handlerRef.current = options?.onMessage;
  }, [options?.onMessage]);

  const connect = useCallback(() => {
    conn.current = new WebSocket(endpoint, options?.protocols);

    const onMessage = (e: MessageEvent) => {
      handlerRef.current?.(e);
    };

    const onOpen = () => setConnected(true);
    const onClose = () => setConnected(false);

    conn.current.addEventListener("open", onOpen);
    conn.current.addEventListener("close", onClose);
    conn.current.addEventListener("error", onClose);
    conn.current.addEventListener("message", onMessage);

    return () => {
      conn.current?.removeEventListener("open", onOpen);
      conn.current?.removeEventListener("close", onClose);
      conn.current?.removeEventListener("error", onClose);
      conn.current?.removeEventListener("message", onMessage);
      conn.current?.close();
    };
  }, [endpoint, options?.protocols, options?.key]);

  useEffect(() => {
    if (options?.disableAutoConnect || !options?.key) return;
    return connect();
  }, [options?.disableAutoConnect, options?.key]);

  return { conn: conn.current, connected, connect };
}
