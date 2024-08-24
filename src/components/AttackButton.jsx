import React, { Children } from 'react';

const AttackButton = ({ children, ...props }) => {

    const handleClick = () => {
        console.log("Attack button clicked");
    };

    return (
        <mesh
            rotation={props.rotation}
            position={props.position}
            onClick={handleClick}
        >
            <circleGeometry attach="geometry" args={[1, 32]} />
            <meshBasicMaterial attach="material" color="red" />
            {children}
        </mesh>
    );
};

export default AttackButton;