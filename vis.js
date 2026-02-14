
function initPortfolioSVGVisuals() {
  const chart = document.getElementById("chart");
  const svg = document.getElementById("art");

  // If this page doesn't have the SVG containers, do nothing.
  if (!chart || !svg) return;

  // Clear previous renders (prevents duplicates if script runs again)
  chart.innerHTML = "";
  svg.innerHTML = "";

  // Visualization 1: Skills Bar Chart
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
}

function initAssignment3VegaLite() {
  // Only run on pages that have the Assignment 3 containers
  const vis1aEl = document.getElementById("vis1a");
  const vis1bEl = document.getElementById("vis1b");
  if (!vis1aEl && !vis1bEl) return;

  // If the page didn't load Vega scripts, don't crash—just log.
  if (typeof vegaEmbed === "undefined") {
    console.error(
      "vegaEmbed is not available. Make sure assignment3.html includes vega, vega-lite, and vega-embed scripts before vis.js."
    );
    return;
  }

  // -----------------------------
  // Visualization 1 (Q1): Which genres generate the highest total global sales?
  // Simple bar chart: sum(Global_Sales) by Genre, sorted descending
  // -----------------------------
  const vis1aSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Total global sales by genre (sorted)",
    width: "container",
    height: 320,
    data: { url: "dataset/videogames_wide.csv" },
    transform: [
      {
        aggregate: [{ op: "sum", field: "Global_Sales", as: "total_sales" }],
        groupby: ["Genre"]
      }
    ],
    mark: "bar",
    encoding: {
      x: {
        field: "Genre",
        type: "nominal",
        sort: "-y",
        title: "Genre",
        axis: { labelAngle: -30 }
      },
      y: {
        field: "total_sales",
        type: "quantitative",
        title: "Total Global Sales (millions)"
      },
      tooltip: [
        { field: "Genre", type: "nominal" },
        { field: "total_sales", type: "quantitative", title: "Sales (M)", format: ".2f" }
      ]
    }
  };

  // -----------------------------
  // Visualization 1 (Q2): How are global sales distributed across genres for the top platforms?
  // Stacked bar: x=Genre, y=sum(Global_Sales), color=Platform (top platforms)
  // -----------------------------
  const topPlatforms = ["PS2", "X360", "PS3", "Wii", "DS"];

  const vis1bSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Global sales distributed across genres for top platforms (stacked)",
    width: "container",
    height: 360,
    data: { url: "dataset/videogames_wide.csv" },
    transform: [
      { filter: { field: "Platform", oneOf: topPlatforms } },
      {
        aggregate: [{ op: "sum", field: "Global_Sales", as: "total_sales" }],
        groupby: ["Genre", "Platform"]
      },
      {
        joinaggregate: [{ op: "sum", field: "total_sales", as: "genre_total" }],
        groupby: ["Genre"]
      }
    ],
    mark: "bar",
    encoding: {
      x: {
        field: "Genre",
        type: "nominal",
        sort: { field: "genre_total", order: "descending" },
        title: "Genre",
        axis: { labelAngle: -30 }
      },
      y: {
        field: "total_sales",
        type: "quantitative",
        title: "Total Global Sales (millions)"
      },
      color: {
        field: "Platform",
        type: "nominal",
        title: "Platform"
      },
      tooltip: [
        { field: "Genre", type: "nominal" },
        { field: "Platform", type: "nominal" },
        { field: "total_sales", type: "quantitative", title: "Sales (M)", format: ".2f" }
      ]
    }
  };

  if (vis1aEl) vegaEmbed("#vis1a", vis1aSpec, { actions: false });
  if (vis1bEl) vegaEmbed("#vis1b", vis1bSpec, { actions: false });
}

window.addEventListener("DOMContentLoaded", () => {
  initPortfolioSVGVisuals();
  initAssignment3VegaLite();
});