// let G = 0.01; // mass scale
// let timeScale = 1;
// let distanceScale = .0001;

const distanceScale = 0.0001;

let G = 1; // mass scale
let timeScale = 1;
let rexp = 1;



class Physics {
  
  constructor(){
    
    this.bodies = [];
    
  }
  
  constants(){
    
    G = sq(sl_G.value()) / 100;
    rexp = sl_rexp.value();
    timeScale = sq(sl_timescale.value()) * 2;
    
  }
  
  renderText(){
    push();
    noStroke(); fill(255); textSize(22);
    
    //sliders
    text('Big G: ' + round(G, 6), sl_G.x * 2 + sl_G.width, 35);
    
    text('Exponent to r: ' + round(rexp, 6), sl_G.x * 2 + sl_G.width, 65);
    
    text('Time scale: ' + round(timeScale, 6), sl_G.x * 2 + sl_G.width, 95);
    
    
    //keybinds
    textSize(20);
    
    text(instructions_text, 20, 135);
    
    pop();
  }
  
  forcesView(){
    //system / forces view
    push();
    if(this.system && force_view){
      
      //header
      textSize(22);
      noStroke();
      fill(255);
      textAlign(CENTER);
      text("Force Diagram", width-110, 30)
      
      //force diagram coordinate system + labels
      let center = new Vec(width-110, 140);
      
      stroke(125); strokeWeight(3);
      line(center.x-80, center.y, center.x+80, center.y);
      line(center.x, center.y-80, center.x, center.y+80);
      
      noStroke();
      text('+x', center.x+90, center.y);
      text('+y', center.x, center.y-90);
      
      //force diagram forces
      let forces = []
      let colors = []
      let limit = 60;
      let maximumForce = limit;
      for(let other of this.bodies){
        if(other == this.system) continue;
        
        let fg = this.Fg(other, this.system);
        
        
        maximumForce = max(maximumForce, min(fg, limit));
        
        forces.push(
        this.system.pos.directionTo(other.pos)
          .unit()
          .mult(fg)
          .limit(limit)
        )
        
        colors.push(other.col);
      }
      strokeWeight(6);
      point(center.x, center.y);
      strokeWeight(2);
      
      let lineLength = 60;
      
      for(let i = 0; i < forces.length; i++){
        let force = forces[i].mult(lineLength / maximumForce);
        let col = colors[i];
        stroke(col);
        line(center.x, center.y, center.x + force.x, center.y + force.y);
        //line(center.x, force.x, center.y, force.y);
      }
      
      
      //highlight the system
      stroke(255); strokeWeight(4); noFill();
      circle(this.system.pos.x, this.system.pos.y, 30);
    }
    pop();
  }
  
  make_square(){
    this.clearBodies();
    
    let amnt = 650;
    let center = new Vec(width/2, height/2);
    let sideLength = width * 0.35
    
    let corners = [
      new Vec(1, 1),
      new Vec(1, -1),
      new Vec(-1, -1),
      new Vec(-1, 1)
    ]
    
    for(let i = 0; i < amnt; i++){
      let corner_idx = floor(i * 4 / amnt);
      let next_corner_idx = (corner_idx + 1) % 4;
      
      let percentage = i % (amnt/4) / (amnt/4)
      
      
      let pos = corners[corner_idx].lerp(corners[next_corner_idx], percentage);
      pos.mult(sideLength).add(center);
      let b = new Body(pos.x, pos.y);
      
      this.addBody(b);
    }
  }
  
  make_circle(){
    this.clearBodies();
    
    let radius = 200;
    let numPoints = 400;
    let center = new Vec(width/2, height/2);

    for (let i = 0.0; i < numPoints; i++) {
      // Distribute points evenly around the square
      const angle = (i / numPoints) * (2 * Math.PI);

      // Calculate coordinates based on polar coordinates
      const x = center.x + radius * cos(angle);
      const y = center.y + radius * sin(angle);

      this.addBody(new Body(x, y));
    }

  }
  
  make_random(){
    this.clearBodies();
    
    let numPoints = 1200;
    let margin = 60;
    for (let i = 0.0; i < numPoints; i++) {

      // Calculate coordinates based on polar coordinates
      const x = random(margin, width-margin);
      const y = random(margin, height-margin);
      
      let b = new Body(x, y)
      b.col = color(255);
      this.addBody(b);
    }
  }
  
  make_line(){
    this.clearBodies();
    
    let numPoints = 400;
    for(let i = 0; i < numPoints; i++){
      let x = map(i, 0, numPoints, -width, width)*0.4 + width/2;
      let y = height/2;
      let b = new Body(x,y);
      this.addBody(b);
    }
  }
  
  addBody(n){
    //print('adding body', n);
    this.bodies.push(n);
    //print(this.bodies);
  }
  
  removeBody(idx){
    this.bodies.pop(idx);
  }
  
  clearBodies(){
    delete this.bodies;
    this.bodies = [];
    this.system = null;
  }
  
  N1(){
    //print('n1', this.bodies)
    for(let b of this.bodies){
      //limit Fnet to prevent suddent movements (inaccuracy of framerate)
      b.Fnet.limit(60);
      
      //acceleration = force / mass
      let acc = b.Fnet.copy().div(b.m);
      
      //change in velocity = acceleration * delta time
      let deltav = acc.copy().mult( timeScale / 60 );
      
      //update velocity
      b.vel.add(deltav);
      //print(deltav);
      //reset fnet
      b.Fnet.zero();
      
      
      //update position 
      //remember that displacement = vel * delta time
      let deltap = b.vel.copy().mult( timeScale / 60 );
      //print(deltap);
      b.pos.add(deltap);
      //print(' ');
    }
  }
  
  N2_old(){
    //for every body
    for(let b of this.bodies){
      //for every other body
      for(let other of this.bodies){
        //print(b, other);
        if (other == b) continue;
        
        //calculate the force of gravity between the two objects
        let scalar_fg = this.Fg(b, other);
        
        //convert Fg from a scalar to a vector going towards Other
        let vec_Fg = b.pos.directionTo(other.pos).mult(scalar_fg);
        
        //apply the force onto body b
        b.Fnet.add(vec_Fg);
        //print(vec_Fg);
      }
    }
  }
  
  N2(){
    //for every body
    for(let i = 0; i < this.bodies.length; i++){
      //for every other body
      var b = this.bodies[i];
      for(let j = i+1; j < this.bodies.length; j++){
        var other = this.bodies[j];
        
        //calculate the force of gravity between the two objects
        let scalar_fg = this.Fg(b, other);
        
        //convert Fg from a scalar to a vector going towards Other
        let vec_Fg = b.pos.directionTo(other.pos).mult(scalar_fg);
        
        //apply the force onto body b
        b.Fnet.add(vec_Fg);
        
        //apply an equal and opposite force onto the other body
        other.Fnet.sub(vec_Fg);
        
      }
    }
  }
  
  Fg(b1, b2){
    //calculate distance between a and b
    //print(b1);
    //print(b2);
    //print(b1.pos);
    //print(b2.pos);
    let r = b1.pos.dist(b2.pos) * distanceScale;
    
    //force of gravity
    let Fg_b1_2 = (b1.m * b2.m * G) / (r ** rexp);
    //            m1 *  m2  * G  / r ^ 2
    
    return Fg_b1_2;
  }
  render(){
    for(let b of this.bodies){
      b.show();
    }
  }
  
}