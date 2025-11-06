import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LinkedList from "../../../DataStructs/LinkedList.js";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import "../css/Test1.css";
import tasks from '../../../data/TasksData.js'
//import { useReactToPrint } from "react-to-print";
import { DatePickerInput } from '@mantine/dates';

const Test1 = () => {
  const {projId} = useParams()
  const navigate = useNavigate()
  const itemRefs = useRef([]);
  const [selectedTaskID, setSelectedTaskID] = useState("");
  const [isCalendarDays, setIsCalendarDays] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState(null);

  // ✅ Normalize helper
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); 
    return d;
  };

  // Helper functions to map between field name conventions
  const mapTaskToLinkedList = (task) => ({
    task_id: task.id || task.task_id,
    task_name: task.text || task.task_name,
    task_start: task.start ? normalizeDate(task.start) : (task.task_start ? normalizeDate(task.task_start) : null),
    task_end: task.end ? normalizeDate(task.end) : (task.task_end ? normalizeDate(task.task_end) : null),
    task_duration: task.duration || task.task_duration || 1,
    task_type: task.type || task.task_type || 'task',
    task_parent: task.parent || task.task_parent || 0,
    task_percent: task.percent_progress || task.task_percent || 0,
    section_title: task.section_title || 'General',
    wt: task.wt || 0.00,
    section_id: task.section_id || Math.floor(Math.random() * 900) + 100,
    item_code: task.item_code
  });

  const mapTaskFromLinkedList = (task) => ({
    id: task.task_id,
    text: task.task_name,
    start: task.task_start,
    end: task.task_end,
    duration: task.task_duration,
    type: task.task_type,
    parent: task.task_parent,
    percent: task.task_percent,
    section_title: task.section_title,
    wt: task.wt,
    section_id: task.section_id,
    // Include original fields for compatibility
    task_id: task.task_id,
    task_name: task.task_name,
    task_start: task.task_start,
    task_end: task.task_end,
    task_duration: task.task_duration,
    task_type: task.task_type,
    task_parent: task.task_parent
  });

  const [linkedList, setLinkedList] = useState(() => {
    const ll = new LinkedList(startDate, false);
    tasks.forEach((t) => {
      ll.insertLast(mapTaskToLinkedList(t));
    });
    return ll;
  });

  useEffect(() => {
    setLinkedList(() => {
      const ll = new LinkedList(startDate, isCalendarDays, holidays);
      tasks.forEach((t) => {
        ll.insertLast(mapTaskToLinkedList(t));
      });
      return ll;
    });
  }, [startDate, isCalendarDays, holidays]);

  const [actionType, setActionType] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState(1);
  const [editDuration, setEditDuration] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const FindEndOfProject = (startDate, numberofDays) => {
    let result = new Date(startDate);
    result.setDate(result.getDate() + numberofDays);
    result = normalizeDate(result);
  };

  const handleAddHoliday = () => {
    if (!newHoliday) return;
    const normalized = normalizeDate(newHoliday).toDateString();
    if (holidays.includes(normalized)) {
      alert("Holiday already exists!");
      return;
    }
    setHolidays((prev) => [...prev, normalized]);
    setNewHoliday(null);
  };

  const handleRemoveHoliday = (holiday) => {
    if (window.confirm(`Remove holiday ${holiday}?`)) {
      setHolidays((prev) => prev.filter((h) => h !== holiday));
    }
  };

  const taskOnClick = (t) => {
    setSelectedTaskID(t.id);
  };

  // Convert linked list to array and map field names for display
  const listArray = useMemo(() => 
    linkedList.toArray().map(mapTaskFromLinkedList), 
    [linkedList]
  );

  useEffect(() => {
    itemRefs.current.forEach((ref) => {
      if (ref?.el) {
        ref.el.classList.remove("task-selected");
      }
    });

    if (selectedTaskID) {
      const selectedRef = itemRefs.current.find((ir) => ir.t.id === selectedTaskID);
      if (selectedRef?.el) {
        selectedRef.el.classList.add("task-selected");
        selectedRef.el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedTaskID, listArray]);

  const getTaskIndex = (taskId) => {
    return listArray.findIndex(task => task.id === taskId);
  };

  const handleScheduleChange = (e) => {
    console.log('hi')
    setIsCalendarDays(e.target.value)
  };

  useEffect(() => {
    setLinkedList((prevLL) => {
      const currentTasks = prevLL.toArray();
      const newLL = new LinkedList(startDate, isCalendarDays);
      currentTasks.forEach(task => newLL.insertLast(task));
      return newLL;
    });
  }, [isCalendarDays]);

  const handleAddTask = (position) => {
    if (!selectedTaskID) {
      alert("Please select a task first");
      return;
    }
    setActionType(position);
    setIsModalOpen(true);
  };

  const confirmAddTask = () => {
    if (!newTaskText.trim() || newTaskDuration <= 0) {
      alert("Please enter valid task details");
      return;
    }

    const selectedIndex = getTaskIndex(selectedTaskID);
    if (selectedIndex === -1) return;

    // Create a temporary linked list from current data
    const tempLL = new LinkedList(startDate);
    listArray.forEach((task) => tempLL.insertLast(mapTaskToLinkedList(task)));
    
    // Generate a new unique ID for this parent
    const selectedTask = listArray[selectedIndex];
    const parentID = selectedTask.task_parent === 0 ? selectedTask.task_id
     : selectedTask.task_type === 'summary' ? selectedTask.task_id 
     : selectedTask.task_parent;
    
    const newID = tempLL.generateNewID(parentID);

    // Build the new task with database field names
    const newTask = {
      task_id: newID,
      task_name: newTaskText,
      task_type: "task",
      task_start: normalizeDate(new Date()),
      task_end: null,
      task_duration: parseInt(newTaskDuration),
      task_parent: parentID,
      task_percent: 0,
      section_title: 'General',
      wt: 0.00,
      section_id: Math.floor(Math.random() * 900) + 100
    };

    // Rebuild the linked list with the new task inserted
    const newLinkedList = new LinkedList(startDate);

    listArray.forEach((task, index) => {
      const taskToInsert = mapTaskToLinkedList(task);
      if (index === selectedIndex && actionType === "before") {
        newLinkedList.insertLast(newTask);
        newLinkedList.insertLast(taskToInsert);
      } else if (index === selectedIndex && actionType === "after") {
        newLinkedList.insertLast(taskToInsert);
        newLinkedList.insertLast(newTask);
      } else {
        newLinkedList.insertLast(taskToInsert);
      }
    });

    // Update state
    setLinkedList(newLinkedList);
    setSelectedTaskID(newID); 
    setNewTaskText("");
    setNewTaskDuration(1);
    setIsModalOpen(false);
    setActionType("");
  };

  const handleEditDuration = () => {
    if (!selectedTaskID) {
      alert("Please select a task first");
      return;
    }
    const selectedTask = listArray.find(task => task.id === selectedTaskID);
    setEditDuration(selectedTask.duration);
    setIsEditModalOpen(true);
  };

  const confirmEditDuration = () => {
    if (editDuration <= 0) {
      alert("Please enter a valid duration");
      return;
    }

    const selectedIndex = getTaskIndex(selectedTaskID);
    if (selectedIndex === -1) return;

    const newLinkedList = new LinkedList(startDate, isCalendarDays);
    
    listArray.forEach((task, index) => {
      if (index === selectedIndex) {
        const updatedTask = mapTaskToLinkedList({ 
          ...task, 
          duration: parseInt(editDuration)
        });
        newLinkedList.insertLast(updatedTask);
      } else {
        newLinkedList.insertLast(mapTaskToLinkedList(task));
      }
    });

    setLinkedList(newLinkedList);
    setEditDuration("");
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedTaskID) {
      alert("Please select a task first");
      return;
    }

    const selectedIndex = getTaskIndex(selectedTaskID);
    if (selectedIndex === -1) return;

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    const newLinkedList = new LinkedList(startDate);

    listArray.forEach((task, index) => {
      if (index !== selectedIndex) {
        newLinkedList.insertLast(mapTaskToLinkedList(task));
      }
    });
 
    setLinkedList(newLinkedList);
    setSelectedTaskID("");
  };

  const getStatusClass = (task) => {
    if (task.completed) return "status-completed";
    if (task.start && new Date(task.start) > new Date()) return "status-pending";
    return "status-active";
  };

  const handleNavigate = () => {
    navigate(`/projects/${projId}/schedule`, {
      state: { 
        schedule: linkedList.toArray(), 
        holiday: holidays, 
        toggle: isCalendarDays 
      }
    });
  };

  return (
    <div className="Content SchedulePage">
      <div className='schedule-area'>
        <div className="schedule-page">
        <h2>Customize Project Schedule</h2>

        {/* Controls */}
        <div className="schedule-controls">
          <Box className="schedule-select-container">
            <FormControl fullWidth>
              <InputLabel id="task-select-label">Select Task</InputLabel>
              <Select
                labelId="task-select-label"
                id="task-select"
                value={selectedTaskID}
                onChange={(e) => setSelectedTaskID(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 200, overflowY: "auto" },
                  },
                }}
              >
                {listArray.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

        </div>

        {/* Action Controls */}
        <div className="schedule-actions">
          <DatePickerInput
            label="Start date"
            placeholder="Start date"
            value={startDate}
            onChange={setStartDate}
          />
          <FormControl className="form-control-professional" size="small">
            <InputLabel id="parent-select-label">Schedule Type</InputLabel>
            <Select
              labelId="parent-select-label"
              id="parent-select"
              value={isCalendarDays}
              label="Schedule Type"
              onChange={handleScheduleChange}
            >
              <MenuItem value={false}>Private (Working Days)</MenuItem>
              <MenuItem value={true}>Government (Calendar Days)</MenuItem>
            </Select>
          </FormControl>
          <button 
            className="action-btn before-btn"
            onClick={() => handleAddTask("before")}
            disabled={!selectedTaskID}
          >
            <i className="fas fa-arrow-left"></i>
            Add Before
          </button>
          
          <button 
            className="action-btn after-btn"
            onClick={() => handleAddTask("after")}
            disabled={!selectedTaskID}
          >
            <i className="fas fa-arrow-right"></i>
            Add After
          </button>
          
          <button 
            className="action-btn edit-btn"
            onClick={handleEditDuration}
            disabled={!selectedTaskID}
          >
            <i className="fas fa-edit"></i>
            Edit Duration
          </button>

          <button 
            className="action-btn edit-btn"
            onClick={handleDelete}
            disabled={!selectedTaskID}
          >
            <i className="fas fa-trash"></i>
            Delete
          </button>
        </div>

        {/* Task Cards Grid */}
        <div className="schedule-table-container">
          <div className="table-header">
            <h3>Project Schedule</h3>
            <div className="table-stats">
              <span className="stat">
                <i className="fas fa-tasks"></i>
                Total: {listArray.length} tasks
              </span>
            </div>
          </div>

          <div className="schedule-table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th className="col-order">#</th>
                  <th className="col-task">Task</th>
                  <th className="col-type">Type</th>
                  <th className="col-duration">Duration</th>
                  <th className="col-dates">Start - End</th>
                  <th className="col-status">Status</th>
                </tr>
              </thead>
              <tbody>
                {listArray.map((task, index) => {
                  const indentLevel = task.level || 0;
                  const isParent = task.type === 'parent';
                  const isSummary = task.type === 'summary';
                  const isTask = task.type === 'task';
                  
                  return (
                    <tr 
                      key={task.id}
                      className={`
                        task-row 
                        ${selectedTaskID === task.id ? 'selected' : ''}
                        ${isParent ? 'row-parent' : ''}
                        ${isSummary ? 'row-summary' : ''}
                        ${isTask ? 'row-task' : ''}
                      `}
                      onClick={() => taskOnClick(task)}
                      style={{ 
                        paddingLeft: `${indentLevel * 20}px`,
                        cursor: 'pointer'
                      }}
                    >
                      <td className="col-order">
                        <div className="task-order">
                          {index + 1}
                        </div>
                      </td>

                      <td className="col-task">
                        <div 
                          className="task-name-cell"
                          style={{ paddingLeft: `${indentLevel * 20 + 8}px` }}
                        >
                          {indentLevel > 0 && (
                            <div className="task-indent-guides">
                              {Array.from({ length: indentLevel }).map((_, i) => (
                                <div key={i} className="indent-guide"></div>
                              ))}
                            </div>
                          )}
                          <div className="task-name-content">
                            {isParent && <i className="fas fa-folder-open parent-icon"></i>}
                            {isSummary && <i className="fas fa-layer-group summary-icon"></i>}
                            {isTask && <i className="fas fa-tasks task-icon"></i>}
                            <span className="task-text">{task.text}</span>
                            {task.parent !== 0 && task.parent && (
                              <span className="parent-id">(Parent: {task.parent})</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="col-type">
                        <span className={`task-type-badge ${task.type}`}>
                          {task.type || 'task'}
                        </span>
                      </td>

                      <td className="col-duration">
                        <div className="duration-cell">
                          <i className="fas fa-clock"></i>
                          {task.duration || 1} day(s)
                        </div>
                      </td>

                      <td className="col-dates">
                        <div className="dates-cell">
                          <div className="date-range">
                            <span className="date-start">
                              {task.start?.toLocaleDateString("en-GB") || "Not set"}
                            </span>
                            <i className="fas fa-arrow-right date-arrow"></i>
                            <span className="date-end">
                              {task.end?.toLocaleDateString("en-GB") || "Not set"}
                            </span>
                          </div>
                          {task.start && task.end && (
                            <div className="date-duration">
                              ({task.duration || 1} days)
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="col-status">
                        <span className={`status-badge ${getStatusClass(task)}`}>
                          {task.completed ? 'Completed' : 
                          task.start && new Date(task.start) > new Date() ? 'Pending' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {listArray.length === 0 && (
              <div className="table-empty-state">
                <i className="fas fa-calendar-plus"></i>
                <h4>No Tasks Scheduled</h4>
                <p>Start by adding tasks to your project schedule</p>
              </div>
            )}
          </div>
        </div>

        {listArray.length === 0 && (
          <div className="schedule-empty">
            <i className="fas fa-calendar-times"></i>
            <h3>No Tasks Scheduled</h3>
            <p>Add tasks to see them displayed here</p>
          </div>
        )}

        {/* Add Task Modal */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="schedule-modal">
            <h3>Add Task {actionType === "before" ? "Before" : "After"} Selected Task</h3>
            <TextField
              label="Task Description"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Duration (days)"
              type="number"
              value={newTaskDuration}
              onChange={(e) => setNewTaskDuration(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
            />
            <div className="modal-actions">
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={confirmAddTask}>
                Add Task
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Duration Modal */}
        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <div className="schedule-modal">
            <h3>Edit Task Duration</h3>
            <TextField
              label="Duration (days)"
              type="number"
              value={editDuration}
              onChange={(e) => setEditDuration(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
            />
            <div className="modal-actions">
              <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={confirmEditDuration}>
                Update Duration
              </Button>
            </div>
          </div>
        </Modal>

        {/* Floating Action Button */}
        <button className="floating-action-button" onClick={handleNavigate}>
          <i className="fas fa-arrow-right"></i>
        </button>
        </div>

        {/* Holiday Section */}
        <div className="schedule-sidebar">
          <div className="holiday-section">
            <div className="holiday-header">
              <h3>
                <i className="fas fa-umbrella-beach"></i>
                Project Holidays
              </h3>
              <span className="holiday-count">{holidays.length} days</span>
            </div>

            <div className="holiday-add-card">
              <h4>Add New Holiday</h4>
              <div className="holiday-input-group">
                <DatePickerInput
                  placeholder="Select holiday date"
                  value={newHoliday}
                  onChange={setNewHoliday}
                  style={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  className="add-holiday-btn"
                  onClick={handleAddHoliday}
                  disabled={!newHoliday}
                >
                  <i className="fas fa-plus"></i>
                  Add
                </Button>
              </div>
            </div>

            <div className="holiday-list-section">
              <h4>Holiday List</h4>
              {holidays.length > 0 ? (
                <div className="holiday-list">
                  {holidays.map((h, idx) => (
                    <div key={idx} className="holiday-item">
                      <div className="holiday-info">
                        <i className="fas fa-calendar-day"></i>
                        <span className="holiday-date">{h}</span>
                      </div>
                      <Button
                        color="error"
                        size="small"
                        className="remove-holiday-btn"
                        onClick={() => handleRemoveHoliday(h)}
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="holiday-empty">
                  <i className="fas fa-calendar-plus"></i>
                  <p>No holidays added yet</p>
                  <span>Add holidays to exclude them from schedule calculations</span>
                </div>
              )}
            </div>

            <div className="holiday-info-card">
              <h4>
                <i className="fas fa-info-circle"></i>
                About Holidays
              </h4>
              <p>Holidays are excluded from working day calculations and will affect task end dates.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Test1;