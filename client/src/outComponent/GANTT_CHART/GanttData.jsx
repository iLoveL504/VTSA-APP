
class ProjectTasks{
  
  constructor(date) {
    this.today = date
    this.offset = (days) => new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + days);
    this.tasks = [
    {
      id: 500,
      text: "Mechanical Installation (Passenger Elevator)",
      type: "summary",
      parent: 0,
      open: true,
      start: this.offset(0),   // origin date = dateVariable
      duration: 45,
    },
    {
      id: 10,
      text: "Unloading of elevator equipments",
      type: "task",
      parent: 500,
      start: this.offset(0),   // 90 → (dateVariable + 0)
      duration: 1,
    },
    {
      id: 11,
      text: "Scaffolding Installation",
      type: "task",
      parent: 500,
      start: this.offset(1),   // 91 → (dateVariable + 1)
      duration: 2,
    },
    {
      id: 12,
      text: "Hauling Works",
      type: "task",
      parent: 500,
      start: this.offset(3),   // 93 → (dateVariable + 3)
      duration: 2,
    },
    {
      id: 13,
      text: "Template Setting",
      type: "task",
      parent: 500,
      start: this.offset(5),   // 95 → (dateVariable + 5)
      duration: 2,
    },
    {
      id: 14,
      text: "Marking and Boring of Holes",
      type: "task",
      parent: 500,
      start: this.offset(7),   // 97 → (dateVariable + 7)
      duration: 1,
    },
    {
      id: 15,
      text: "Rail Bracket Installation",
      type: "task",
      parent: 500,
      start: this.offset(8),   // 98 → (dateVariable + 8)
      duration: 2,
    },
    {
      id: 16,
      text: "Guide Rail Setting",
      type: "task",
      parent: 500,
      open: false,
      start: this.offset(10),  // 100 → (dateVariable + 10)
      end: this.offset(15),    // 105 → (dateVariable + 15)
      duration: 5,
    },
    {
      id: 17,
      text: "Main/Car",
      type: "task",
      start: this.offset(10),
      duration: 2,
      parent: 16,
    },
    {
      id: 18,
      text: "Counterweight (CWT)",
      type: "task",
      start: this.offset(12),
      duration: 2,
      parent: 16,
    },
    {
      id: 19,
      text: "Gauging",
      type: "task",
      start: this.offset(14),
      duration: 1,
      parent: 16,
    },
    {
      id: 20,
      text: "Landing Door Assembly",
      type: "task",
      parent: 500,
      open: false,
      start: this.offset(15),
      end: this.offset(21),
      duration: 6,
    },
    {
      id: 21,
      text: "Sills and Supports",
      type: "task",
      start: this.offset(15),
      duration: 2,
      parent: 20,
    },
    {
      id: 22,
      text: "Jamb and Supports",
      type: "task",
      start: this.offset(17),
      duration: 2,
      parent: 20,
    },
    {
      id: 23,
      text: "Frame and Doors",
      type: "task",
      start: this.offset(19),
      duration: 2,
      parent: 20,
    },
    {
      id: 24,
      text: "M/R Equipment Setting",
      type: "task",
      parent: 500,
      open: false,
      start: this.offset(21),
      end: this.offset(27),
      duration: 6,
    },
    {
      id: 25,
      text: "Traction Machine",
      type: "task",
      start: this.offset(21),
      duration: 2,
      parent: 24,
    },
    {
      id: 26,
      text: "Support Beams",
      type: "task",
      start: this.offset(23),
      duration: 2,
      parent: 24,
    },
    {
      id: 27,
      text: "Governor",
      type: "task",
      start: this.offset(25),
      duration: 2,
      parent: 24,
    },
    {
      id: 28,
      text: "Installation of Control Panel",
      type: "task",
      parent: 500,
      start: this.offset(27),
      duration: 2,
    },
    {
      id: 29,
      text: "Car Assembly",
      type: "task",
      parent: 500,
      open: false,
      start: this.offset(29),
      end: this.offset(32),
      duration: 3,
    },
    {
      id: 30,
      text: "All Accessories",
      type: "task",
      start: this.offset(29),
      duration: 2,
      parent: 29,
    },
    {
      id: 31,
      text: "Car Piping/Wiring",
      type: "task",
      start: this.offset(31),
      duration: 1,
      parent: 29,
    },
    {
      id: 32,
      text: "Travelling Cable Layout",
      type: "task",
      start: this.offset(32),
      parent: 500,
      duration: 2,
    },
    {
      id: 33,
      text: "Counterweight Assembly",
      type: "task",
      start: this.offset(34),
      parent: 500,
      duration: 2,
    },
    {
      id: 34,
      text: "Laying out of Ropes",
      type: "task",
      parent: 500,
      open: false,
      start: this.offset(36),
      end: this.offset(41),
      duration: 5,
    },
    {
      id: 35,
      text: "Hoisting",
      type: "task",
      start: this.offset(36),
      duration: 2,
      parent: 34,
    },
    {
      id: 36,
      text: "Governor",
      type: "task",
      start: this.offset(38),
      duration: 2,
      parent: 34,
    },
    {
      id: 37,
      text: "Compensating",
      type: "task",
      start: this.offset(40),
      duration: 1,
      parent: 34,
    },
    {
      id: 38,
      text: "Wiring",
      type: "task",
      parent: 500,
      open: false,
      start: this.offset(41),
      end: this.offset(43),
      duration: 2,
    },
    {
      id: 39,
      text: "Machine Room",
      type: "task",
      start: this.offset(41),
      duration: 1,
      parent: 38,
    },
    {
      id: 40,
      text: "Hoistway",
      type: "task",
      start: this.offset(42),
      duration: 1,
      parent: 38,
    },
    {
      id: 41,
      text: "Installation of Pit Ladder / Hoistway Lighting",
      type: "task",
      parent: 500,
      start: this.offset(43),
      duration: 2,
    },

    // Testing and Commissioning
    {
      id: 600,
      text: "Testing and Commissioning (Passenger Elevator)",
      type: "summary",
      parent: 0,
      open: true,
      start: this.offset(45),
      end: this.offset(60),
      duration: 15,
    },
    {
      id: 42,
      text: "Initial testing",
      type: "task",
      start: this.offset(45),
      duration: 3,
      parent: 600,
    },
    {
      id: 43,
      text: "Slow speed",
      type: "task",
      start: this.offset(48),
      duration: 2,
      parent: 600,
    },
    {
      id: 44,
      text: "High speed and Mechanical Adjustment",
      type: "task",
      start: this.offset(50),
      duration: 2,
      parent: 600,
    },
    {
      id: 45,
      text: "Load Test",
      type: "task",
      start: this.offset(52),
      duration: 2,
      parent: 600,
    },
    {
      id: 46,
      text: "Final Adjust",
      type: "task",
      start: this.offset(54),
      duration: 2,
      parent: 600,
    },
    {
      id: 47,
      text: "Features Test / Correction of Defects",
      type: "task",
      start: this.offset(56),
      duration: 2,
      parent: 600,
    },
    {
      id: 48,
      text: "Final Cleaning / Hand over",
      type: "task",
      start: this.offset(58),
      duration: 2,
      parent: 600,
    },
  ];
  }
  
  buildPayload() {
    function toMySQLDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const avoidValues = [600, 500, 16, 20, 24, 29, 34, 38];


    const taskColumnMap = {
      10: "unloading_equipment_date",
      11: "scaffolding_date",
      12: "hauling_date",
      13: "template_date",
      14: "boring_holes_date",
      15: "rail_bracket_date",
      17: "guide_rail_car_date",
      18: "guide_rail_cwt_date",
      19: "guide_rail_gauge_date",
      21: "door_sills_date",
      22: "door_jamb_date",
      23: "door_frame_date",
      25: "machine_traction_date",
      26: "machine_beams_date",
      27: "machine_governor_date",
      28: "control_panel_date",
      30: "car_accessories_date",
      31: "car_wiring_date",
      32: "travelling_cable_date",
      33: "counterweight_date",
      35: "ropes_hoisting_date",
      36: "ropes_governor_date",
      37: "ropes_compensating_date",
      39: "wiring_mr_date",
      40: "wiring_hoistway_date",
      41: "pit_ladder_date",
      42: "initial_test_date",
      43: "slow_speed_date",
      44: "high_speed_date",
      45: "load_test_date",
      46: "final_adjust_date",
      47: "features_test_date",
      48: "handover_date"
    };


    const payload = {};
    this.tasks
      .filter(t => !avoidValues.includes(t.id))
      .forEach(t => {
        const endDate = new Date(t.start);
        endDate.setDate(endDate.getDate() + t.duration);

        const col = taskColumnMap[t.id];
        if (col) {
          payload[col] = toMySQLDate(t.start);
          payload[col.replace("_date", "_end_date")] = toMySQLDate(endDate);
        }
      });

    return payload;
  }


}

export default ProjectTasks;
