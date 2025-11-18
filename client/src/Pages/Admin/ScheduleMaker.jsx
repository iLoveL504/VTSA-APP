import React, { useState, useEffect } from 'react';
import { 
  Box, 
  InputLabel, 
  MenuItem, 
  FormControl, 
  Select, 
  TextField, 
  Button,
  Modal,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ContentCopy as DuplicateIcon,
  Cancel as CancelIcon,
  FolderOpen as FolderIcon,
  Task as TaskIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';

// Default templates data (same as your original)
const DEFAULT_TEMPLATES = {
  passenger_elevator: {
    name: "Passenger Elevator",
    description: "Standard passenger elevator installation procedure",
    tasks: [
      {
        id: 100,
        text: "Preliminaries",
        type: "summary",
        duration: 15,
        parent: 0,
        open: true,
        percent_progress: 0,
      },
      {
        id: 101,
        text: "Pre-Inspection(Checkin of Shaft)",
        type: "task",
        duration: 6,
        parent: 100,
        percent_progress: 0,
      },
      {
        id: 102,
        text: "Layout of Drawing",
        type: "task",
        duration: 3,
        parent: 100,
        percent_progress: 0,
      },
      {
        id: 103,
        text: "Submission of Drawing and Finishes for Approval",
        type: "task",
        duration: 5,
        parent: 100,
        percent_progress: 0,
      },
      {
        id: 104,
        text: "Submission of PO to Factory",
        type: "task",
        duration: 1,
        parent: 100,
        percent_progress: 0,
      },
      {
        id: 200,
        text: "Structural/Civil Works",
        type: "summary",
        duration: 47,
        parent: 0,
        open: true,
        percent_progress: 0,
      },
      {
        id: 201,
        text: "Shaft Construction",
        type: "task",
        duration: 47,
        parent: 200,
        percent_progress: 0,
      },
      // ... include all your tasks
    ]
  },
  escalator: {
    name: "Escalator",
    description: "Standard escalator installation procedure",
    tasks: [
      {
        id: 100,
        text: "Preliminaries",
        type: "summary",
        duration: 15,
        parent: 0,
        open: true,
        percent_progress: 0,
      },
      {
        id: 101,
        text: "Site Preparation",
        type: "task",
        duration: 5,
        parent: 100,
        percent_progress: 0,
      },
      {
        id: 102,
        text: "Truss Installation",
        type: "task",
        duration: 10,
        parent: 100,
        percent_progress: 0,
      },
    ]
  }
};

const ScheduleTemplateManager = () => {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [currentTemplate, setCurrentTemplate] = useState('passenger_elevator');
  const [tasks, setTasks] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedTask, setSelectedTask] = useState(null);

  // Task form state
  const [newTask, setNewTask] = useState({
    text: '',
    type: 'task',
    duration: 1,
    parent: 0,
    section_title: '',
    wt: 0,
    item_code: ''
  });

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks when template changes
  useEffect(() => {
    if (templates[currentTemplate]) {
      const template = templates[currentTemplate];
      setTasks(template.tasks);
      setTemplateName(template.name);
      setTemplateDescription(template.description);
      
      // Expand all summary groups by default
      const summaryIds = template.tasks
        .filter(task => task.type === 'summary')
        .map(task => task.id);
      setExpandedGroups(new Set(summaryIds));
    }
  }, [currentTemplate, templates]);

  // Get visible tasks based on expanded state
  const getVisibleTasks = () => {
    const visibleTasks = [];
    
    tasks.forEach(task => {
      if (task.parent === 0) {
        visibleTasks.push(task);
        if (expandedGroups.has(task.id) && task.type === 'summary') {
          const children = tasks.filter(t => t.parent === task.id);
          visibleTasks.push(...children);
        }
      }
    });
    
    return visibleTasks;
  };

  const toggleGroup = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleAddTask = () => {
    if (!newTask.text.trim()) return;

    const taskToAdd = {
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      ...newTask,
      start: null,
      end: null,
      open: true,
      percent_progress: 0
    };

    const updatedTasks = [...tasks, taskToAdd];
    setTasks(updatedTasks);
    updateTemplateTasks(updatedTasks);
    
    // Reset form
    setNewTask({
      text: '',
      type: 'task',
      duration: 1,
      parent: 0,
      section_title: '',
      wt: 0,
      item_code: ''
    });
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    const tasksToDelete = tasks.filter(task => task.id === taskId || task.parent === taskId);
    const newTasks = tasks.filter(task => !tasksToDelete.includes(task));
    setTasks(newTasks);
    updateTemplateTasks(newTasks);
    setSelectedTask(null);
  };

  const startEditingTask = (task) => {
    setEditingTask({ ...task });
    setIsEditTaskModalOpen(true);
  };

  const saveEditedTask = () => {
    if (!editingTask.text.trim()) return;

    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    );
    setTasks(updatedTasks);
    updateTemplateTasks(updatedTasks);
    setIsEditTaskModalOpen(false);
    setEditingTask(null);
  };

  const updateTemplateTasks = (updatedTasks) => {
    setTemplates(prev => ({
      ...prev,
      [currentTemplate]: {
        ...prev[currentTemplate],
        tasks: updatedTasks
      }
    }));
  };

  const saveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    setTemplates(prev => ({
      ...prev,
      [currentTemplate]: {
        name: templateName,
        description: templateDescription,
        tasks: tasks
      }
    }));
    
    setIsEditing(false);
  };

  const createNewTemplate = () => {
    const newKey = `template_${Date.now()}`;
    const newTemplate = {
      name: 'New Template',
      description: 'Template description',
      tasks: []
    };
    
    setTemplates(prev => ({
      ...prev,
      [newKey]: newTemplate
    }));
    
    setCurrentTemplate(newKey);
    setTemplateName('New Template');
    setTemplateDescription('Template description');
    setTasks([]);
    setIsEditing(true);
  };

  const duplicateTemplate = () => {
    const newKey = `template_${Date.now()}`;
    const currentTemplateData = templates[currentTemplate];
    
    setTemplates(prev => ({
      ...prev,
      [newKey]: {
        ...currentTemplateData,
        name: `${currentTemplateData.name} (Copy)`
      }
    }));
    
    setCurrentTemplate(newKey);
    setTemplateName(`${currentTemplateData.name} (Copy)`);
    setIsEditing(true);
  };

  const deleteTemplate = () => {
    if (Object.keys(templates).length <= 1) {
      alert('Cannot delete the only template');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${templateName}"?`)) {
      const templateKeys = Object.keys(templates);
      const currentIndex = templateKeys.indexOf(currentTemplate);
      const nextTemplate = templateKeys[currentIndex === 0 ? 1 : currentIndex - 1];
      
      const newTemplates = { ...templates };
      delete newTemplates[currentTemplate];
      
      setTemplates(newTemplates);
      setCurrentTemplate(nextTemplate);
    }
  };

  const visibleTasks = getVisibleTasks();

  return (
    <Box className="Content SchedulePage" sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box className="dashboard-header" sx={{ mb: 4 }}>
        <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px', margin: 0 }}>
          Schedule Template Manager
        </h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem', margin: 0 }}>
          Create and manage equipment installation templates
        </p>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3, alignItems: 'start' }}>
        
        {/* Main Content */}
        <Box>
          {/* Template Management Card */}
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <CardHeader 
              title="Template Management"
              sx={{ 
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Select Template</InputLabel>
                  <Select
                    value={currentTemplate}
                    label="Select Template"
                    onChange={(e) => setCurrentTemplate(e.target.value)}
                    disabled={isEditing}
                  >
                    {Object.entries(templates).map(([key, template]) => (
                      <MenuItem key={key} value={key}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={createNewTemplate}
                    sx={{ backgroundColor: '#315a95' }}
                  >
                    New
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DuplicateIcon />}
                    onClick={duplicateTemplate}
                  >
                    Duplicate
                  </Button>
                  <Button
                    variant={isEditing ? "outlined" : "contained"}
                    startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                    onClick={() => setIsEditing(!isEditing)}
                    color={isEditing ? "secondary" : "primary"}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={deleteTemplate}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>

              {isEditing && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <TextField
                    label="Template Name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    label="Description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    margin="normal"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={saveTemplate}
                    sx={{ mt: 2, backgroundColor: '#28a745' }}
                  >
                    Save Template
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Task List Card */}
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Template Tasks</span>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`${tasks.length} tasks`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`${tasks.filter(t => t.type === 'summary').length} summaries`} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                    />
                  </Box>
                </Box>
              }
              sx={{ 
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsTaskModalOpen(true)}
                  disabled={!isEditing}
                  size="small"
                >
                  Add Task
                </Button>
              }
            />
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                {visibleTasks.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center', color: '#6c757d' }}>
                    <TaskIcon sx={{ fontSize: 48, mb: 1, color: '#dee2e6' }} />
                    <div>No tasks in this template</div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {isEditing ? 'Add tasks to get started' : 'Enable edit mode to add tasks'}
                    </div>
                  </Box>
                ) : (
                  <Box>
                    {visibleTasks.map((task) => {
                      const isSummary = task.type === 'summary';
                      const isChild = task.parent !== 0;
                      const isExpanded = expandedGroups.has(task.id);
                      const isSelected = selectedTask?.id === task.id;

                      return (
                        <Box
                          key={task.id}
                          className={`task-item ${isSelected ? 'selected' : ''}`}
                          sx={{
                            p: 2,
                            borderBottom: '1px solid #e9ecef',
                            backgroundColor: isSelected ? '#e7f3ff' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: isSelected ? '#e7f3ff' : '#f8f9fa',
                            },
                            pl: isChild ? 4 : 2,
                          }}
                          onClick={() => setSelectedTask(task)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isSummary && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleGroup(task.id);
                                }}
                              >
                                {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                              </IconButton>
                            )}
                            
                            {!isSummary && isChild && (
                              <DragIcon sx={{ color: '#6c757d', fontSize: 16 }} />
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                              {isSummary ? (
                                <FolderIcon sx={{ color: '#17a2b8', fontSize: 20 }} />
                              ) : (
                                <TaskIcon sx={{ color: '#28a745', fontSize: 20 }} />
                              )}
                              
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span style={{ fontWeight: 500 }}>{task.text}</span>
                                  {task.section_title && (
                                    <Chip 
                                      label={task.section_title} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                                {task.item_code && (
                                  <Box sx={{ fontSize: '0.75rem', color: '#6c757d', mt: 0.5 }}>
                                    Item: {task.item_code} • WT: {task.wt || 0}%
                                  </Box>
                                )}
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip 
                                label={`${task.duration}d`} 
                                size="small" 
                                color="primary"
                                variant="outlined"
                              />
                              
                              {isEditing && (
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditingTask(task);
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(task.id);
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar */}
        <Box>
          {/* Template Info Card */}
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <CardHeader 
              title="Template Information"
              sx={{ 
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}
            />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <strong>Name:</strong> {templateName}
              </Box>
              <Box sx={{ mb: 2 }}>
                <strong>Description:</strong> {templateDescription}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ fontSize: '0.875rem', color: '#6c757d' }}>
                <div>Total Tasks: {tasks.length}</div>
                <div>Summary Tasks: {tasks.filter(t => t.type === 'summary').length}</div>
                <div>Regular Tasks: {tasks.filter(t => t.type === 'task').length}</div>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardHeader 
              title="Quick Actions"
              sx={{ 
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}
            />
            <CardContent>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsTaskModalOpen(true)}
                disabled={!isEditing}
                fullWidth
                sx={{ mb: 1, backgroundColor: '#315a95' }}
              >
                Add New Task
              </Button>
              
              {selectedTask && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Selected: {selectedTask.text}
                </Alert>
              )}
              
              {!isEditing && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Enable edit mode to modify tasks
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Add Task Modal */}
      <Modal open={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0
        }}>
          <CardHeader 
            title="Add New Task"
            sx={{ 
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e9ecef'
            }}
          />
          <CardContent sx={{ p: 3 }}>
            <TextField
              label="Task Name"
              value={newTask.text}
              onChange={(e) => setNewTask({...newTask, text: e.target.value})}
              fullWidth
              margin="normal"
              size="small"
            />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newTask.type}
                  label="Type"
                  onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                >
                  <MenuItem value="task">Task</MenuItem>
                  <MenuItem value="summary">Summary</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Duration (days)"
                type="number"
                value={newTask.duration}
                onChange={(e) => setNewTask({...newTask, duration: parseInt(e.target.value) || 1})}
                size="small"
                inputProps={{ min: 1 }}
              />
            </Box>

            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Parent Task</InputLabel>
              <Select
                value={newTask.parent}
                label="Parent Task"
                onChange={(e) => setNewTask({...newTask, parent: parseInt(e.target.value)})}
              >
                <MenuItem value={0}>Top Level</MenuItem>
                {tasks.filter(t => t.type === 'summary').map(task => (
                  <MenuItem key={task.id} value={task.id}>
                    {task.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mt: 2 }}>
              <TextField
                label="Section Title"
                value={newTask.section_title}
                onChange={(e) => setNewTask({...newTask, section_title: e.target.value})}
                size="small"
              />
              <TextField
                label="WT %"
                type="number"
                value={newTask.wt}
                onChange={(e) => setNewTask({...newTask, wt: parseFloat(e.target.value) || 0})}
                size="small"
                inputProps={{ step: 0.01 }}
              />
              <TextField
                label="Item Code"
                value={newTask.item_code}
                onChange={(e) => setNewTask({...newTask, item_code: e.target.value})}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={() => setIsTaskModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleAddTask}
                disabled={!newTask.text.trim()}
                sx={{ backgroundColor: '#315a95' }}
              >
                Add Task
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Modal>

      {/* Edit Task Modal */}
      <Modal open={isEditTaskModalOpen} onClose={() => setIsEditTaskModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0
        }}>
          <CardHeader 
            title="Edit Task"
            sx={{ 
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e9ecef'
            }}
          />
          <CardContent sx={{ p: 3 }}>
            {editingTask && (
              <>
                <TextField
                  label="Task Name"
                  value={editingTask.text}
                  onChange={(e) => setEditingTask({...editingTask, text: e.target.value})}
                  fullWidth
                  margin="normal"
                  size="small"
                />
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={editingTask.type}
                      label="Type"
                      onChange={(e) => setEditingTask({...editingTask, type: e.target.value})}
                    >
                      <MenuItem value="task">Task</MenuItem>
                      <MenuItem value="summary">Summary</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Duration (days)"
                    type="number"
                    value={editingTask.duration}
                    onChange={(e) => setEditingTask({...editingTask, duration: parseInt(e.target.value) || 1})}
                    size="small"
                    inputProps={{ min: 1 }}
                  />
                </Box>

                <FormControl fullWidth size="small" margin="normal">
                  <InputLabel>Parent Task</InputLabel>
                  <Select
                    value={editingTask.parent}
                    label="Parent Task"
                    onChange={(e) => setEditingTask({...editingTask, parent: parseInt(e.target.value)})}
                  >
                    <MenuItem value={0}>Top Level</MenuItem>
                    {tasks
                      .filter(t => t.type === 'summary' && t.id !== editingTask.id)
                      .map(task => (
                        <MenuItem key={task.id} value={task.id}>
                          {task.text}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mt: 2 }}>
                  <TextField
                    label="Section Title"
                    value={editingTask.section_title || ''}
                    onChange={(e) => setEditingTask({...editingTask, section_title: e.target.value})}
                    size="small"
                  />
                  <TextField
                    label="WT %"
                    type="number"
                    value={editingTask.wt || 0}
                    onChange={(e) => setEditingTask({...editingTask, wt: parseFloat(e.target.value) || 0})}
                    size="small"
                    inputProps={{ step: 0.01 }}
                  />
                  <TextField
                    label="Item Code"
                    value={editingTask.item_code || ''}
                    onChange={(e) => setEditingTask({...editingTask, item_code: e.target.value})}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 3 }}>
                  <Button onClick={() => setIsEditTaskModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={saveEditedTask}
                    disabled={!editingTask.text.trim()}
                    sx={{ backgroundColor: '#315a95' }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Box>
      </Modal>
    </Box>
  );
};

export default ScheduleTemplateManager;