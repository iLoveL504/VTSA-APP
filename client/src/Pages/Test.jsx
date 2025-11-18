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
import { DatePickerInput } from '@mantine/dates';

// MUI Icons - Using more common alternatives
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import TaskIcon from '@mui/icons-material/Task';
// Alternatives for missing icons
import ViewModuleIcon from '@mui/icons-material/ViewModule'; // Instead of Layers
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Instead of Info
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // Instead of NavigateNext

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
    task_percent: task.percent_progress,
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
    task_parent: task.task_parent,
    percent_progress: task.task_percent,
    item_code: task.item_code
  });

  const [linkedList, setLinkedList] = useState(() => {
    const ll = new LinkedList(startDate, false, holidays);
    tasks.forEach((t) => {
      console.log(t)
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
    console.log(t)
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
      console.log(itemRefs.current)
      if (selectedRef?.el) {
        selectedRef.el.classList.add("task-selected");
        selectedRef.el.scrollIntoView({ behavior: "smooth", block: "center" });
        console.log(selectedRef)
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
      const newLL = new LinkedList(startDate, isCalendarDays, holidays);
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
    const tempLL = new LinkedList(startDate, isCalendarDays, holidays);
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
    const newLinkedList = new LinkedList(startDate, isCalendarDays, holidays);

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

    const newLinkedList = new LinkedList(startDate, isCalendarDays, holidays);
    
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

    const newLinkedList = new LinkedList(startDate, isCalendarDays, holidays);

    listArray.forEach((task, index) => {
      console.log(task)
      if (index === selectedIndex) {
        if (task.task_type === 'summary') {
          window.alert('Cannot delete a summary')
          
          newLinkedList.insertLast(mapTaskToLinkedList(task));
          return
        }
      } else  {
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
      <div className="dashboard-header">
        <h1>Project Schedule Builder</h1>
        <p>Create and manage your project timeline with task dependencies</p>
      </div>

      <div className='schedule-area'>
        <div className="schedule-main">
          {/* Controls Section */}
          <div className="control-panel">
            <div className="panel-grid">
              {/* Task Selection */}
              <div className="panel-card">
                <div className="panel-header">
                  <TaskIcon style={{ marginRight: '8px' }} />
                  <h3>Task Selection</h3>
                </div>
                <div className="panel-content">
                  <FormControl fullWidth size="small">
                    <InputLabel id="task-select-label">Select Task to Modify</InputLabel>
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
                </div>
              </div>

              {/* Project Settings */}
              <div className="panel-card">
                <div className="panel-header">
                  <ScheduleIcon style={{ marginRight: '8px' }} />
                  <h3>Project Settings</h3>
                </div>
                <div className="panel-content">
                  <div className="settings-grid">
                    <DatePickerInput
                      label="Project Start Date"
                      placeholder="Select start date"
                      value={startDate}
                      onChange={setStartDate}
                      excludeDate={date =>  {
                        if (!isCalendarDays) {
                          if (new Date(date).getDay() === 6 || new Date(date).getDay() === 0) return true
                        } else return false
                      }}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel id="schedule-type-label">Schedule Type</InputLabel>
                      <Select
                        labelId="schedule-type-label"
                        id="schedule-type"
                        value={isCalendarDays}
                        label="Schedule Type"
                        onChange={handleScheduleChange}
                      >
                        <MenuItem value={false}>Working Days (Private)</MenuItem>
                        <MenuItem value={true}>Calendar Days (Government)</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="action-panel">
            <div className="action-header">
              <h3>Task Actions</h3>
              <span className="action-help">Select a task first to enable actions</span>
            </div>
            <div className="action-buttons">
              <button 
                className="action-btn primary"
                onClick={() => handleAddTask("before")}
                disabled={!selectedTaskID}
              >
                <AddIcon style={{ fontSize: '16px', marginRight: '6px' }} />
                Add Before
              </button>
              
              <button 
                className="action-btn primary"
                onClick={() => handleAddTask("after")}
                disabled={!selectedTaskID}
              >
                <AddIcon style={{ fontSize: '16px', marginRight: '6px' }} />
                Add After
              </button>
              
              <button 
                className="action-btn secondary"
                onClick={handleEditDuration}
                disabled={!selectedTaskID}
              >
                <EditIcon style={{ fontSize: '16px', marginRight: '6px' }} />
                Edit Duration
              </button>

              <button 
                className="action-btn danger"
                onClick={handleDelete}
                disabled={!selectedTaskID}
              >
                <DeleteIcon style={{ fontSize: '16px', marginRight: '6px' }} />
                Delete Task
              </button>
            </div>
          </div>

          {/* Task Schedule Table */}
          <div className="schedule-table-container">
            <div className="table-header">
              <div className="table-title">
                <CalendarMonthIcon style={{ marginRight: '8px' }} />
                <h3>Project Schedule</h3>
              </div>
              <div className="table-stats">
                <span className="stat-badge">
                  <TaskIcon style={{ fontSize: '14px', marginRight: '4px' }} />
                  {listArray.length} tasks
                </span>
                <span className="stat-badge">
                  <ScheduleIcon style={{ fontSize: '14px', marginRight: '4px' }} />
                  {isCalendarDays ? 'Calendar Days' : 'Working Days'}
                </span>
              </div>
            </div>

            <div className="schedule-table-wrapper">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th className="col-order">#</th>
                    <th className="col-task">Task Name</th>
                    <th className="col-type">Type</th>
                    <th className="col-duration">Duration</th>
                    <th className="col-dates">Start - End Date</th>
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
                        ref={(el) => itemRefs.current[index] = {t: task, el: el}}
                      >
                        <td className="col-order">
                          <div className="task-order">
                            {index + 1}
                          </div>
                        </td>

                        <td className="col-task">
                          <div 
                            className="task-name-cell"
                            style={{ paddingLeft: `${indentLevel * 20 + 12}px` }}
                          >
                            {indentLevel > 0 && (
                              <div className="task-indent-guides">
                                {Array.from({ length: indentLevel }).map((_, i) => (
                                  <div key={i} className="indent-guide"></div>
                                ))}
                              </div>
                            )}
                            <div className="task-name-content">
                              {isParent && <FolderOpenIcon className="parent-icon" />}
                              {isSummary && <ViewModuleIcon className="summary-icon" />}
                              {isTask && <TaskIcon className="task-icon" />}
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
                            <ScheduleIcon style={{ fontSize: '14px', marginRight: '6px', color: '#6c757d' }} />
                            {task.duration || 1} day{task.duration !== 1 ? 's' : ''}
                          </div>
                        </td>

                        <td className="col-dates">
                          <div className="dates-cell">
                            <div className="date-range">
                              <span className="date-start">
                                {task.start?.toLocaleDateString("en-GB") || "Not set"}
                              </span>
                              <ChevronRightIcon style={{ fontSize: '14px', margin: '0 8px', color: '#6c757d' }} />
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
                  <CalendarMonthIcon style={{ fontSize: '48px', color: '#dee2e6', marginBottom: '16px' }} />
                  <h4>No Tasks Scheduled</h4>
                  <p>Start by adding tasks to your project schedule</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Holiday Section Sidebar */}
        <div className="schedule-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-header">
              <EventBusyIcon style={{ marginRight: '8px' }} />
              <h3>Project Holidays</h3>
              <span className="holiday-count">{holidays.length} days</span>
            </div>

            <div className="holiday-add-section">
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
                  size="small"
                >
                  <AddIcon style={{ fontSize: '16px', marginRight: '4px' }} />
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
                        <CalendarMonthIcon style={{ fontSize: '14px', marginRight: '8px', color: '#6c757d' }} />
                        <span className="holiday-date">{h}</span>
                      </div>
                      <Button
                        color="error"
                        size="small"
                        className="remove-holiday-btn"
                        onClick={() => handleRemoveHoliday(h)}
                      >
                        <DeleteIcon style={{ fontSize: '14px' }} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="holiday-empty">
                  <EventBusyIcon style={{ fontSize: '32px', color: '#dee2e6', marginBottom: '8px' }} />
                  <p>No holidays added yet</p>
                  <span>Add holidays to exclude them from schedule calculations</span>
                </div>
              )}
            </div>

            <div className="info-card">
              <div className="info-header">
                <InfoOutlinedIcon style={{ fontSize: '16px', marginRight: '6px', color: '#17a2b8' }} />
                <h4>About Holidays</h4>
              </div>
              <p>Holidays are excluded from working day calculations and will affect task end dates in the schedule.</p>
            </div>
          </div>

          {/* Navigation Button */}
          <button className="navigation-button" onClick={handleNavigate}>
            <ArrowForwardIcon style={{ fontSize: '16px', marginRight: '6px' }} />
            View Gantt Chart
          </button>
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="schedule-modal">
          <div className="modal-header">
            <AddIcon style={{ marginRight: '8px' }} />
            <h3>Add Task {actionType === "before" ? "Before" : "After"} Selected Task</h3>
          </div>
          <div className="modal-content">
            <TextField
              label="Task Description"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Duration (days)"
              type="number"
              value={newTaskDuration}
              onChange={(e) => setNewTaskDuration(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
              variant="outlined"
            />
          </div>
          <div className="modal-actions">
            <Button onClick={() => setIsModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button variant="contained" onClick={confirmAddTask} className="btn-primary">
              Add Task
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Duration Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="schedule-modal">
          <div className="modal-header">
            <EditIcon style={{ marginRight: '8px' }} />
            <h3>Edit Task Duration</h3>
          </div>
          <div className="modal-content">
            <TextField
              label="Duration (days)"
              type="number"
              value={editDuration}
              onChange={(e) => setEditDuration(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
              variant="outlined"
            />
          </div>
          <div className="modal-actions">
            <Button onClick={() => setIsEditModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button variant="contained" onClick={confirmEditDuration} className="btn-primary">
              Update Duration
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Test1;