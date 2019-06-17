'use strict';
console.clear();

const PHI = 1.6180339887;

// config
let bg = '#FFF',
    col = 125,
    dZ = 1,
    dR = 5;

// globals/deferred inits
let cone,
    cam,
    r,
    r_max,
    z,
    z_spacing;

const setup = () => {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  smooth();
  stroke(255, 255, 255, 50);
  r = r_max = sqrt(width ** 2 + height ** 2);
  z = z_spacing = floor(r_max * 0.0275);
  cone = new GoldenCone(r, dR, dZ, z_spacing, 0, col);
  let camDist = r_max * 1/2;
  cam = createCamera();
  cam.setPosition(-camDist, camDist, camDist * 2);
  setCamera(cam);
}

const draw = () => {
  background(bg);
  cam.lookAt(0, 0, 0);
  orbitControl();
  cone.update();
  cone.display();
}

class GoldenCone {
  constructor(r, dR, dZ, sp, s, c) {
    this.a = [];
    this.r = r;
    this.dR = dR;
    this.dZ = dZ;
    this.z = sp;
    this.sp = sp;
    this.s = s;
    this.c = c;
  }
  
  cycleColor() {
    let h = map(noise(this.c * 0.003, frameCount * 0.009), 0, 1, 0, 360);    
    this.c = h;
  }
  
  update() {
    this.cycleColor();
    let i = 0,
        r = this.r;
    this.a = [];
    this.a.push([this.r, this.z]);
    
    while (r > 1) {
      i++;
      let a = (PI * r ** 2)/PHI,
          z = this.z + i * this.sp;
      r = sqrt(a/PI);
      this.a.push([r, z]);
    }

    this.z -= this.dZ;
    
    if (this.z <= 0) {
      this.a.splice(0, 1);
      this.z = this.sp;
    }
    
    this.r = this.a[0][0] += this.dR;
  }
  
  display() {
    colorMode(HSB);
    
    for (let i = 0; i < this.a.length; i++) {
      let p = 1 - (this.a[i][0] / r_max) * 1.85;
      fill(this.c, 100, 50, p);
      push();
      translate(0, 0, this.a[i][1]);
      ellipse(0, 0, this.a[i][0], this.a[i][0], 48);
      pop();
    }
  }
}