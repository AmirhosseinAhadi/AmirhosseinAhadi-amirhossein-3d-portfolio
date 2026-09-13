export default "float random(vec2 st)\n{\n    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n}";
