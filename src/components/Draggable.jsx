import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CSS } from "../statics/values";
import * as THREE from "three";

const Draggable = forwardRef(
  ({ children, rotatesWithCursor, onPickup, onSlot, onMove }, ref) => {
    const { pointer } = useThree();
    const [isDragging, setIsDragging] = useState(false);
    const initialPointerRef = useRef([0, 0]);
    const initialModelRef = useRef([0, 0]);
    const initialModelRotationRef = useRef([0, 0]);
    const draggableRef = useRef();
    useImperativeHandle(ref, () => draggableRef.current);

    const handlePointerDown = (event) => {
      setIsDragging(true);
      document.body.style.cursor = CSS.CursorStyles.GRABBING;

      initialPointerRef.current.x = pointer.x;
      initialPointerRef.current.y = pointer.y;
      initialModelRef.current.x = draggableRef.current.position.x;
      initialModelRef.current.y = draggableRef.current.position.y;
      initialModelRotationRef.current.x = draggableRef.current.rotation.x;
      initialModelRotationRef.current.y = draggableRef.current.rotation.y;

      if (onPickup) {
        onPickup(draggableRef);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.cursor = CSS.CursorStyles.GRAB;

      if (onSlot) {
        onSlot(draggableRef);
      }
    };

    const handlePointerEnter = (props) => {
      document.body.style.cursor = CSS.CursorStyles.GRAB;
    };

    const handlePointerLeave = (props) => {
      document.body.style.cursor = CSS.CursorStyles.DEFAULT;
    };

    useFrame(({ gl, scene, camera, pointer, size, viewport, clock }) => {
      if (isDragging) {
        if (onMove) {
          onMove(draggableRef);
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
          const rotationDamping = 0.9; // Closer to 1 is less damping, closer to 0 is more damping
          const rotationFactor = 0.075; // Smaller number reduces the immediate rotation effect

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

        // debug
        // console.log("NDC X:", ndcX, "NDC Y:", ndcY);
        // console.log(
        //   "currentWorldPos X:",
        //   currentWorldPosX,
        //   "currentWorldPos Y:",
        //   currentWorldPosY
        // );
        // console.log("NDC X2:", ndcX2, "NDC Y2:", ndcY2);
        // console.log(
        //   "Initial World Pos X:",
        //   initialWorldPosX,
        //   "Initial World Pos Y:",
        //   initialWorldPosY
        // );
        // console.log("Delta X:", deltaX, "Delta Y:", deltaY);
        // console.log("Before update:", draggableRef.current.position);
        // console.log("After update:", draggableRef.current.position);
      }
      draggableRef.current.rotation.x *= 0.9;
      draggableRef.current.rotation.y *= 0.9;
    });

    return (
      <group
        position={[-100, 0, 0]}
        ref={draggableRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <mesh>
          <boxGeometry args={[10, 10, 10]} />
          <meshBasicMaterial
            color="blue"
            transparent={true}
            opacity={0.2}
            wireframe={true}
          />
        </mesh>
        {children}
      </group>
    );
  }
);

export default Draggable;
