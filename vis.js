window.onload = function() {
  const svg = document.getElementById("art");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", 150);
  circle.setAttribute("cy", 150);
  circle.setAttribute("r", 80);
  circle.setAttribute("fill", "#4CAF50");

  svg.appendChild(circle);
};
 