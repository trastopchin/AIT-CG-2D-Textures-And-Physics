Tal Rastopchin
October 24, 2019

Completed Features:
  1) Avatar control - Rocket Science
  
     The avatar has three thrusters. The UP key corresponds to a
     thruster that applies a force in the forward direction of the
     avatar; the LEFT key corresponds to a thruster that applies a
     force in the forwards and left direction of the avatar as well
     as a counterclockwise torque; the RIGHT key corresponds to a
     thruster that applies a force in the forwards and right direction of the avatar as well as a clockwise torque.
     
  2) Collisions - Rubberoids

     Every GameObject acts like a circular collider. When a collision is detected, the collision response is physically correct and the collision is elastic.

  3) Texture animation - Boom

     When any GameObject collides with another, there is an explosion at the collision position. These explosions dissapear after running their course.

  4) Parenting - Flames

     When navigating the game world using the Rocket Science thrusters, pressing a key corresponding to a specific thruster will both move the avatar accordingly as well as display a flame picture visualizing where the thruster is. The flames have fixed locations in the frame of reference of the avatar, and they are shown or hidden depending on whether the forces are active.