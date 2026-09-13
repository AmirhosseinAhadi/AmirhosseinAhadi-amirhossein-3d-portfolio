export default "#define M_PI 3.1415926535897932384626433832795\n\nfloat easeSin(float _value)\n{\n    return sin((_value - 0.5) * M_PI) * 0.5 + 0.5;\n}";
