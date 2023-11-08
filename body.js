class Body{
  
  constructor(x, y){
    this.pos = new Vec(x, y);
    this.vel = new Vec(0.0, 0.0);
    this.Fnet = new Vec(0.0,0.0);
    this.m = 1;
    this.r = 5;
    this.col = color(random(255), random(255), random(255));
  }
  
  show(){
    //print('showing circle at y', this.pos.y, 'r', this.r);
    noStroke();
    fill(255,random(15,30));
    ellipse(this.pos.x, this.pos.y, (this.r * 2) + 11);
    fill(255,random(30,40));
    ellipse(this.pos.x, this.pos.y, (this.r * 2) + 5);
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
  
}