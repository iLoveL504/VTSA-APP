// Group regions by island cluster
const regionGroups = {
  luzon: ["NCR", "Region I", "Region II", "Region III", "Region IV-A", "Region IV-B", "Region V", "CAR"],
  visayas: ["Region VI", "Region VII", "Region VIII"],
  mindanao: ["Region IX", "Region X", "Region XI", "Region XII", "Region XIII", "BARMM"]
};

// Function to get region group name
function getRegionGroup(region) {
  for (const [group, regions] of Object.entries(regionGroups)) {
    if (regions.includes(region)) return group;
  }
  return "unknown";
}

// Function to add months or years based on contract type
function getNextDate(currentDate, contractType) {
  const nextDate = new Date(currentDate);

  switch (contractType.toLowerCase()) {
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "quarterly":
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid contract type");
  }

  return nextDate;
}

// Sort PMS clients by region order (Luzon → Visayas → Mindanao)
function sortByRegionGroup(clients) {
  const order = ["luzon", "visayas", "mindanao"];
  return clients.sort((a, b) => {
    const groupA = getRegionGroup(a.region);
    const groupB = getRegionGroup(b.region);
    return order.indexOf(groupA) - order.indexOf(groupB);
  });
}

// Simulate finishing inspection and calculating next inspection date
function simulatePMS(clients) {
  const sorted = sortByRegionGroup(clients);

  return sorted.map(client => {
    const nextInspection = getNextDate(client.pms_inspection_date, client.contract_type);
    return {
      ...client,
      next_inspection_date: nextInspection.toISOString().split("T")[0]
    };
  });
}

// Example sample data (simulate a few clients)
const clients = [
  {
    id: 1,
    client: "SM Megamall",
    contract_type: "monthly",
    region: "NCR",
    pms_inspection_date: new Date("2025-10-25")
  },
  {
    id: 2,
    client: "Cebu Business Park",
    contract_type: "quarterly",
    region: "Region VII",
    pms_inspection_date: new Date("2025-10-27")
  },
  {
    id: 3,
    client: "Davao Tower",
    contract_type: "yearly",
    region: "Region XI",
    pms_inspection_date: new Date("2025-10-22")
  },
  {
    id: 4,
    client: "Ilocos Norte Hospital",
    contract_type: "monthly",
    region: "Region I",
    pms_inspection_date: new Date("2025-10-21")
  }
];

// Run simulation
const results = simulatePMS(clients);
console.table(results);
