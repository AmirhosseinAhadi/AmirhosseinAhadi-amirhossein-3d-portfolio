import * as THREE from 'three'

import shaderFragment from '../../shaders/floor/fragment.glsl.js'
import shaderVertex from '../../shaders/floor/vertex.glsl.js'

export default function()
{
    const uniforms = {
        tBackground: { value: null }
    }

    const material = new THREE.ShaderMaterial({
        wireframe: false,
        transparent: false,
        uniforms,
        vertexShader: shaderVertex,
        fragmentShader: shaderFragment
    })

    return material
}
