import React, { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

function Draggable(props) {
  const { children } = props;

  const [isDragging, setIsDragging] = useState(false);

  const ref = useRef();
  const initialMouse = useRef([0, 0]);
  const initialModelPos = useRef([0, 0]);

  const { pointer, size, camera } = useThree();

  const handlePointerDown = (event) => {
    if (!isDragging) {
      setIsDragging(true);

      initialMouse.current = [pointer.x * size.width, pointer.y * size.height];
      initialModelPos.current = [
        ref.current.position.x,
        ref.current.position.y,
      ];
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (props) => {
    // console.log("pointer move", props);
  };

  useFrame(({ gl, scene, camera, pointer, size, viewport, clock }) => {
    if (isDragging) {
      const currentMouseX = pointer.x * size.width;
      const currentMouseY = pointer.y * size.height;

      const wratio = (size.width / window.screen.width) * 1.2;
      const hratio = (size.height / window.screen.height) * 1.2;
      console.log(wratio, hratio);
      const deltaX = (currentMouseX - initialMouse.current[0]) * (1 - wratio);
      const deltaY = (currentMouseY - initialMouse.current[1]) * (1 - hratio);

      ref.current.position.x = initialModelPos.current[0] + deltaX;
      ref.current.position.y = initialModelPos.current[1] + deltaY;

      initialMouse.current = [currentMouseX, currentMouseY];
      initialModelPos.current = [
        ref.current.position.x,
        ref.current.position.y,
      ];
    } else {
      console.log("off");
    }
  });

  return (
    <group
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMissed={handlePointerUp}
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

export default Draggable;
