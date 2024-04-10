// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function fib(n:i32):i32{
  let a =0,b=1
  if(n>0){
    while(--n){
      let t =a +b
      a=b
      b=t
    }
    return b
  }
  return a
}


function clamp(
  x:number,
  min:number,
  max:number
):number{
  if(x<min){
    x=min;
  }else if(x>max){
    x=max
  }
  return x
}
export function simulate(
  posArray:number[],
  velocityArray:number[],
  height:number,
  width:number,
  dt:number
):void{
  for(let i=0;i<posArray.length;i+=2){
    let x=posArray[i]
    let y=posArray[i+1]

    let vx=velocityArray[i]
    let vy=velocityArray[i+1]

    x=x+vx*dt
    y=y+vy*dt

    if(x<0||x>width){
      x=clamp(x,0,width)
      vx=-vx
    }

    if(y<0||y>height){
      y=clamp(y,0,height)
      vy=-vy
    }
    posArray[i]=x;
    posArray[i+1]=y;

    velocityArray[i]=vx
    velocityArray[i+1]=vy
  }
}
export function malloc(size: usize): usize {
    return heap.alloc(size);
}
  
export function simulateSystem(
  posPtr: usize,
  velPtr: usize,
  size: i32,
  width: f64,
  height: f64,
  dt: f64
):void{
   let i:i32
   let x:f64,y:f64,vx:f64,vy:f64
   for(i=0;i<size*2;i+=2){
    x=load<f64>(posPtr+i*8)
    y=load<f64>(posPtr+(i+1)*8)
    vx = load<f64>(velPtr + i * 8);
    vy = load<f64>(velPtr + (i + 1) * 8);

    x = x + vx * dt;
    y = y + vy * dt;

    if (x < 0 || x > width) {
      x = clamp(x, 0, width);
      vx = -vx;
      store<f64>(velPtr + i * 8, vx);
    }

    if (y < 0 || y > height) {
      y = clamp(y, 0, height);
      vy = -vy;
      store<f64>(velPtr + (i + 1) * 8, vy);
    }

    store<f64>(posPtr + i * 8, x);
    store<f64>(posPtr + (i + 1) * 8, y);
  }
};
  