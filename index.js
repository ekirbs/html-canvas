// || CANVAS/CTX FUNCTIONALITY ||
const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.strokeStyle = '#BADA55';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 50;
ctx.globalCompositeOperation = 'lighten';

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;

function draw(e) {
  if (!isDrawing) return;
  // console.log(e);

  const touchX = e.touches ? e.touches[0].clientX - canvas.offsetLeft : e.clientX - canvas.offsetLeft;
  const touchY = e.touches ? e.touches[0].clientY - canvas.offsetTop : e.clientY - canvas.offsetTop;

  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(touchX, touchY);
  // ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  // || update lastX and lastY
  [lastX, lastY] = [touchX, touchY];
  // [lastX, lastY] = [e.offsetX, e.offsetY];

  // || hue change across spectrum
  hue++;
  if(hue >= 360) {
    hue = 0;
  };

  // || line width change from 0-100-0
  if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
    direction = !direction;
  }
  if (direction) {
    ctx.lineWidth++;
  } else {
    ctx.lineWidth--;
  }
};

// || mouse/touchscreen event listeners (mousedown and touchstart )
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

canvas.addEventListener('touchstart', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop];
  e.preventDefault();
});
canvas.addEventListener('touchmove', (e) => {
  draw(e);
  e.preventDefault();
});
canvas.addEventListener('touchend', () => isDrawing = false);

// || TOGGLE FULLSCREEN MODE ||  this is having unintended effects on the ctx and it's not resizing
const fullscreenBtn = document.getElementById('fullscreen');

function toggleFullScreen() {
  const elem = document.documentElement;

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  resizeCanvas();
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

fullscreenBtn.addEventListener('click', toggleFullScreen);

// || TOGGLE OPTIONS MODE ||
const optionsBtn = document.getElementById('options');
const screenshotBtn = document.getElementById('screenshot');
const eraseBtn = document.getElementById('erase');

screenshotBtn.style.display = 'none';
eraseBtn.style.display = 'none';

function toggleOptions() {
  if(screenshotBtn.style.display === 'none') {
    screenshotBtn.style.display = 'inline-block';
    eraseBtn.style.display = 'inline-block';
  } else {
    screenshotBtn.style.display = 'none';
    eraseBtn.style.display = 'none';
  }
};

optionsBtn.addEventListener('click', toggleOptions);

// || CANVAS SCREENSHOT ||
function takeScreenshot() {
  const dataURL = canvas.toDataURL('image/png');
  
  // Create an <a> element and set its attributes
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'doodle.png'; // Set the file name

  // Simulate a click on the link to trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up the <a> element
  document.body.removeChild(link);
};

screenshotBtn.addEventListener('click', takeScreenshot);

// || ERASE BUTTON ||
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

eraseBtn.addEventListener('click', clearCanvas);