const dayStyle = (a) => {
  const day = a.getDay() === 5 || a.getDay() === 6;
  return day ? "sday" : "";
};

const zoomConfig = {
  maxCellWidth: 400,
  level: 3,
  levels: [
    {
      minCellWidth: 200,
      scales: [{ unit: "year", step: 1, format: "yyyy" }],
    },
    {
      minCellWidth: 150,
      scales: [
        { unit: "year", step: 1, format: "yyyy" },
        { unit: "quarter", step: 1, format: "QQQQ" },
      ],
    },
    {
      minCellWidth: 250,
      scales: [
        { unit: "quarter", step: 1, format: "QQQQ" },
        { unit: "month", step: 1, format: "MMMM yyy" },
      ],
    },
    {
      minCellWidth: 100,
      scales: [
        { unit: "month", step: 1, format: "MMMM yyy" },
        { unit: "week", step: 1, format: "'week' w" },
      ],
    },
    {
      maxCellWidth: 200,
      scales: [
        { unit: "month", step: 1, format: "MMMM yyy" },
        { unit: "day", step: 1, format: "d", css: dayStyle },
      ],
    },
    {
      minCellWidth: 25,
      scales: [
        { unit: "day", step: 1, format: "MMM d", css: dayStyle },
        { unit: "hour", step: 6, format: "HH:mm" },
      ],
    },
    {
      scales: [
        { unit: "day", step: 1, format: "MMM d", css: dayStyle },
        { unit: "hour", step: 1, format: "HH:mm" },
      ],
    },
  ],
};

export default zoomConfig;