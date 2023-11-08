let physics;

function setup() {
  createCanvas(400, 400);
  
  physics = new Physics();
  
  for(let i = 0; i < 1; i++){
    physics.addBody(new Body(random(0, width), random(0, height)));
  }
  
  // let v1 = new Vec(0,0);
  // let v2 = v1.copy();
  // v1.limit(2);
  // print(v1);
  // print(v2);
  
}

function draw() {
  background(0);
  let m1 = millis();
  physics.N2();
  let m2 = millis();
  physics.N1();
  let m3 = millis();
  physics.render();
  let m4 = millis();
  print(round(m2-m1), round(m3-m2), round(m4-m3));
  // if(mouseButton == 1) 
}

function mousePressed(){
  physics.addBody(new Body(mouseX, mouseY));
}