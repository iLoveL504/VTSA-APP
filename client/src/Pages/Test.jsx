import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import LinkedList from "../DataStructs/LinkedList.js";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import "../css/Test1.css";
import tasks from '../data/TasksData.js'

const Test1 = () => {
  const testDate = "9/10/2025"
  const {projId} = useParams()
  const location = useLocation();
  const navigate = useNavigate()
  const itemRefs = useRef([]);
  const [selectedTaskID, setSelectedTaskID] = useState("");

  // ✅ Normalize helper
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); 
    return d;
  };

  const [linkedList, setLinkedList] = useState(() => {
    const ll = new LinkedList(testDate);
    tasks.forEach((t) => {
      if (t.start) t.start = normalizeDate(t.start);
      if (t.end) t.end = normalizeDate(t.end);
      ll.insertLast(t);
    });
    return ll;
  });
  
  const [actionType, setActionType] = useState(""); // "before" or "after"
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState(1);
  const [editDuration, setEditDuration] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ✅ End date calculator
  const FindEndOfProject = (startDate, numberofDays) => {
    let result = new Date(startDate);
    result.setDate(result.getDate() + numberofDays);
    result = normalizeDate(result); // strip time
    console.log(result);
  };

  const taskOnClick = (index, t) => {
    setSelectedTaskID(t.id);
  };

  const listArray = useMemo(() => linkedList.toArray(), [linkedList]);

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

    // Step 1: Create a temporary linked list from current data
    const tempLL = new LinkedList(testDate);
    listArray.forEach((task) => tempLL.insertLast(task));

    // Step 2: Generate a new unique ID for this parent
    const parentID = listArray[selectedIndex].parent || 500;
    const newID = tempLL.generateNewID(parentID);

    // Step 3: Build the new task (normalized start)
    const newTask = {
      id: newID,
      text: newTaskText,
      type: "task",
      start: normalizeDate(new Date()), // ✅ always midnight
      end: null,
      duration: parseInt(newTaskDuration),
      parent: parentID,
      percent: 0
    };

    // Step 4: Rebuild the linked list with the new task inserted
    const newLinkedList = new LinkedList(testDate);

    listArray.forEach((task, index) => {
      if (index === selectedIndex && actionType === "before") {
        newLinkedList.insertLast(newTask);
        newLinkedList.insertLast(task);
      } else if (index === selectedIndex && actionType === "after") {
        newLinkedList.insertLast(task);
        newLinkedList.insertLast(newTask);
      } else {
        newLinkedList.insertLast(task);
      }
    });

    // Step 5: Update state
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

    const newLinkedList = new LinkedList(testDate);
    
    listArray.forEach((task, index) => {
      if (index === selectedIndex) {
        const updatedTask = { 
          ...task, 
          duration: parseInt(editDuration),
          // ✅ normalize recomputed end if needed
          end: task.start 
            ? normalizeDate(new Date(task.start.getTime() + parseInt(editDuration) * 86400000)) 
            : null
        };
        newLinkedList.insertLast(updatedTask);
      } else {
        newLinkedList.insertLast(task);
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

    const newLinkedList = new LinkedList(testDate);

    listArray.forEach((task, index) => {
      if (index !== selectedIndex) {
        newLinkedList.insertLast(task);
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
    console.log(linkedList.toArray())
    console.log(location)
    navigate(`/projects/${projId}/schedule`, {state: { schedule: linkedList.toArray() }})
  };

  return (
    <div className="Content SchedulePage">
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

          <button 
            className="schedule-btn" 
            onClick={() => FindEndOfProject("9/22/2025", 10)}
          >
            <i className="fas fa-calculator"></i>
            Calculate End Date
          </button>
        </div>

        {/* Action Controls */}
        <div className="schedule-actions">
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
        <div className="schedule-tasks-grid">
          {listArray.map((t, index) => (
            <div
              onClick={() => taskOnClick(index, t)}
              key={index}
              className="task-card"
              ref={(el) => (itemRefs.current[index] = {el, t})}
            >
              <div className="task-header">
                <div className="task-title">
                  <h4>{t.text}</h4>
                  <span className="task-type">{t.type || "task"}</span>
                  <p>ID: {t.id}</p>
                </div>
                <span className={`task-status ${getStatusClass(t)}`}>
                  {t.completed ? "Completed" : "Active"}
                </span>
              </div>

              <div className="task-details">
                <div className="task-detail-item">
                  <i className="fas fa-clock"></i>
                  <span>Duration: {t.duration || 1} day(s)</span>
                </div>
                <div className="task-detail-item">
                  <i className="fas fa-project-diagram"></i>
                  <span>Parent: {t.parent || "None"}</span>
                </div>
              </div>

              <div className="task-dates">
                <p>
                  <span className="date-label">Start:</span>
                  <span className="date-value">
                    {t.start?.toLocaleDateString("en-GB") || "Not set"}
                  </span>
                </p>
                <p>
                  <span className="date-label">End:</span>
                  <span className="date-value">
                    {t.end?.toLocaleDateString("en-GB") || "Not set"}
                  </span>
                </p>
              </div>
            </div>
          ))}
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
          {/* You can change the icon to whatever you prefer */}
        </button>
      </div>
    </div>
  );
};

export default Test1;