/*
Tal Rastopchin
October 21, 2019

Adapted from Laszlo Szecsi's first homework starter code and
powerpoint slide instructions
*/

"use strict";
/* exported GamePhysics */
const GamePhysics = {};

/* Give a GameObject the AvatarControl RocketScience feature */
GamePhysics.setRocketScienceMove = (gameObject) => {

	// add physics update properties
	gameObject.translationalDrag = 4;
	gameObject.rotationalDrag = 8;

	/* An avatar object can be accelerated by at least three thrusters
  by holding down keys on the keyboard. Some of the thrusters also
  apply torque, rotating the avatar. The thrusters must rotate with
  the lander (i.e. the forces they exert are constant in the frame
  of reference fixed to the avatar). Air drag dissipates both
  translational and rotational velocity exponentially. The effect
  should be clearly noticeable, but the avatar should not
  instantaneously stop when forces abate */
	gameObject.move = function (t, dt) {
    // euler integrate position
    const acceleration = new Vec3(this.force).mul(this.invMass);
    this.velocity.addScaled(dt, acceleration);

    // dissapate translational velocity
    this.velocity.mul(Math.exp(-dt * this.translationalDrag * this.invMass));

    // update the position
    this.position.addScaled(dt, this.velocity);

    // euler integrate orientation
    const angularAcceleration = this.torque * this.invAngularMass;
    this.angularVelocity += angularAcceleration * dt;
    this.angularVelocity *= Math.exp(-dt * this.rotationalDrag * this.invMass);
    this.orientation += this.angularVelocity * dt;
  };

  // thruster class
  class Thruster {
  	constructor (thrust, angle, torque) {
  		this.thrust = thrust;
  		this.angle = angle;
  		this.torque = torque;
      this.flame = null;
  	}
  }

  // the thrusters map
  gameObject.thrusters = {};

  // add a thruster to the gameObject
  gameObject.addRocketScienceThruster = function (key, thrusterName, thrust, angle, torque) {
  	this.thrusters[thrusterName] =
  	{"thruster" : new Thruster(thrust, angle, torque),
  	"key" : key};
  };

  // apply the given thruster to the gameObject
  gameObject.applyThruster = function (thrusterName) {
  	const thruster = this.thrusters[thrusterName].thruster;
  	this.force.add(this.getDirection(thruster.angle).mul(thruster.thrust));
  	this.torque += thruster.torque;
  };

  // reset the per frame applied force and torque
  gameObject.resetForceAndTorque = function () {
  	this.force.set();
  	this.torque = 0;
  };

  gameObject.addRocketScienceThruster("UP", "FORWARD", 256, 0, 0);
  gameObject.addRocketScienceThruster("LEFT", "LEFT", 128, Math.PI / 3, 32);
  gameObject.addRocketScienceThruster("RIGHT", "RIGHT", 128, - Math.PI / 3, -32);

  // add avatar control function
  gameObject.control = function (t, dt, keysPressed, colliders) {
    // jshint unused:false
    this.resetForceAndTorque();
    for (const thrusterName in this.thrusters) {
    	// make sure we actually have this property (JS madness)
    	if (this.thrusters.hasOwnProperty(thrusterName)) {
    		const thrusterKeyPair = this.thrusters[thrusterName];
    		if (keysPressed[thrusterKeyPair.key]) {
    			this.applyThruster(thrusterName);
          thrusterKeyPair.thruster.flame.scale.set(thrusterKeyPair.thruster.flameScale);
    		}
        else {
          thrusterKeyPair.thruster.flame.scale.set(0, 0, 0);
        }
    	}
    }
  };
};

GamePhysics.setFlameMesh = function (flameMesh) {
  this.flameMesh = flameMesh;
};

GamePhysics.setThrusterFlames = function (gameObject, gameObjects) {
  // create the thruster game objects
  for (const thrusterName in gameObject.thrusters) {
    if (gameObject.thrusters.hasOwnProperty(thrusterName)) {
      const thruster = gameObject.thrusters[thrusterName].thruster;

      const flame = new GameObject(GamePhysics.flameMesh);
      flame.scale = new Vec3().set(1.5, 0.5, 1);
      thruster.flameScale = flame.scale.clone();
      flame.position = gameObject.getDirection(thruster.angle + Math.PI).times(2);
      flame.orientation = thruster.angle + Math.PI;
      flame.parent = gameObject;
      thruster.flame = flame;

      gameObjects.push(flame);
    }
  }
};

GamePhysics.setBoomMesh = function (boomMesh) {
  this.boomMesh = boomMesh;
};

// instantiate a boom object
GamePhysics.instantiateBoom = function(position, gameObjects, t) {
  if (this.boomMesh !== null) {

    this.lastTimeInstantiatedBoom = t;

    const newBoomObject = new GameObject(this.boomMesh);
    newBoomObject.position.set(position);
    newBoomObject.frame = 0;
    newBoomObject.lifetime = 30;

    newBoomObject.texScale.set(1/6, 1/6);
    newBoomObject.texOffset.set(0, 0);

    // update texture coordinates on move update call
    newBoomObject.move = function (t, dt) {
      //jshint unused:false
      this.texOffset.add(1 / 6, (this.frame % 6 === 5) / 6);
      this.frame++;
    };

    // remove boom object from gameObjects list if dead 
    newBoomObject.control = function (t, dt, keysPressed, gameObjects) {
      if (this.frame > this.lifetime) {
        for (let i = 0; i < gameObjects.length; i++) {
          if (this === gameObjects[i]) {
            gameObjects.splice(i, 1);
          }
        }
      }
    };

    gameObjects.push(newBoomObject);
  }
};

/* add rubberoid collision physics to GameObject */
GamePhysics.setRubberoidCollider = function (gameObject, collisionRadius, restitutionCoefficient) {

  // add relevant physics properties
  gameObject.circularCollisionRadius = collisionRadius;
  gameObject.restitutionCoefficient = restitutionCoefficient;

  // given another circular collider GameObject perform the physics update
  gameObject.hitByCircularCollider = function (circularCollider) {
    const diff = this.position.minus(circularCollider.position);
    let dist2 = diff.dot(diff);

    // if collision
    if (dist2 < this.circularCollisionRadius + circularCollider.circularCollisionRadius) {
      const normal = diff.direction();

      // adjust so that next frame the objects are not overlapping
      this.position.addScaled(0.01, normal);
      circularCollider.position.addScaled(-0.01, normal);

      // compute relative velocity
      const relativeVelocity = this.velocity.minus(circularCollider.velocity);

      // compute impulse magnitude
      const impulseMagnitude = relativeVelocity.dot(normal) / (this.invMass + circularCollider.invMass);

      // update impulses
      this.velocity.addScaled(-impulseMagnitude / this.invMass * (1+this.restitutionCoefficient), normal);
      circularCollider.velocity.addScaled(impulseMagnitude / circularCollider.invMass * (1+circularCollider.restitutionCoefficient), normal);

      //(c1 + n r1 + c0 - n r0)/2
      const term1 = circularCollider.position.plus(normal.times(circularCollider.collisionRadius));
      const term2 = this.position.minus(normal.times(this.collisionRadius));
      const collisionPosition = term1.plus(term2).times(0.5);

      return collisionPosition;
    }

    return null;
  };

  // extend control function of the given GameObject
  gameObject.control = function (t, dt, keysPressed, gameObjects) {
    for (const collider of gameObjects) {

      // if a circular collider object
      if (collider.hasOwnProperty("hitByCircularCollider")) {
        if (this !== collider) {
          const collisionPosition = this.hitByCircularCollider(collider);
          if (collisionPosition !== null) {
            GamePhysics.instantiateBoom(collisionPosition, gameObjects);
          }
        }
      }
    }
  };
};

/* set rubberoid collider move */
GamePhysics.setPassiveRubberoidCollider = function (gameObject, collisionRadius, restitutionCoefficient, invMass) {

  // add collision physics to collider
  GamePhysics.setRubberoidCollider(gameObject, collisionRadius, restitutionCoefficient);

  // relevant physics properties
  gameObject.invMass = invMass;
  gameObject.translationalDrag = 0.01;

  // generic rubberoid collider move function
  gameObject.move = function(t, dt){
    const acceleration = new Vec3(this.force).mul(this.invMass);
    this.velocity.addScaled(dt, acceleration);

    this.velocity.mul(Math.exp(-dt * this.translationalDrag * this.invMass));
    this.position.addScaled(dt, this.velocity);

    const angularAcceleration = this.torque * this.invAngularMass;
    this.angularVelocity += angularAcceleration * dt;
    this.angularVelocity *= Math.exp(-dt * this.angularDrag * this.invMass);
    this.orientation += this.angularVelocity * dt;
  };
};