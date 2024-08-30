import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  MutableRefObject,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DraggableProps {
  children: ReactNode;
  rotatesWithCursor?: boolean;
  scale?: [number, number, number];
  position?: [number, number, number];
  onPickup?: (
    ref: MutableRefObject<THREE.Group | null>,
    modelId: string
  ) => void;
  onSlot?: (ref: MutableRefObject<THREE.Group | null>, modelId: string) => void;
  onMove?: (ref: MutableRefObject<THREE.Group | null>, modelId: string) => void;
  sendModelToParent?: (
    modelId: string | null,
    ref: MutableRefObject<THREE.Group | null>
  ) => void;
  [key: string]: any; // Allow additional props
}

interface ChildProps {
  sendModelToParent?: (
    modelId: string | null,
    ref: MutableRefObject<THREE.Group | null>
  ) => void;
}

const Draggable = forwardRef<THREE.Group, DraggableProps>(
  (
    {
      children,
      rotatesWithCursor,
      scale,
      position,
      onPickup,
      onSlot,
      onMove,
      ...props
    },
    ref
  ) => {
    const { pointer, camera } = useThree();
    const [isDragging, setIsDragging] = useState(false);
    const [childModelId, setChildModelId] = useState<string | null>(null);
    const initialPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const initialModelRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const initialModelRotationRef = useRef<{ x: number; y: number }>({
      x: 0,
      y: 0,
    });
    const draggableRef = useRef<THREE.Group | null>(null);
    useImperativeHandle(ref, () => draggableRef.current!);

    const handleReceiveObject3D = (modelId: string | null, model: any) => {
      setChildModelId(modelId);
      if (props.sendCardObject3DToParent && draggableRef.current) {
        props.sendCardObject3DToParent(modelId, draggableRef?.current);
      }
    };

    const handlePointerDown = () => {
      setIsDragging(true);
      document.body.style.cursor = 'url("./textures/dnd-cursor.png"), auto';

      initialPointerRef.current.x = pointer.x;
      initialPointerRef.current.y = pointer.y;
      initialModelRef.current.x = draggableRef.current?.position.x || 0;
      initialModelRef.current.y = draggableRef.current?.position.y || 0;
      initialModelRotationRef.current.x = draggableRef.current?.rotation.x || 0;
      initialModelRotationRef.current.y = draggableRef.current?.rotation.y || 0;

      if (onPickup && draggableRef.current) {
        onPickup(draggableRef, childModelId || "no-model-id-in-draggable");
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "textures/dnd-cursor.png";

      if (onSlot && draggableRef.current) {
        onSlot(draggableRef, childModelId || "no-model-id-in-draggable");
      }
    };

    const handlePointerEnter = () => {
      document.body.style.cursor = "textures/dnd-cursor.png";
    };

    const handlePointerLeave = () => {
      document.body.style.cursor = "textures/dnd-cursor.png";
    };

    useFrame(() => {
      if (
        isDragging &&
        draggableRef.current &&
        camera instanceof THREE.OrthographicCamera
      ) {
        if (onMove) {
          onMove(draggableRef, childModelId || "no-model-id-in-draggable");
        }
        const ndcX = (pointer.x / window.innerWidth) * 2 - 1;
        const ndcY = -(pointer.y / window.innerHeight) * 2 + 1;

        const currentWorldPosX = (ndcX * (camera.right - camera.left)) / 2;
        const currentWorldPosY = (ndcY * (camera.top - camera.bottom)) / 2;

        const ndcX2 = (initialPointerRef.current.x / window.innerWidth) * 2 - 1;
        const ndcY2 =
          -(initialPointerRef.current.y / window.innerHeight) * 2 + 1;
        const initialWorldPosX = (ndcX2 * (camera.right - camera.left)) / 2;
        const initialWorldPosY = (ndcY2 * (camera.top - camera.bottom)) / 2;

        const Xscale = 233;
        const Yscale = 131;
        const deltaX = (currentWorldPosX - initialWorldPosX) * Xscale;
        const deltaY = -(currentWorldPosY - initialWorldPosY) * Yscale;

        draggableRef.current.position.x += deltaX;
        draggableRef.current.position.y += deltaY;

        if (rotatesWithCursor) {
          const rotationDamping = 0.9;
          const rotationFactor = 0.075;

          const maxRotation = 0.98;
          draggableRef.current.rotation.x = Math.max(
            Math.min(
              draggableRef.current.rotation.x + -deltaY * rotationFactor,
              maxRotation
            ),
            -maxRotation
          );
          draggableRef.current.rotation.y = Math.max(
            Math.min(
              draggableRef.current.rotation.y + -deltaX * rotationFactor,
              maxRotation
            ),
            -maxRotation
          );
          draggableRef.current.rotation.x *= rotationDamping;
          draggableRef.current.rotation.y *= rotationDamping;

          initialModelRotationRef.current.x = draggableRef.current.rotation.x;
          initialModelRotationRef.current.y = draggableRef.current.rotation.y;
        }
        initialPointerRef.current.x = pointer.x;
        initialPointerRef.current.y = pointer.y;
        initialModelRef.current.x = draggableRef.current.position.x;
        initialModelRef.current.y = draggableRef.current.position.y;
      }
      if (draggableRef.current) {
        draggableRef.current.rotation.x *= 0.9;
        draggableRef.current.rotation.y *= 0.9;
      }
    });

    return (
      <group
        scale={scale || [1, 1, 1]}
        position={position || [-100, 0, 0]}
        ref={draggableRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <mesh>
          <boxGeometry args={[10, 10, 10]} />
          <meshBasicMaterial color="blue" transparent opacity={0.2} wireframe />
        </mesh>
        {React.Children.map(
          children,
          (child) =>
            React.isValidElement(child) &&
            React.cloneElement(child, {
              ...props,
              sendCardObject3DToParent: handleReceiveObject3D,
            } as Record<string, any>)
        )}
      </group>
    );
  }
);

Draggable.displayName = "Draggable";

export default Draggable;
