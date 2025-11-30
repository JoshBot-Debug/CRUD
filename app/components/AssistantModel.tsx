import { useDraggable, DndContext } from "@dnd-kit/core";
import { Card, useTheme } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Quaternion, Matrix4, Vector3, type Object3D, Euler } from "three";

export default function AssistantModel() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <DndContext
      onDragEnd={(event) => {
        if (event.delta) {
          setPos((prev) => ({
            x: prev.x + event.delta.x,
            y: prev.y + event.delta.y,
          }));
        }
      }}
    >
      <Draggable pos={pos} />
    </DndContext>
  );
}

function Draggable({ pos }: any) {
  const theme = useTheme();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "assistant-model",
  });

  const dragX = transform ? pos.x + transform.x : pos.x;
  const dragY = transform ? pos.y + transform.y : pos.y;

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        position: "absolute",
        transform: `translate(${dragX}px, ${dragY}px)`,
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        width: 300,
        height: 300,
        boxShadow: theme.shadows[1],
        cursor: "grab",
        zIndex: 9999,
        p: 0,
        border: "none",
      }}
    >
      <Canvas style={{ backgroundColor: theme.palette.background.default }}>
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
    </Card>
  );
}

function Model() {
  const { scene } = useGLTF("/models/assistant.glb");

  const bones = useRef<Record<string, Object3D>>({});
  const camera = useRef<any>(null);
  const light = useRef<any>(null);
  const correction = new Quaternion().setFromEuler(new Euler(0, Math.PI, 0));

  useEffect(() => {
    scene.traverse((child) => {
      const name = child.name.toLowerCase();
      if (name === "head") bones.current[name] = child;
    });
  }, [scene]);

  useFrame(() => {
    if (!bones.current.head || !camera.current) return;
    const head = bones.current.head;

    const q = new Quaternion().setFromRotationMatrix(
      new Matrix4().lookAt(
        head.getWorldPosition(new Vector3()),
        camera.current.position,
        head.up
      )
    );

    head.quaternion.copy(q).multiply(correction);

    if (light.current) light.current.position.copy(camera.current.position);
  });
  
  return (
    <>
      <PerspectiveCamera
        ref={camera}
        makeDefault
        position={[0, 1.5, 0.8]}
        fov={45}
      />

      <ambientLight intensity={2} />
      <directionalLight ref={light} intensity={3} />

      <primitive object={scene} />
    </>
  );
}
