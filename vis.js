
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
  const vis2aEl = document.getElementById("vis2a");
  const vis2bEl = document.getElementById("vis2b");
  const vis3aEl = document.getElementById("vis3a");
  const vis3bEl = document.getElementById("vis3b");
  const vis4aEl = document.getElementById("vis4a");
  const vis4bEl = document.getElementById("vis4b");
  if (!vis1aEl && !vis1bEl && !vis2aEl && !vis2bEl && !vis3aEl && !vis3bEl && !vis4aEl && !vis4bEl) return;

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
    description: "Global sales distributed across genres by ecosystem (Sony vs Microsoft vs Nintendo vs PC)",
    width: "container",
    height: 360,
    data: { url: "dataset/videogames_wide.csv" },
    transform: [
      // Map Platform -> Ecosystem label (kept explicit to avoid JS variable conflicts)
      {
        calculate: "indexof(['PS','PS2','PS3','PS4','PSP','PSV'], datum.Platform) >= 0 ? 'Sony (PlayStation)' : indexof(['XB','X360','XOne'], datum.Platform) >= 0 ? 'Microsoft (Xbox)' : indexof(['NES','SNES','N64','GC','Wii','WiiU','GB','GBA','DS','3DS','Switch'], datum.Platform) >= 0 ? 'Nintendo' : datum.Platform == 'PC' ? 'PC' : 'Other'",
        as: "Ecosystem"
      },

      // Keep only the 4 intended ecosystems
      { filter: { field: "Ecosystem", oneOf: ["Sony (PlayStation)", "Microsoft (Xbox)", "Nintendo", "PC"] } },

      // Aggregate sales by Genre x Ecosystem
      {
        aggregate: [{ op: "sum", field: "Global_Sales", as: "total_sales" }],
        groupby: ["Genre", "Ecosystem"]
      },

      // Compute total sales per genre (for consistent sorting)
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
        field: "Ecosystem",
        type: "nominal",
        title: "Platform Ecosystem"
      },
      tooltip: [
        { field: "Genre", type: "nominal" },
        { field: "Ecosystem", type: "nominal", title: "Ecosystem" },
        { field: "total_sales", type: "quantitative", title: "Sales (M)", format: ".2f" }
      ]
    }
  };

  if (vis1aEl) vegaEmbed("#vis1a", vis1aSpec, { actions: false });
  if (vis1bEl) vegaEmbed("#vis1b", vis1bSpec, { actions: false });

  // =========================================================
  // Visualization 2: Sales Over Time by Platform and Genre
  // Option A:
  // - vis2a: Multi-line chart for top 5 Platforms over time
  // - vis2b: Multi-line chart for top 5 Genres over time
  // =========================================================

  // Common filter for valid years 
  const yearFilter = "isValid(datum.Year) && datum.Year >= 1995";

  // -----------------------------
  // Visualization 2 (Q1): Top 5 Platforms — sales over time
  // -----------------------------
  const vis2aSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Global sales over time by manufacturer (Sony vs Microsoft vs Nintendo vs PC)",
    width: "container",
    height: 320,
    data: { url: "dataset/videogames_wide.csv" },
    transform: [
      { filter: yearFilter },
      // Map Platform -> Manufacturer (ecosystem)
      {
        calculate:
          "indexof(['PS','PS2','PS3','PS4','PSP','PSV'], datum.Platform) >= 0 ? 'Sony (PlayStation)' : " +
          "indexof(['XB','X360','XOne'], datum.Platform) >= 0 ? 'Microsoft (Xbox)' : " +
          "indexof(['NES','SNES','N64','GC','Wii','WiiU','GB','GBA','DS','3DS','Switch'], datum.Platform) >= 0 ? 'Nintendo' : " +
          "datum.Platform == 'PC' ? 'PC' : 'Other'",
        as: "Manufacturer"
      },
      // Keep only the intended manufacturer groups
      {
        filter: {
          field: "Manufacturer",
          oneOf: ["Sony (PlayStation)", "Microsoft (Xbox)", "Nintendo", "PC"]
        }
      },
      // Sum sales by Year + Manufacturer
      {
        aggregate: [{ op: "sum", field: "Global_Sales", as: "year_sales" }],
        groupby: ["Year", "Manufacturer"]
      }
    ],
    mark: { type: "line", point: false },
    encoding: {
      x: {
        field: "Year",
        type: "quantitative",
        title: "Year",
        axis: { format: "d", tickCount: 6, labelAngle: 0 }
      },
      y: {
        field: "year_sales",
        type: "quantitative",
        title: "Global Sales (millions)"
      },
      color: {
        field: "Manufacturer",
        type: "nominal",
        title: "Manufacturer"
      },
      tooltip: [
        { field: "Year", type: "quantitative", title: "Year", format: "d" },
        { field: "Manufacturer", type: "nominal", title: "Manufacturer" },
        { field: "year_sales", type: "quantitative", title: "Sales (M)", format: ".2f" }
      ]
    }
  };

  // Top 5 genres based on overall popularity in the dataset 
  const topGenres = ["Action", "Sports", "Shooter", "Role-Playing", "Platform"];

  // -----------------------------
  // Visualization 2 (Q2): Top 5 Genres — sales over time
  // -----------------------------
  const vis2bSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Global sales over time for top 5 genres",
    width: "container",
    height: 320,
    data: { url: "dataset/videogames_wide.csv" },
    transform: [
      { filter: yearFilter },
      { filter: { field: "Genre", oneOf: topGenres } },
      {
        aggregate: [{ op: "sum", field: "Global_Sales", as: "year_sales" }],
        groupby: ["Year", "Genre"]
      }
    ],
    mark: { type: "line", point: false },
    encoding: {
      x: {
        field: "Year",
        type: "quantitative",
        title: "Year",
        axis: { format: "d", tickCount: 6, labelAngle: 0 }
      },
      y: {
        field: "year_sales",
        type: "quantitative",
        title: "Global Sales (millions)"
      },
      color: {
        field: "Genre",
        type: "nominal",
        title: "Genre"
      },
      tooltip: [
        { field: "Year", type: "quantitative", title: "Year", format: "d" },
        { field: "Genre", type: "nominal" },
        { field: "year_sales", type: "quantitative", title: "Sales (M)", format: ".2f" }
      ]
    }
  };

  if (vis2aEl) vegaEmbed("#vis2a", vis2aSpec, { actions: false });
  if (vis2bEl) vegaEmbed("#vis2b", vis2bSpec, { actions: false });

  // =========================================================
  // Visualization 3: Regional Sales vs Platform
  // - vis3a: Grouped bar chart comparing regions by platform
  // - vis3b: Stacked bar chart showing regional composition per platform
  // Top 8 platforms based on total global sales
  // =========================================================

  // Platforms shown in Visualization 3 (regional sales comparison)

  const topPlatforms8 = ["PS2", "X360", "PS3", "Wii", "DS", "PS", "GBA", "PSP", "PS4", "PS5", "Switch"];
  const vis3aSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Regional sales comparison by platform (grouped)",
    width: "container",
    height: 360,
    data: { url: "dataset/videogames_wide.csv" },
    transform: [
      { filter: { field: "Platform", oneOf: topPlatforms8 } },
      {
        fold: ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"],
        as: ["Region", "Sales"]
      },
      {
        aggregate: [{ op: "sum", field: "Sales", as: "regional_sales" }],
        groupby: ["Platform", "Region"]
      }
    ],
    mark: "bar",
    encoding: {
      x: {
        field: "Platform",
        type: "nominal",
        title: "Platform",
        axis: { labelAngle: -45, labelOverlap: true }
      },
      y: {
        field: "regional_sales",
        type: "quantitative",
        title: "Regional Sales (millions)"
      },
      color: {
        field: "Region",
        type: "nominal",
        title: "Region"
      },
      xOffset: { field: "Region" },
      tooltip: [
        { field: "Platform", type: "nominal" },
        { field: "Region", type: "nominal" },
        { field: "regional_sales", type: "quantitative", title: "Sales (M)", format: ".2f" }
      ]
    }
  };

  const vis3bSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Regional composition of sales by platform (stacked)",
    width: "container",
    height: 360,
    data: { url: "dataset/videogames_wide.csv" },
    transform: [
      { filter: { field: "Platform", oneOf: topPlatforms8 } },
      {
        fold: ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"],
        as: ["Region", "Sales"]
      },
      {
        aggregate: [{ op: "sum", field: "Sales", as: "regional_sales" }],
        groupby: ["Platform", "Region"]
      }
    ],
    mark: "bar",
    encoding: {
      x: {
        field: "Platform",
        type: "nominal",
        title: "Platform",
        axis: { labelAngle: -45, labelOverlap: true }
      },
      y: {
        field: "regional_sales",
        type: "quantitative",
        title: "Regional Sales (millions)"
      },
      color: {
        field: "Region",
        type: "nominal",
        title: "Region"
      },
      tooltip: [
        { field: "Platform", type: "nominal" },
        { field: "Region", type: "nominal" },
        { field: "regional_sales", type: "quantitative", title: "Sales (M)", format: ".2f" }
      ]
    }
  };

  if (vis3aEl) vegaEmbed("#vis3a", vis3aSpec, { actions: false });
  if (vis3bEl) vegaEmbed("#vis3b", vis3bSpec, { actions: false });

  // =========================================================
  // Visualization 4: Nintendo vs Other Platforms (Visual Story)
  // - vis4a: Line chart — total sales over time (Nintendo vs Other)
  // - vis4b: Stacked area — share over time (Nintendo vs Other)
  // Nintendo platforms: NES, SNES, N64, GB, GBA, DS, 3DS, Wii, WiiU, Switch
  // =========================================================

  const nintendoPlatforms = ["NES", "SNES", "N64", "GB", "GBA", "DS", "3DS", "Wii", "WiiU", "Switch"];

  const vis4aSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Nintendo vs Other — global sales over time",
    width: "container",
    height: 340,
    data: { url: "dataset/videogames_wide.csv" },
    transform: [
      { filter: "isValid(datum.Year) && datum.Year >= 1980" },
      {
        calculate: `indexof(${JSON.stringify(nintendoPlatforms)}, datum.Platform) >= 0 ? 'Nintendo' : 'Other'`,
        as: "PlatformGroup"
      },
      {
        aggregate: [{ op: "sum", field: "Global_Sales", as: "year_sales" }],
        groupby: ["Year", "PlatformGroup"]
      }
    ],
    mark: { type: "line", point: false },
    encoding: {
      x: { field: "Year", type: "quantitative", title: "Year", axis: { format: "d" } },
      y: { field: "year_sales", type: "quantitative", title: "Global Sales (millions)" },
      color: {
        field: "PlatformGroup",
        type: "nominal",
        title: "Group",
        scale: {
          domain: ["Nintendo", "Other"],
          range: ["#d62728", "#1f77b4"]
        }
      },
      tooltip: [
        { field: "Year", type: "quantitative", title: "Year", format: "d" },
        { field: "PlatformGroup", type: "nominal", title: "Group" },
        { field: "year_sales", type: "quantitative", title: "Sales (M)", format: ".2f" }
      ]
    }
  };

  const vis4bSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Nintendo vs Other — stacked share over time",
    width: "container",
    height: 340,
    data: { url: "dataset/videogames_wide.csv" },
    transform: [
      { filter: "isValid(datum.Year) && datum.Year >= 1980" },
      {
        calculate: `indexof(${JSON.stringify(nintendoPlatforms)}, datum.Platform) >= 0 ? 'Nintendo' : 'Other'`,
        as: "PlatformGroup"
      },
      {
        aggregate: [{ op: "sum", field: "Global_Sales", as: "year_sales" }],
        groupby: ["Year", "PlatformGroup"]
      }
    ],
    mark: { type: "area", interpolate: "monotone" },
    encoding: {
      x: { field: "Year", type: "quantitative", title: "Year", axis: { format: "d" } },
      y: { field: "year_sales", type: "quantitative", stack: "zero", title: "Global Sales (millions)" },
      color: {
        field: "PlatformGroup",
        type: "nominal",
        title: "Group",
        scale: {
          domain: ["Nintendo", "Other"],
          range: ["#d62728", "#1f77b4"]
        }
      },
      tooltip: [
        { field: "Year", type: "quantitative", title: "Year", format: "d" },
        { field: "PlatformGroup", type: "nominal", title: "Group" },
        { field: "year_sales", type: "quantitative", title: "Sales (M)", format: ".2f" }
      ]
    }
  };

  if (vis4aEl) vegaEmbed("#vis4a", vis4aSpec, { actions: false });
  if (vis4bEl) vegaEmbed("#vis4b", vis4bSpec, { actions: false });
}

window.addEventListener("DOMContentLoaded", () => {
  initPortfolioSVGVisuals();
  initAssignment3VegaLite();
});