# AIT-CG-2D-Textures-And-Physics

Create a small 2D game implementing basic textures and phyics features. Created as the final part of the 2D project for my Computer Graphics course at the Aquincum Instute of Technology the fall of 2019 with professor László Szécsi.

<p align="center">
  <img src="/resources/screenshot_01.png" alt="A screenshot of the running project demonstrating each of the completed features." width="400">

  <img src="/resources/screenshot_02.png" alt="A screenshot of the running project demonstrating each of the completed features." width="400">
</p>

One should be able to download the [2D_textures_and_physics](https://github.com/trastopchin/AIT-CG-2D-Textures-And-Physics/tree/master/2D_textures_and_physics) folder and open up the [index.html](https://github.com/trastopchin/AIT-CG-2D-Textures-And-Physics/blob/master/2D_textures_and_physics/graphics/index.html) file in a web browser to see the project. In the case of google chrome, one might have to open the browser with `open /Applications/Google\ Chrome.app --args --allow-file-access-from-files` in order to load images and textures properly. This project was built upon László Szécsi's starter code and class powerpoint slides.

## Completed Features:

1. **Avatar control: Rocket science.** The avatar has three thrusters. The UP key corresponds to a thruster that applies a force in the forward direction of the avatar; the LEFT key corresponds to a thruster that applies a force in the forwards and left direction of the avatar as well as a counterclockwise torque; the RIGHT key corresponds to a thruster that applies a force in the forwards and right direction of the avatar as well as a clockwise torque.
     
2. **Collisions: Rubberoids.** Every GameObject acts like a circular collider. When a collision is detected, the collision response is physically accurate and the collision is elastic.

3. **Texture animation: Boom.** When any GameObject collides with another, there is an explosion at the collision position. These explosions dissapear after running their course.

4. **Parenting: Flames.** When navigating the game world using the Rocket Science thrusters, pressing a key corresponding to a specific thruster will both ove the avatar accordingly as well as display a flame picture visualizing where the thruster is. Teh flames have fixed locations in the frame of reference of the avatar, and they are shown or hidden depending on whether the forces are active.

## Built With

* [WebGLMath](https://github.com/szecsi/WebGLMath) - László Szécsi's vector math library for WebGL programming.
