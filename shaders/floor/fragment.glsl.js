export default "uniform sampler2D tBackground;\n\nvarying vec2 vUv;\n\nvoid main()\n{\n    vec4 backgroundColor = texture(tBackground, vUv);\n    gl_FragColor = backgroundColor;\n}\n";
