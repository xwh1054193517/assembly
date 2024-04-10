import * as module from "../build/release.js";
var firstCal=true
var fristCal2=true
function cal(){
    const input=document.getElementById('fibInput')
    const res=module.fib(Number(input.value))
    document.getElementById("res").innerText=`结果为${res}`
}
// document.getElementById("calFib").onclick = cal
function clamp(x,min,max){
    if(x<min){
      x=min;
    }else if(x>max){
      x=max
    }
    return x
}

function renderCanvas1(size,canvas){

    // const size = size;
    const posPtr = module.malloc(size * 2 * 8);
    const velPtr = module.malloc(size * 2 * 8);
    const view = new Float64Array(module.memory.buffer);
    for (let i = 0; i < size * 2; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const vx = Math.random() * 100;
        const vy = Math.random() * 200;

        view[posPtr / 8 + i] = x;
        view[posPtr / 8 + i + 1] = y;

        view[velPtr / 8 + i] = vx;
        view[velPtr / 8 + i + 1] = vy;
    }
    const dt = 16;
    function tick() {
        if(firstCal){
            console.time('simulateSystem')
        }
        module.simulateSystem(
        posPtr,
        velPtr,
        size,
        canvas.width,
        canvas.height,
        dt / 1000
    );
    if(firstCal){
        console.timeEnd('simulateSystem')
        firstCal=false
    }
    render(canvas,view.subarray(posPtr / 8, posPtr / 8 + size * 2),'Webammesbly');
    setTimeout(tick, dt);
    }
    tick()
}
function simulate1(posArray,velocityArray,height,width,dt){
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
function renderCanvas2(size,canvas){
// const size = 1000;
const dt=16
const width = canvas.width;
const height = canvas.height;
const posArray = new Array(size * 2).fill(0);
const velArray = new Array(size * 2).fill(0);
for (let i = 0; i < posArray.length; i += 2) {
    posArray[i] = Math.random() * width;
    posArray[i + 1] = Math.random() * height;
    velArray[i] = Math.random() * 200;
    velArray[i + 1] = Math.random() * 200;
}
// console.warn(posArray,velArray)
function tick(){
    if(fristCal2)console.time('simulate1InJs');
    simulate1(posArray, velArray,height,width,dt/1000);
    if(fristCal2){console.timeEnd('simulate1InJs');fristCal2=false}
    render(canvas,posArray,'Javascript')
    setTimeout(tick, dt);
}
    tick()
}


function render(canvas,arr,text){

    const ctx=canvas.getContext('2d')
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = '#000'
    for(let i=0;i<arr.length*2;i+=2){
        ctx.beginPath()
        ctx.arc(arr[i],arr[i+1],3,0,2*Math.PI)
        ctx.fill()
        ctx.closePath()
    }
    ctx.font = "36px Verdana"
   let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
     gradient.addColorStop("0", "magenta")
     gradient.addColorStop("0.5", "blue")
     gradient.addColorStop("1.0", "red")
     ctx.fillStyle = gradient;
    ctx.fillText(text,canvas.width/3,canvas.height/2)
    
}
const canvas2=document.getElementById('canvas2')
renderCanvas2(1000,canvas2)


const canvas1=document.getElementById('canvas1')

renderCanvas1(1000,canvas1)