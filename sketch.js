//BP - Physics 2023

let physics;
let mousedown = false;
let initial_velocity = 25;
let continuousPlacement = false;

//sliders
let sl_G, sl_rexp, sl_timescale;

//toggles
let randomize_masses = false;
let force_view = false; 

function setup() {
  //createCanvas(800, 700);
  createCanvas(windowWidth, windowHeight);
  //fullscreen();
  physics = new Physics();
  
  for(let i = 0; i < 0; i++){
    physics.addBody(new Body(random(0, width), random(0, height)));
  }
  
  sl_G = createSlider(0, 1, 0.5, 0.0001);
  sl_G.position(20, 20);
  
  sl_rexp = createSlider(1, 4, 2, 1);
  sl_rexp.position(20, 50);
  
  sl_timescale = createSlider(0, 1, 0.5, 0.0001);
  sl_timescale.position(20, 80);
  
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
}

function draw() {
  background(0);
  
  physics.constants();
  physics.renderText();
  
  let m1 = millis();
  physics.N2();
  let m2 = millis();
  physics.N1();
  let m3 = millis();
  physics.render();
  physics.forcesView();
  let m4 = millis();
  //print(round(m2-m1), round(m3-m2), round(m4-m3));
  
  //print(mousedown);
  if(mousedown && continuousPlacement){
    var b = new Body(mouseX, mouseY);
    
    b.vel.add(new Vec(
      random(-initial_velocity, initial_velocity), 
      random(-initial_velocity, initial_velocity)
    ));
    physics.addBody(b);
  }
}

function mousePressed(){
  if(mouseButton == 'left'){    
    const mouse_margin = 140;
    
    if(abs(mouseX - width/2) > width/2 - mouse_margin) return;
    if(abs(mouseY - height/2) > height/2 - mouse_margin) return;

    if(!continuousPlacement) physics.addBody(new Body(mouseX, mouseY));
    mousedown = true;
  }
  if(mouseButton == 'right'){
    let nearestBody;
    let nearestDist = 1e38;
    let mouseVec = new Vec(mouseX, mouseY);
    for(let b of physics.bodies){
      let d = mouseVec.dist(b.pos);
      if(d < nearestDist) {nearestBody = b; nearestDist = d;}
    }
    if(nearestDist < 30){
      physics.system = nearestBody;
    }
  }
}
function mouseReleased(){
  mousedown = false;
}

function keyPressed(){
  switch(key){
    case 'c': case 'C':
      physics.clearBodies();
      break;
    case 'f': case 'F':
      force_view = !force_view;
      break;
    case 'm': case 'M':
      randomize_masses = !randomize_masses;
      break;
    case 'p': case 'P':
      continuousPlacement = !continuousPlacement;
      break;
    
    case '1': //square outline
      physics.make_square();
      break;

    case '2': //circle outline
      physics.make_circle();
      break;

    case '3': //random uniform distribution
      physics.make_random();
      break;

    case '4': //straight line
      physics.make_line();
      break;

  }
}

function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
}