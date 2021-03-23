const nVecsX = 100
const nVecsY = 100
const nParts = 2000

var partsX =[]
var partsY =[]
var partsVelX = []
var partsVelY =[]
var xc = 10
var yc = 10
for(var i=0; i<nParts;i++){
  if(xc <  400-30){
    partsX.push(xc)
    partsY.push(yc)
    xc += 5
  }
  else{
    i--
    xc =0
    yc += 5
  }
}

for(var i = 0; i< nParts; i++){
  partsVelX.push(0)
  partsVelY.push(0)
}
function setup() {
  createCanvas(400, 400)
  background(0)
}
//console.log(partsVelX)
function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function initArr2D(x, y, z) {
  var arrY = []
  for (var i = 0; i < y; i++) {
    var arrX = new Array(x)
    for (var j = 0; j < x; j++) {
      arrX[j] = z
    }
    arrY.push(arrX)
  }
  return arrY
}

var xVecs = initArr2D(nVecsX, nVecsY, 0)
var yVecs = initArr2D(nVecsX, nVecsY, 0)
// console.log(xVecs)
function drawVecs() {
  for (var i = 0; i < nVecsX; i++) {
    for (var j = 0; j < nVecsX; j++) {
      line(i * (width / nVecsX) + 10, j * (height / nVecsY) + 10, i * (width / nVecsX) + 10 + xVecs[i][j], j * (height / nVecsY) + 10 + yVecs[i][j])
    }
  }
}

function updateVecs(t) {
  for (var i = 0; i < nVecsX; i++) {
    for (var j = 0; j < nVecsY; j++) {
      //yVecs[i][j] += 1*Math.sin(t)
      //xVecs[i][j] +=  1*Math.cos(t)
      // var influence = 300 / (dist(i * (width / nVecsX) + 10, j * (height / nVecsY) + 10, mouseX, mouseY) ** 1.8)
      // xVecs[i][j] += (mouseX - lX) * influence
      // yVecs[i][j] += (mouseY - lY) * influence
      if(dist(i * (width / nVecsX) + 10, j * (height / nVecsY) + 10, mouseX, mouseY) < 30){
        xVecs[i][j] += (mouseX - lX) * 10
        yVecs[i][j] += (mouseY - lY) * 10
      }
      
      //xVecs[i][j] += influence**2 * 0.001
      if (Math.sqrt(xVecs[i][j] ** 2 + yVecs[i][j] ** 2) > 100) {
        yVecs[i][j] = yVecs[i][j] * 0.9
        xVecs[i][j] = xVecs[i][j] * 0.9
      }
      if (i > 0 && j > 0 && i < nVecsX - 1 && j < nVecsY - 1) {
        var yVal = (yVecs[i][j + 1] + yVecs[i + 1][j] + yVecs[i + 1][j + 1] + yVecs[i][j] + yVecs[i - 1][j] + yVecs[i][j - 1] + yVecs[i - 1][j - 1] + yVecs[i + 1][j - 1] + yVecs[i - 1][j + 1]) / 9
        var xVal = (xVecs[i][j + 1] + xVecs[i + 1][j] + xVecs[i + 1][j + 1] + xVecs[i][j] + xVecs[i - 1][j] + xVecs[i][j - 1] + xVecs[i - 1][j - 1] + xVecs[i + 1][j - 1] + xVecs[i - 1][j + 1]) / 9
        if (isNaN(yVal)) {
          yVal = 0

        }
        if (isNaN(xVal)) {
          xVal = 0
        }

        if (xVal == Infinity) {
          xVal = 10000
        }
        if (yVal == Infinity) {
          yVal = 10000
        }
        if (xVal == -Infinity) {
          xVal = -10000
        }
        if (yVal == -Infinity) {
          yVal = -10000
        }
        yVecs[i][j] = yVal
        xVecs[i][j] = xVal
      }
      else {
        if(i==0){
          yVecs[i][j] = 0
          xVecs[i][j] = 10
        }
        if(i == nVecsX-1){
          yVecs[i][j] = 0
          xVecs[i][j] = -10
        }
        if(j==0){
          yVecs[i][j] = 10
          xVecs[i][j] = 0
        }
        if(j == nVecsY-1){
          yVecs[i][j] = -10
          xVecs[i][j] = 0
        }
        // yVecs[i][j] = 0
        // xVecs[i][j] = 0
      }
    }
  }
}
var restitution = 1
//(width / nVecsX) + 10
function updateParticles(){
  for(var i=0; i< nParts;i++){
    var vecXindex = constrain(Math.floor((partsX[i]/width)*nVecsX),0,nVecsX-1)
    var vecYindex = constrain(Math.floor((partsY[i]/height)*nVecsY),0,nVecsY-1)
    
    partsVelX[i] += xVecs[vecXindex][vecYindex]
    partsVelY[i] += yVecs[vecXindex][vecYindex]

    partsVelX[i] = partsVelX[i] *0.95
    partsVelY[i] = partsVelY[i] *0.95

    partsX[i] += partsVelX[i] /200
    partsY[i] += partsVelY[i] /200

    if(partsX[i] < 0){
      partsVelX[i] = -partsVelX[i] *restitution
    }
    if(partsX[i] >width){
      partsVelX[i] = -partsVelX[i] *restitution
    }
    if(partsY[i] > height){
      partsVelY[i] = -partsVelY[i] *restitution
    }
    if(partsY[i] < 0){
      partsVelY[i] = -partsVelY[i] *restitution
    }
    
  }

}
function drawPartcles(){
  noFill()
  //strokeWeight(3)
  for(var i=0; i< nParts; i++){
    circle(partsX[i],partsY[i],10)
  }
}
var lX = 0
var lY = 0
var theta = 0
function draw() {
  background(0)
  theta += 1
  fill(255)
  stroke(255)
  strokeWeight(1)
  //drawVecs()
  updateVecs(theta)
  //updateVecs(theta)
  //updateVecs(theta)
  //updateVecs(theta)
  updateParticles()
  drawPartcles()
  lX = mouseX
  lY = mouseY

  if (theta % 100 == 1) {
    //console.log(partsX)
    //console.log(Math.floor((partsX[1]/width) * nVecsX))
    //console.log(partsVelX[55])
  }
}

console.log(nParts)
console.log(partsX.length)
console.log(partsY.length)
console.log(partsVelX.length)
console.log(partsVelY.length)