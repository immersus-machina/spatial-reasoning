import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DragRotateGroupProps {
  readonly sensitivity?: number;
  readonly children: React.ReactNode;
}

export function DragRotateGroup({
  sensitivity = 0.027,
  children,
}: DragRotateGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const cameraRight = new THREE.Vector3();
    const cameraUp = new THREE.Vector3();
    const cameraForward = new THREE.Vector3();
    const qx = new THREE.Quaternion();
    const qy = new THREE.Quaternion();
    const q = new THREE.Quaternion();

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !groupRef.current) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      camera.matrixWorld.extractBasis(cameraRight, cameraUp, cameraForward);

      qx.setFromAxisAngle(cameraUp, dx * sensitivity);
      qy.setFromAxisAngle(cameraRight, dy * sensitivity);
      q.copy(qx).multiply(qy);
      groupRef.current.quaternion.premultiply(q);
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
    };
  }, [camera, gl, sensitivity]);

  return <group ref={groupRef}>{children}</group>;
}
