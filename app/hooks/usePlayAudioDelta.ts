import { useEffect, useRef } from "react";

export type AudioQueue = { source: AudioBufferSourceNode; endTime: number };

export function usePlayAudioDelta() {
	const audioContext = useRef<AudioContext>(null);
	const analyser = useRef<AnalyserNode>(null);
	const queue = useRef<AudioQueue[]>([]);

	useEffect(() => {
		initialise();
		return () => { stop(); }
	}, []);

	function base64ToFloat32(base64: string) {
		const binary = atob(base64);
		const len = binary.length / 2;
		const buffer = new ArrayBuffer(len * 2);
		const view = new DataView(buffer);

		for (let i = 0; i < len; i++) {
			const lo = binary.charCodeAt(i * 2);
			const hi = binary.charCodeAt(i * 2 + 1);
			view.setInt16(i * 2, lo | (hi << 8), true);
		}

		const int16 = new Int16Array(buffer);
		const float32 = new Float32Array(int16.length);
		for (let i = 0; i < int16.length; i++) {
			float32[i] = int16[i] / 0x8000;
		}
		return float32;
	}

	function initialise() {
		if (!!audioContext.current && !!analyser.current) return;
		audioContext.current = new AudioContext({ sampleRate: 24000 });
		analyser.current = audioContext.current!.createAnalyser();
		analyser.current.fftSize = 2048;
		analyser.current.connect(audioContext.current.destination);
	}

	function play(base64: any) {
		initialise();

		const raw = base64ToFloat32(base64);

		const buffer = audioContext.current!.createBuffer(1, raw.length, 24000);
		buffer.copyToChannel(raw, 0, 0);

		const source = audioContext.current!.createBufferSource();
		source.buffer = buffer;
		source.connect(analyser.current!);

		const startTime =
			queue.current.length === 0
				? audioContext.current!.currentTime
				: queue.current[queue.current.length - 1].endTime;

		source.start(startTime);
		queue.current.push({ source, endTime: startTime + buffer.duration });

		source.onended = () => {
			queue.current.shift();
		};
	}

	function stop() {
		if (!queue.current.length) return;

		for (const { source } of queue.current) {
			try {
				source.stop();
			} catch (err) {
			}
		}

		queue.current = [];
	}

	return { play, stop, analyser: analyser.current };
}
