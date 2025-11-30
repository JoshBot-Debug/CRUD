import { useEffect, useRef, useState } from "react";

export default function useStreamMicrophone(callback: (base64: string) => void) {
	const audioContext = useRef<AudioContext | null>(null);
	const processor = useRef<AudioWorkletNode | null>(null);
	const source = useRef<MediaStreamAudioSourceNode | null>(null);
	const stream = useRef<MediaStream | null>(null);
	const handlerRef = useRef(callback);

	const [streaming, setStreaming] = useState(false);

	useEffect(() => {
		handlerRef.current = callback;
	}, [callback]);

	useEffect(() => {
		let mounted = true;

		const onMessage = (e: MessageEvent) => {
			const uint8 = new Uint8Array(e.data.buffer);
			const b64 = btoa(String.fromCharCode(...uint8));
			handlerRef.current?.(b64);
		};

		async function setup() {
			audioContext.current = new AudioContext({ sampleRate: 24000 });
			await audioContext.current.audioWorklet.addModule("/preprocessor.js");
			if (!mounted) return;
			processor.current = new AudioWorkletNode(
				audioContext.current,
				"pcm16-processor"
			);
			processor.current.port.onmessage = onMessage;
		}

		setup();

		return () => {
			mounted = false;
			audioContext.current?.close();
			processor.current?.disconnect();
			stream.current?.getTracks().forEach((t) => t.stop());
			setStreaming(false);
		};
	}, []);

	async function start() {
		if (!audioContext.current || !processor.current) return;

		stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
		await audioContext.current.resume();
		source.current = audioContext.current.createMediaStreamSource(stream.current);
		source.current.connect(processor.current);
		setStreaming(true);
	}

	function stop() {
		source.current?.disconnect();
		stream.current?.getTracks().forEach((t) => t.stop());
		setStreaming(false);
	}

	return { start, stop, streaming };
}