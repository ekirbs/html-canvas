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



// || toggle full screen mode
function toggleFullScreen() {
  const elem = document.documentElement;

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen(); // Request full screen
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(); // For Safari and other WebKit-based browsers
    }

    // Hide the "Take Screenshot" and "Erase" buttons when exiting fullscreen
    document.getElementById('screenshot').style.display = 'none';
    document.getElementById('erase').style.display = 'none';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); // Exit full screen
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen(); // For Safari and other WebKit-based browsers
    }

    // Show the "Take Screenshot" and "Erase" buttons
    document.getElementById('screenshot').style.display = 'inline-block';
    document.getElementById('erase').style.display = 'inline-block';
  }
}

// Event listener to trigger full screen on a user interaction (e.g., button click)
const fullscreenButton = document.getElementById('fullscreen');
fullscreenButton.addEventListener('click', toggleFullScreen);



// || Take a screenshot of the canvas and download it
function takeScreenshot() {
  const dataURL = canvas.toDataURL('image/png'); // Convert canvas content to a data URL
  
  // Create an <a> element and set its attributes
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'screenshot.png'; // Set the file name

  // Simulate a click on the link to trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up the <a> element
  document.body.removeChild(link);
}

// Event listener for the "Take Screenshot" button
const screenshotButton = document.getElementById('screenshot');
screenshotButton.addEventListener('click', takeScreenshot);