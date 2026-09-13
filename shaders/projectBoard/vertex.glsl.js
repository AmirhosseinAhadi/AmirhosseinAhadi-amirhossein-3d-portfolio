export default "varying vec2 vUv;\n\nvoid main()\n{\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
