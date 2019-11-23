/*
Tal Rastopchin
October 21, 2019

Adapted from Laszlo Szecsi's first homework starter code and
powerpoint slide instructions
*/

Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  in vec4 vertexTexCoord;

  out vec4 texCoord;
  out vec4 modelPosition;
  out vec2 texScale;
  out vec2 texOffset;

  uniform struct {
  	mat4 modelMatrix;
    vec2 texScale;
    vec2 texOffset;
  } gameObject;

  uniform struct {
    mat4 viewProjMatrix;
  } camera;

  void main(void) {
  	texCoord = vertexTexCoord;
    modelPosition = vertexPosition;
    gl_Position = vertexPosition * gameObject.modelMatrix * camera.viewProjMatrix;
    texScale = gameObject.texScale;
    texOffset = gameObject.texOffset;
  }
`;