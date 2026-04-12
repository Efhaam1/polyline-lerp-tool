const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let polyA = [];
let polyB = [];
let drawingB = false;
let animating = false;
let t = 0;

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };

  if (!drawingB) polyA.push(point);
  else polyB.push(point);
});

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    drawingB = true;
  }
  if (e.key.toLowerCase() === "s") {
    if (polyA.length === polyB.length && polyA.length > 0) {
      animating = true;
      t = 0;
    } else {
      alert("Polylines must have same number of points!");
    }
  }
});

function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

function drawPolyline(points, color) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPolyline(polyA, "cyan");
  drawPolyline(polyB, "yellow");

  if (animating) {
    const interpolated = polyA.map((a, i) => ({
      x: lerp(a.x, polyB[i].x, t),
      y: lerp(a.y, polyB[i].y, t)
    }));

    drawPolyline(interpolated, "red");

    t += 0.01;
    if (t >= 1) {
      t = 1;
      animating = false;
    }
  }

  requestAnimationFrame(draw);
}

draw();
