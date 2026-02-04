window.onload = function () {

  // Visualization 1: Skills Bar Chart
  const chart = document.getElementById("chart");

  const skills = [
    { name: "UX Research", level: 5 },
    { name: "UI Design", level: 4 },
    { name: "Prototyping", level: 4 },
    { name: "User Testing", level: 4 },
    { name: "Front-end", level: 1 }
  ];

  const maxLevel = 5;

  const leftPadding = 40;
  const topPadding = 20;
  const chartHeight = 180;
  const barWidth = 55;
  const gap = 25;

  skills.forEach((skill, i) => {
    const barHeight = (skill.level / maxLevel) * chartHeight;

    // Bar
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", leftPadding + i * (barWidth + gap));
    rect.setAttribute("y", topPadding + (chartHeight - barHeight));
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("rx", "6");
    rect.setAttribute("fill", "#4CAF50");
    chart.appendChild(rect);

    // Skill label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", leftPadding + i * (barWidth + gap) + barWidth / 2);
    label.setAttribute("y", topPadding + chartHeight + 28);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "12");
    label.textContent = skill.name;
    chart.appendChild(label);

    // Value label
    const value = document.createElementNS("http://www.w3.org/2000/svg", "text");
    value.setAttribute("x", leftPadding + i * (barWidth + gap) + barWidth / 2);
    value.setAttribute("y", topPadding + (chartHeight - barHeight) - 8);
    value.setAttribute("text-anchor", "middle");
    value.setAttribute("font-size", "12");
    value.textContent = skill.level;
    chart.appendChild(value);
  });

  // Visualization 2: Creative SVG Art (bouncy ball)
  const svg = document.getElementById("art");

  const radius = 50;
  let y = 150;
  let v = 0;
  const gravity = 0.6;
  const bounce = 0.8; // energy loss on each bounce
  const ground = 300 - radius; // svg height is 300

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", 150);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", radius);
  circle.setAttribute("fill", "#4CAF50");
  svg.appendChild(circle);

  function animate() {
    v += gravity;
    y += v;

    if (y > ground) {
      y = ground;
      v = -v * bounce;
    }

    circle.setAttribute("cy", y);
    requestAnimationFrame(animate);
  }

  animate();

  // Click anywhere on the SVG to make the ball jump
  svg.addEventListener("click", () => {
    v = -12;
  });
};
 