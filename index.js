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


// || ERASE BUTTON FUNCTIONALITY ||
const eraseButton = document.querySelector('#erase');

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

eraseButton.addEventListener('click', clearCanvas);






// Function to toggle full screen mode
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen(); // Request full screen
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); // Exit full screen
    }
  }
}

// Event listener to trigger full screen on a user interaction (e.g., button click)
const appContainer = document.querySelector('.container'); // Replace with your app container
appContainer.addEventListener('click', toggleFullScreen);