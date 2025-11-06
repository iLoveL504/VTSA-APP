import tasksLite from '../data/TasksDataTesting.js'
import TaskDataTesting from '../data/TasksDataTesting.js'

/**
 * addWorkingDays:
 * - Returns an EXCLUSIVE end date (the day AFTER the last counted work day).
 * - start: Date (starting day, inclusive)
 * - days: integer number of working days
 * - isGovernment: if true -> calendar days (count every day)
 * - holidays: array of normalized date strings (toDateString)
 */
const addWorkingDays = (start, days, isGovernment = false, holidays = []) => {
  const date = new Date(start);
  // normalize to midnight to avoid timezone fuzz
  date.setHours(0, 0, 0, 0);

  let added = 0;
  // If days === 0 the exclusive end is just the start
  while (added < days) {
    date.setDate(date.getDate() + 1); // move to the next calendar day
    if (isGovernment) {
      added++;
    } else {
      const day = date.getDay();
      const isHoliday = holidays.includes(date.toDateString());
      if (day !== 0 && !isHoliday) { // skip Sundays and holidays for private projects
        added++;
      }
    }
  }
  // date now points to the day AFTER the last counted work day (exclusive end)
  return date;
};

class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

class LinkedList {
  constructor(date, isGovernment = false, holidays = []) {
    this.head = null;
    this.size = 0;
    this.date = new Date(date);
    this.isGovernment = !!isGovernment;
    // normalize holiday list to strings for quick comparisons
    this.holidays = (holidays || []).map((h) => new Date(h).toDateString());
    // Track postponed state
    this.postponed = false;
    this.postponedFromTask = null;
    this.postponedStartDate = null;
  }

  // Generate new ID
  generateNewID(parentID) {
    let current = this.head;
    let maxID = parentID || 0;
    while (current) {
      if (current.data.task_parent === parentID && current.data.task_id > maxID) {
        maxID = current.data.task_id;
      }
      current = current.next;
    }
    return maxID + 1;
  }

  // Find first task by text
  findTask(taskName) {
    let current = this.head;
    while (current) {
      if (current.data.task_name === taskName) return current.data;
      current = current.next;
    }
    return null;
  }

  // Find task by ID
  findTaskByID(taskID) {
    let current = this.head;
    while (current) {
      if (current.data.task_id === taskID) return current;
      current = current.next;
    }
    return null;
  }

  // Find previous node for a given node
  findPreviousNode(node) {
    if (!this.head || node === this.head) return null;
    
    let current = this.head;
    while (current && current.next !== node) {
      current = current.next;
    }
    return current;
  }

  // POSTPONE FEATURE: Mark project as postponed from a specific task
  postponeProject(fromTaskID) {
    const taskNode = this.findTaskByID(fromTaskID);
    if (!taskNode) {
      console.error(`Task with ID ${fromTaskID} not found`);
      return false;
    }

    this.postponed = true;
    this.postponedFromTask = taskNode;
    this.postponedStartDate = new Date(); // Record when postponement started
    console.log(`Project pd from task "${taskNode.data.task_name}"`);
    return true;
  }

  // POSTPONE FEATURE: Resume project after postponement with specified delay days
  resumeProject(postponedDays) {
    if (!this.postponed) {
      console.log("Project is not postponed");
      return false;
    }

    if (typeof postponedDays !== 'number' || postponedDays < 0) {
      console.error("Invalid postponed days. Must be a non-negative number.");
      return false;
    }

    console.log(`Resuming project asadfasdffter ${postponedDays} days postponement`);

    // Find the task where postponement started
    const postponedTask = this.postponedFromTask;
    if (!postponedTask) {
      console.error("Cannot find postponed task");
      return false;
    }

    // Add postponement days to all tasks starting from the postponed task
    this.addPostponementDelay(postponedTask, postponedDays);

    // Reset postponed state
    this.postponed = false;
    this.postponedFromTask = null;
    this.postponedStartDate = null;

    return true;
  }

  // Add postponement delay to tasks from a specific node onwards
  addPostponementDelay(fromNode, delayDays) {
    let current = fromNode;
    
    while (current) {
      // Add delay to both start and end dates
      if (current.data.task_start) {
        current.data.task_start = addWorkingDays(current.data.task_start, delayDays, this.isGovernment, this.holidays);
      }
      if (current.data.task_end) {
        current.data.task_end = addWorkingDays(current.data.task_end, delayDays, this.isGovernment, this.holidays);
      }
      
      current = current.next;
    }

    // Update parent durations after the delay
    this.updateAllParentDurations();
  }

  // Update all parent durations in the list
  updateAllParentDurations() {
    const parentIDs = new Set();
    let current = this.head;
    
    // Collect all parent IDs
    while (current) {
      if (current.data.task_parent && current.data.task_parent !== 0) {
        parentIDs.add(current.data.task_parent);
      }
      current = current.next;
    }
    
    // Update each parent
    parentIDs.forEach(parentID => {
      this.updateParentDuration(parentID);
    });
  }

  // Insert last node (append). Uses EXCLUSIVE end semantics (end is day after last workday)
  insertLast(data) {
    // Ensure task_id exists
    if (!data.task_id) {
      data.task_id = this.generateNewID(data.task_parent || 0);
    }

    const node = new Node({ ...data });
    // If empty list, seed from base date
    if (!this.head) {
      const start = new Date(this.date);
      start.setHours(0, 0, 0, 0);
      node.data.task_start = start;
      node.data.task_end = addWorkingDays(start, node.data.task_duration || 0, this.isGovernment, this.holidays);
      this.head = node;
      this.size++;
      // update parent durations if applicable
      if (node.data.task_parent && node.data.task_parent !== 0) this.updateParentDuration(node.data.task_parent);
      return;
    }

    // otherwise append after last node
    let current = this.head;
    while (current.next) current = current.next;

    // determine start for this node:
    // If last node is a summary we want child to start at summary.start (maintain grouping)
    // Otherwise start immediately at last node's end (end is exclusive, so no overlap)
    if (current.data.task_type === "summary") {
      node.data.task_start = new Date(current.data.task_start);
    } else {
      // start = previous.end (exclusive semantics -> correct)
      node.data.task_start = new Date(current.data.task_end);
    }
    node.data.task_start.setHours(0, 0, 0, 0);

    // compute exclusive end
    node.data.task_end = addWorkingDays(node.data.task_start, node.data.task_duration || 0, this.isGovernment, this.holidays);

    // Special-case concurrency: manufacturing should follow structural if available
    if (node.data.task_name === "Manufacturing and Importation Process") {
      const foundTask = this.findTask("Structural/Civil Works");
      if (foundTask && foundTask.task_start && foundTask.task_end) {
        node.data.task_start = new Date(foundTask.task_start);
        node.data.task_end = new Date(foundTask.task_end);
      }
    }

    current.next = node;
    this.size++;

    if (node.data.task_parent && node.data.task_parent !== 0) {
      this.updateParentDuration(node.data.task_parent);
    }
  }

  // Insert at index (0-based). Maintains exclusive-end semantics and updates following nodes start/end.
  insertAt(data, index) {
    if (!data.task_id) {
      data.task_id = this.generateNewID(data.task_parent || 0);
    }
    if (index < 0 || index > this.size) return;

    const node = new Node({ ...data });

    if (index === 0) {
      // new head: start at base date
      const start = new Date(this.date);
      start.setHours(0, 0, 0, 0);
      node.data.task_start = start;
      node.data.task_end = addWorkingDays(start, node.data.task_duration || 0, this.isGovernment, this.holidays);
      node.next = this.head;
      this.head = node;
      this.size++;
      // After inserting at head we must walk the list to recompute subsequent start/end
      this.recalculateFrom(node);
      if (node.data.task_parent && node.data.task_parent !== 0) this.updateParentDuration(node.data.task_parent);
      return;
    }

    let current = this.head, previous = null, count = 0;
    while (count < index && current) {
      previous = current;
      current = current.next;
      count++;
    }

    // place node between previous and current
    // Start = previous.end (exclusive)
    node.data.task_start = new Date(previous.data.task_end);
    node.data.task_start.setHours(0, 0, 0, 0);
    node.data.task_end = addWorkingDays(node.data.task_start, node.data.task_duration || 0, this.isGovernment, this.holidays);

    previous.next = node;
    node.next = current;
    this.size++;

    // recompute downstream nodes since we've shifted timeline
    this.recalculateFrom(node);
    if (node.data.task_parent && node.data.task_parent !== 0) this.updateParentDuration(node.data.task_parent);
  }

  // Recompute start/end for nodes AFTER the given starting node (exclusive of the node itself)
  // Because our end is exclusive, we set next.start = current.end (no overlap)
  recalculateFrom(startNode) {
    let current = startNode.next;
    let prev = startNode;
    while (current) {
      // if previous is summary, child may want to align to previous.start — keep existing group behavior
      if (prev.data.task_type === "summary") {
        // If current is child of that summary, align start to summary start
        if (current.data.task_parent === prev.data.task_id) {
          current.data.task_start = new Date(prev.data.task_start);
        } else {
          // otherwise continue after prev.end
          current.data.task_start = new Date(prev.data.task_end);
        }
      } else {
        current.data.task_start = new Date(prev.data.task_end);
      }
      current.data.task_start.setHours(0,0,0,0);
      current.data.task_end = addWorkingDays(current.data.task_start, current.data.task_duration || 0, this.isGovernment, this.holidays);

      prev = current;
      current = current.next;
    }
  }

  // Update parent duration/start/end derived from its children
  updateParentDuration(parentID) {
    if (!parentID || parentID === 0) return;

    let current = this.head;
    let parentNode = null;
    const childStartDates = [];
    const childEndDates = [];
    let totalDuration = 0;

    while (current) {
      if (current.data.task_id === parentID) parentNode = current;
      if (current.data.task_parent === parentID) {
        if (current.data.task_start && current.data.task_end) {
          childStartDates.push(new Date(current.data.task_start));
          childEndDates.push(new Date(current.data.task_end));
        }
        totalDuration += current.data.task_duration || 0;
      }
      current = current.next;
    }

    if (!parentNode) return;

    if (childStartDates.length > 0) {
      const earliest = new Date(Math.min(...childStartDates));
      const latest = new Date(Math.max(...childEndDates)); // exclusive end
      parentNode.data.task_start = earliest;
      parentNode.data.task_end = latest;
      // As requested: parent duration = sum of child durations (pure sum)
      parentNode.data.task_duration = totalDuration;
    }

    // recursion up the tree
    if (parentNode.data.task_parent && parentNode.data.task_parent !== 0) {
      this.updateParentDuration(parentNode.data.task_parent);
    }
  }

  // calculateDuration counts workdays from start (inclusive) up to end (exclusive)
  calculateDuration(start, end, isGovernment = false) {
    const s = new Date(start);
    const e = new Date(end);
    s.setHours(0,0,0,0);
    e.setHours(0,0,0,0);
    let count = 0;
    const holidays = this.holidays;

    while (s < e) {
      const day = s.getDay();
      const isHoliday = holidays.includes(s.toDateString());
      if (isGovernment || (day !== 0 && day !== 6) ) {
        // if you want to skip Saturday as well, adjust condition
        if (!(!isGovernment && isHoliday)) count++;
      }
      s.setDate(s.getDate() + 1);
    }
    return count;
  }

  // Get project status
  getProjectStatus() {
    return {
      postponed: this.postponed,
      postponedFromTask: this.postponedFromTask ? this.postponedFromTask.data.task_name : null,
      postponedFromTaskID: this.postponedFromTask ? this.postponedFromTask.data.task_id : null,
      postponedStartDate: this.postponedStartDate
    };
  }

  // Convert to array for UI
  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      // return shallow copy
      arr.push({ ...current.data });
      current = current.next;
    }
    return arr;
  }

  // Debug helper
  printListData() {
    let current = this.head;
    console.log("=== SCHEDULE ===");
    if (this.postponed) {
      console.log(`PROJECT POSTPONED from task "${this.postponedFromTask.data.task_name}"`);
    }
    while (current) {
      const s = current.data.task_start;
      const e = current.data.task_end;
      console.log(
        `${current.data.task_id} ${current.data.task_name} | start: ${s ? s.toDateString() : "?"} | end(excl): ${e ? e.toDateString() : "?"} | dur: ${current.data.task_duration}`
      );
      current = current.next;
    }
  }
}

// Example usage with postponement feature
const holidays = ['2025-06-03'];
const privateLL = new LinkedList(new Date("2025-06-01"), false, holidays);

// Map the test data to use database field names
const mappedTestData = TaskDataTesting.map(task => ({
  task_id: task.id,
  task_name: task.text,
  task_start: task.start,
  task_end: task.end,
  task_duration: task.duration,
  task_type: task.type,
  task_parent: task.parent
}));

mappedTestData.forEach((t) => privateLL.insertLast(t));

console.log("=== INITIAL SCHEDULE ===");
privateLL.printListData();

privateLL.postponeProject(103);

console.log("\n=== AFTER POSTPONEMENT (before resume) ===");
privateLL.printListData();

// Resume project - dates will adjust automatically
privateLL.resumeProject(8);

console.log("\n=== AFTER RESUME (dates adjusted) ===");
privateLL.printListData();

export default LinkedList;