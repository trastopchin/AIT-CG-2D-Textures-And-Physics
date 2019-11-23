/*
Tal Rastopchin
October 21, 2019

Adapted from Laszlo Szecsi's first homework starter code and
powerpoint slide instructions
*/

Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;
  
  in vec4 color;
  in vec4 texCoord;
  in vec2 texScale;
  in vec2 texOffset;

  out vec4 fragmentColor;

  uniform struct {
  	sampler2D colorTexture;
  } material;

  void main(void) {
    vec2 newTexCoord = texCoord.xy * texScale + texOffset;
    fragmentColor = texture(material.colorTexture, newTexCoord);  
  }
`;