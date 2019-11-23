/*
Tal Rastopchin
October 20, 2019

Adapted from Laszlo Szecsi's first homework starter code and
powerpoint slide instructions
*/

"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];

    this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-vs.glsl");    
    this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured-fs.glsl");
    this.programs.push( 
    this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured));
    this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "background-vs.glsl");
    this.programs.push( 
    this.backgroundProgram = new TexturedProgram(gl, this.vsBackground, this.fsTextured));

    // MY CODE HERE
    this.fsSprite = new Shader(gl, gl.FRAGMENT_SHADER, "sprite-fs.glsl");
    this.programs.push(
    this.spriteProgram = new TexturedProgram(gl, this.vsTextured, this.fsSprite));

    this.texturedQuadGeometry = new TexturedQuadGeometry(gl);    

    this.gameObjects = [];
    this.backgroundMaterial = new Material(this.backgroundProgram);
    this.backgroundMaterial.colorTexture.set(new Texture2D(gl, "media/background.jpg"));
    this.backgroundMesh = new Mesh(this.backgroundMaterial, this.texturedQuadGeometry);
    this.background = new GameObject( this.backgroundMesh );
    this.background.update = function(){};
    this.gameObjects.push(this.background);

    this.raiderMaterial = new Material(this.texturedProgram);
    this.raiderMaterial.colorTexture.set(new Texture2D(gl, "media/raider.png"));
    this.raiderMesh = new Mesh(this.raiderMaterial, this.texturedQuadGeometry);
    this.avatar = new GameObject( this.raiderMesh );
    this.avatar.position.set(0, 0);
    this.gameObjects.push(this.avatar);

    this.asteroidMaterial = new Material(this.texturedProgram);
    this.asteroidMaterial.colorTexture.set(new Texture2D(gl, "media/asteroid.png"));
    this.asteroidMesh = new Mesh(this.asteroidMaterial, this.texturedQuadGeometry);

    // MY CODE HERE
    /* GamePhysics boom initialization */
    this.boomMaterial = new Material(this.spriteProgram);
    this.boomMaterial.colorTexture.set(new Texture2D(gl, "media/boom.png"));
    this.boomMesh = new Mesh(this.boomMaterial, this.texturedQuadGeometry);
    GamePhysics.setBoomMesh(this.boomMesh);

    /* GamePhysics thruster flames initialization */
    this.flameMaterial = new Material(this.texturedProgram);
    this.flameMaterial.colorTexture.set(new Texture2D(gl, "media/afterburner.png"));
    this.flameMesh = new Mesh(this.flameMaterial, this.texturedQuadGeometry);
    GamePhysics.setFlameMesh(this.flameMesh);

    /* generic physics updating */
    const genericMove = function(t, dt){
      const acceleration = new Vec3(this.force).mul(this.invMass);
      this.velocity.addScaled(dt, acceleration);

      const forward = this.getForward();
      const forwardVelocity = forward.times(forward.dot(this.velocity));
      const leftVelocity = this.velocity.minus(forwardVelocity);

      this.velocity.set();
      this.velocity.addScaled(this.backDrag, forwardVelocity);
      this.velocity.addScaled(this.sideDrag, leftVelocity);

      //this.velocity.mul(Math.exp(-dt * this.backDrag * this.invMass));
      this.position.addScaled(dt, this.velocity);

      const angularAcceleration = this.torque * this.invAngularMass;
      this.angularVelocity += angularAcceleration * dt;
      this.angularVelocity *= Math.exp(-dt * this.angularDrag * this.invMass);
      this.orientation += this.angularVelocity * dt;
    };

    for(let i=0; i < 256; i++){
      const asteroid = new GameObject( this.asteroidMesh );
      asteroid.position.setRandom(new Vec3(-64, -64, 0), new Vec3(64, 64, 0) );
      asteroid.velocity.setRandom(new Vec3(-8, -8, 0), new Vec3(8, 8, 0));
      asteroid.angularVelocity = Math.random(-8, 8);
      this.gameObjects.push(asteroid);
      asteroid.move = genericMove;

      GamePhysics.setPassiveRubberoidCollider(asteroid, 2, 0.5, 1);
    }

    this.avatar.backDrag = 0.9;
    this.avatar.sideDrag = 0.5;
    this.avatar.angularDrag = 0.5;

    // MY CODE HERE
    GamePhysics.setRubberoidCollider(this.avatar, 2, 0.5);
    GamePhysics.setRocketScienceMove(this.avatar);
    GamePhysics.setThrusterFlames(this.avatar, this.gameObjects);

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.camera = new OrthoCamera(...this.programs); 
    this.addComponentsAndGatherUniforms(...this.programs);

    gl.enable(gl.BLEND);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.width / canvas.height);
  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
    this.timeAtLastFrame = timeAtThisFrame;

    this.camera.position = this.avatar.position;
    this.camera.update();

    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(const gameObject of this.gameObjects) {
      gameObject.control(t, dt, keysPressed, this.gameObjects);
    }

    for(const gameObject of this.gameObjects) {
      gameObject.move(t, dt);
    }

    for(const gameObject of this.gameObjects) {
      gameObject.update();
    }
    for(const gameObject of this.gameObjects) {
      gameObject.draw(this, this.camera);
    }
  }
}
