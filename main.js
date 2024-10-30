class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.distance = 0;
  }
}

let inputPoints = [];

const computeAndDrawHullBtn = document.getElementById("computeAndDrawHullBtn");
const addPointBtn = document.getElementById("addPointBtn");

computeAndDrawHullBtn.addEventListener("click", computeAndDrawHull);

addPointBtn.addEventListener("click", addPoint);

function addPoint() {
  const x = parseInt(document.getElementById("xInput").value);
  const y = parseInt(document.getElementById("yInput").value);
  if (!isNaN(x) && !isNaN(y)) {
    const point = new Point(x, y);
    inputPoints.push(point);

    const pointsList = document.getElementById("pointsList");
    const listItem = document.createElement("li");
    listItem.textContent = `(${x}, ${y})`;
    pointsList.appendChild(listItem);

    document.getElementById("xInput").value = "";
    document.getElementById("yInput").value = "";
  } else {
    alert("Please enter valid coordinates.");
  }
}

function orientation(p, q, r) {
  //compute the oriantetion  if 0 colleniar else if 1 clockwise else if 2 anticlockwise
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  return val === 0 ? 0 : val > 0 ? 1 : 2;
}

function computeConvexHull(points) {
  //compute the final convex hall
  points.sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y)); //sort points to choose the left most
  const base = points[0];

  for (let i = 1; i < points.length; i++) {
    //compute tan angle to got the least angle
    points[i].angle = Math.atan2(points[i].y - base.y, points[i].x - base.x);
    //compute the distance becuase if 2 angles are equal we take according to distance
    points[i].distance = Math.hypot(points[i].x - base.x, points[i].y - base.y);
  }
  //then sort according to angle and distance
  points = [
    base,
    ...points
      .slice(1)
      .sort((a, b) =>
        a.angle === b.angle ? b.distance - a.distance : a.angle - b.angle
      ),
  ];

  // Initialize the array with the base point, which has the smallest y-coordinate (and x-coordinate if y's are the same)
  const uniquePoints = [base];

  // Loop through the rest of the points starting from index 1
  for (let i = 1; i < points.length; i++) {
    // Check if this is the first point or if the angle of the current point is different from the previous point's angle
    if (i === 1 || points[i].angle !== points[i - 1].angle) {
      // If it's the first point or has a unique angle, add it to uniquePoints
      uniquePoints.push(points[i]);
    }
  }

  // Result: This removes any points that have the same angle relative to the base point,
  // ensuring we only have unique angles for constructing the convex hull.

  //take the point
  const hull = [uniquePoints[0], uniquePoints[1]];
  for (let i = 2; i < uniquePoints.length; i++) {
    //loop on it
    while (
      hull.length > 1 &&
      orientation(
        hull[hull.length - 2],
        hull[hull.length - 1],
        uniquePoints[i]
      ) !== 2
    ) {
      hull.pop();
      //check the coordinate while it clockwise pop from stack
    }
    //if anti clock wise push it

    hull.push(uniquePoints[i]);
  }
  //return the sorted hull
  return hull;
}
//animation
function drawPoint(ctx, point) {
  const pointRadius = 5;
  ctx.beginPath();
  ctx.arc(
    point.x * 50 + 50,
    ctx.canvas.height - (point.y * 50 + 50),
    pointRadius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "#f9fafb";
  ctx.fill();
  ctx.closePath();
}

function drawAnimatedHull(hull, points) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points.forEach((point) => drawPoint(ctx, point));

  let currentIndex = 0;
  function drawNextSegment() {
    if (currentIndex >= hull.length) return;

    const startPoint = hull[currentIndex];
    const endPoint = hull[(currentIndex + 1) % hull.length];
    ctx.beginPath();
    ctx.moveTo(
      startPoint.x * 50 + 50,
      canvas.height - (startPoint.y * 50 + 50)
    );
    ctx.lineTo(endPoint.x * 50 + 50, canvas.height - (endPoint.y * 50 + 50));
    ctx.strokeStyle = "#030712";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    currentIndex++;
    setTimeout(drawNextSegment, 500);
  }

  drawNextSegment();
}
//check if the at least 3 point are inserted
function computeAndDrawHull() {
  if (inputPoints.length < 3) {
    alert("Please add at least three points.");
    return;
  }
  //compute it by the function
  const hull = computeConvexHull(inputPoints);
  //call the animation function
  drawAnimatedHull(hull, inputPoints);
}
