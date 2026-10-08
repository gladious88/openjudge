import React from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

export const ShaderBackground: React.FC = () => {
  const shaderProps = {
    animate: "on",
    axesHelper: "off",
    brightness: 1.2,
    cAzimuthAngle: 180,
    cDistance: 3.6,
    cPolarAngle: 90,
    cameraZoom: 1,
    color1: "#3E0D1E",
    color2: "#9D0D2F",
    color3: "#B4204A",
    destination: "onCanvas",
    embedMode: "off",
    envPreset: "city",
    format: "gif",
    fov: 45,
    frameRate: 10,
    gizmoHelper: "hide",
    grain: "on",
    lightType: "3d",
    pixelDensity: 1,
    positionX: -1.4,
    positionY: 0,
    positionZ: 0,
    range: "disabled",
    rangeEnd: 40,
    rangeStart: 0,
    reflection: 0.1,
    rotationX: 0,
    rotationY: 10,
    rotationZ: 50,
    shader: "defaults",
    type: "plane",
    uAmplitude: 1,
    uDensity: 1.3,
    uFrequency: 5.5,
    uStrength: 4,
    uSpeed: 0.4,
    uTime: 0,
    wireframe: false
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35">
      <ShaderGradientCanvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none'
        }}
        pixelDensity={1}
        fov={45}
      >
        <ShaderGradient {...(shaderProps as any)} />
      </ShaderGradientCanvas>
    </div>
  );
};
