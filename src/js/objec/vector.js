class Vector{
    constructor(x=0,y=0,w=0,h=0){
      this.x = x
      this.y = y
      this.h= h
      this.w= w
    }
    set(v){
      this.x = v.x
      this.y = v.y
      return this;
    }
    setwh(v,w){
      this.w = w
      this.h = w
      return this.set(v)
    }
    add(v){
      this.x+=v.x
      this.y+=v.y
      return this
    }
    equal(v){
      return this.x==v.x&&this.y==v.y
    }
    inside(v){
      return this.x<v.x&&this.y<v.y&&this.x>=0 && this.y>=0
    }
    zero(){
      this.x=this.y=0;
    }
    substract(v){
      this.x -= v.x
      this.y -= v.y
      return this;
    }
    dotwh(){
      this.x*=this.w
      this.y*=this.h
      return this
    }
    dot(a){
      this.x*=a
      this.y*=a
      return this
    }
    clone(){
      return new Vector(this.x,this.y,this.w,this.h)
    }
}

export { Vector }