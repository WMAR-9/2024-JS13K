// For zip
const m = Math
const PI = m.PI

const max =(a,b)=>a>b?a:b;
const min =(a,b)=>(a<b)?a:b;
const rand=a=>m.random()*a
const randInt=a=>rand(a)|0;
const randIntBetween=(a,b)=>a+randInt(b-a+1);
const resetXY = (x,y)=>({x,y})

const floor = a =>m.floor(a)
const floorSet = a =>resetXY(floor(a.x),floor(a.y))

const add = (a,b) =>resetXY(a.x+b.x,a.y+b.y)
const dot=(a,b)=>resetXY(a.x*b,a.y*b)
const substract=(a,b)=>resetXY(a.x-b.x,a.y-b.y)
const comp=(a,b)=>a.x==b.x&&a.y==b.y

const distance=(a,b)=>m.hypot(a.x-b.x,a.y-b.y);
const removeItem = (a,b)=>a.filter(e=>e!=b)
const appendItem = (a,b)=>(a.push(b),a)
const createArray = (a,c) =>new Array(a).fill(c);

const l = localStorage
// Set local memory 
const localSet=(e,a)=>l.setItem(e,a)
const localGet=e=>l.getItem(e)

export {
  localSet,
  localGet,
  createArray,
  distance,
  removeItem,
  appendItem,
  floor,
  floorSet,
  rand,
  randInt,
  randIntBetween,
  max,
  min
}