const G = 0.01; // mass scale
const timeScale = 1;
const distanceScale = .0001;

class Physics {
  
  constructor(){
    
    this.bodies = [];
    
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
  }
  
  N1(){
    //print('n1', this.bodies)
    for(let b of this.bodies){
      //limit Fnet to prevent suddent movements (inaccuracy of framerate)
      b.Fnet.limit(30);
      
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
  
  N2(){
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
  Fg(b1, b2){
    //calculate distance between a and b
    //print(b1);
    //print(b2);
    //print(b1.pos);
    //print(b2.pos);
    let r = b1.pos.dist(b2.pos) * distanceScale;
    
    //force of gravity
    let Fg_b1_2 = (b1.m * b2.m * G) / (r ** 2);
    //            m1 *  m2  * G  / r ^ 2
    
    return Fg_b1_2;
  }
  render(){
    for(let b of this.bodies){
      b.show();
    }
  }
  
}