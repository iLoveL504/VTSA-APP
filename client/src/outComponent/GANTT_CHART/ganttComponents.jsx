export const links = [
  {}
];

const dayStyle = (a) => {
  const day = a.getDay() === 5 || a.getDay() === 6;
  return day ? "sday" : "";
};

export const scales = [
  { unit: "year", step: 1, format: "yyyy" },
  { unit: "month", step: 2, format: "MMMM yyy" },
  { unit: "week", step: 1, format: "w" },
  { unit: "day", step: 1, format: "d", css: dayStyle },
];

export const taskTypes = [
  { id: "task", label: "Task" },
  { id: "summary", label: "Summary task" },
  { id: "milestone", label: "Milestone" },
  { id: "urgent", label: "Urgent" },
  { id: "narrow", label: "Narrow" },
  { id: "progress", label: "Progress" },
];

export const columns = [
  { id: "text", header: "Project Name", flexgrow: 2 },
  {
    id: "start",
    header: "START",
    flexgrow: 1,
    align: "center",
  },
  {
    id: "end",
    header: "END",
    flexgrow: 1,
    align: "center",
  },
  {
    id: "duration",
    header: "NO. of Days",
    align: "center",
    flexgrow: 1,
  },
  {
    id: "action",
    header: "",
    width: 50,
    align: "center",
  },
];

export default [columns, links, scales, taskTypes];