class Vec{
  
  constructor(x, y){
    this.x = x;
    this.y = y;
    return this;
  }

  add(other){
    this.x += other.x;
    this.y += other.y;
    return this;
  }
  sub(other){
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }
  mult(other){
    if(other === Vec){
      this.x *= other.x;
      this.y *= other.y;
    }
    if(typeof other == "number"){
      this.x *= other;
      this.y *= other;
    }
    return this;
  }
  lerp(other, t){
    return new Vec(
      this.x + (other.x - this.x) * t,
      this.y + (other.y - this.y) * t
    );
  }
  div(other){
    if(other === Vec){
      this.x /= other.x;
      this.y /= other.y;
    }
    if(typeof other == "number"){
      this.x /= other;
      this.y /= other;
    }
    return this;
  }
  
  mag(){
    return sqrt(sq(this.x) + sq(this.y));
  }
  
  dist(other){
    return other.copy().sub(this).mag();
  }
  
  unit(){
    return this.copy().mult(1/this.mag());
  }
  
  copy(){
    return new Vec(this.x, this.y);
  }
  
  limit(amnt){
    if(this.x == 0 && this.y == 0) return this;
    
    if(this.x != this.x || this.y != this.y) {this.zero(); return this;}
    
    let temp = this.unit().mult(constrain(this.mag(), -amnt, amnt));
    this.x = temp.x;
    this.y = temp.y;
    return this;
  }
  
  directionTo(other){
    return (other.copy().sub(this)).unit();
  }
  
  zero(){
    this.x = 0; this.y = 0;
  }
  
}