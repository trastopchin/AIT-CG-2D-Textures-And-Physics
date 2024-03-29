/*
Tal Rastopchin
October 20, 2019

Adapted from Laszlo Szecsi's first homework starter code and
powerpoint slide instructions
*/

Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec4 color;
  in vec4 texCoord;

  uniform struct{
  	sampler2D colorTexture;
  } material;



  void main(void) {
    fragmentColor = texture(material.colorTexture, texCoord.xy);  
  }
`;