import { createStore, action, thunk, computed } from "easy-peasy"
import {Axios} from '../api/axios.js'
//YYYY-MM-DD for testing
// const d = new Date('2025-10-10')
//always current date
const getLocalMidnight = () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
}


// const addDuration = (start, days) => {
//     const date = new Date(start)
//     date.setDate(date.getDate() + days)
//     date.setHours(0, 0, 0, 0)
//     return date
// }

// Always current date but standardized to midnight
const now = getLocalMidnight(new Date())
//const modifiedDate = addDuration(now, 0)
const localNow = getLocalMidnight(
    new Date(now.getTime() - now.getTimezoneOffset() * 60000)
)

console.log(new Date())
console.log(localNow)
export default createStore({
    date: localNow,
    setDate: action((state, payload) => {
        state.date = payload
    }),
    projectManagerId: [],
    pmsCoordinatorId: [],
    tncCoordinatorId: [],
    qaqcCoordinatorId: [],
    user: { username: null, roles: null, fullName: null },
    setUser: action((state, payload) => {
        state.user.username = payload.username
        state.user.roles = payload.roles
        state.user.fullName = sessionStorage.getItem('fullName')
        state.user.employee_id = payload.employee_id
    }),
    isLoggedIn: false,
    setIsLoggedIn: action((state, payload) => {
        state.isLoggedIn = payload
    }),
    employees: [],
    setEmployees: action((state, payload) => {
        state.employees = Array.isArray(payload) ? payload : []
        state.searchResults = Array.isArray(payload) ? payload : []

        state.projectManagerId = Array.isArray(payload)
        ? payload.find(p => p.job === 'Project Manager')?.employee_id
        : null;

        state.pmsCoordinatorId = Array.isArray(payload)
        ? payload.find(p => p.job === 'PMS Coordinator')?.employee_id
        : null;
        
        state.qaqcCoordinatorIdId = Array.isArray(payload)
        ? payload.find(p => p.job === 'QAQC Coordinator')?.employee_id
        : null;

        state.tncCoordinatorId = Array.isArray(payload)
        ? payload.find(p => p.job === 'TNC Coordinator')?.employee_id
        : null;
    }),
    forecastData: [],
    setForecastData: action((state, payload) => {
        state.forecastData = payload
    }),
    teamsNoProject: [],
    setTeamNoProject: action((state, payload) => {
        state.teamsNoProject = payload
    }),
    peProjects: [],
    setPeProjects: action((state, payload) => {
        state.peProjects = payload
    }),
    pmsProjects: [],
    setPMSProjects: action((state, payload) => {
        state.pmsProjects = payload
    }),
    handoverDates: [],
    setHandoverDates: action((state, payload) => {
        state.handoverDates = payload
    }),
    installationTeams: [],
    setInstallationTeams: action((state, payload) => {
        state.installationTeams = payload
    }),
    tentativeProjectTeams: [],
    setTentativeProjectTeams: action((state, payload) => {
        state.tentativeProjectTeams = payload
    }),
    notifications: [],
    setNotifications: action((state, payload) => {
        state.notifications = payload
    }),
    addNotificationToState: action((state, payload) => {
        state.notifications.push(payload)
    }),
    isLoading: false,
    setIsLoading: action((state, payload) => {
        state.isLoading = payload
    }),
    searchResults: [],
    setSearchResults: action((state, payload) => {
        state.searchResults = payload
    }),
    searchEmployee: '',
    setSearchEmployee: action((state, payload) => {
        state.searchEmployee = payload
    }),
    // FIXED: Add array validation to computed property
    sortResults: computed((state) => {
        if (!Array.isArray(state.employees)) return [];

        return state.employees.filter(employee =>
            (employee.first_name?.toLowerCase() || '').includes(state.searchEmployee.toLowerCase()) ||
            (employee.last_name?.toLowerCase() || '').includes(state.searchEmployee.toLowerCase())
        );
    }),
    searchSetEmployee: thunk((actions, payload, helpers) => {
        const { getState } = helpers;
        const state = getState()
        const id = Number(payload)
        // Add array check
        if (!Array.isArray(state.employees)) return null
        const emp = state.employees.find(e => e.employee_id === id);
        return emp
    }),
    projects: [],
    setProjects: action((state, payload) => {
        state.projects = Array.isArray(payload) ? payload : []
    }),
    searchSetProject: thunk((_, payload, helpers) => {
        const { getState } = helpers;
        const state = getState()
        const pId = Number(payload)
        
        // Add array check
        if (!Array.isArray(state.projects)) return null
        const proj = state.projects.find(p => p.id === pId);
        console.log(proj)
        return proj
    }),
    addNotification: thunk(async () => {
        await Axios.post('/api/notifications', {notification: 'created'}) // Fixed endpoint
        await Axios.post('/api/notifications/distribute', {jobs: 'manager'}) // Fixed endpoint
    }),
    inbox: [],
    setInbox: action((state, payload) => {
        state.inbox = payload
    }),
    sentMessages: [],
    setSentMessages: action((state, payload) => {
        state.sentMessages = payload
    }),
    addNewMessage: action((state, payload) => {
        // Use unshift to add new message at the beginning
        state.inbox.unshift(payload)
    }),
    markMessageAsRead: action((state, payload) => {
        const message = state.inbox.find(msg => msg.message_id === payload.message_id)
        if (message) {
            message.is_read = 1
            message.read_at = payload.read_at || new Date().toISOString()
        }
    }),
    addToSentMessages: action((state, payload) => {
        state.sentMessages.unshift(payload)
    }),
    serviceReports: [],
    setServiceReports: action((state, payload) => {
        state.serviceReports = payload
    }),
      projectData: {},
  projectPhotos: [],
  projectTeamTechs: [],
  projectSchedule: [],
  taskPhotos: [],
  teamInfo: {},
  isLoading: false,
  error: null,

  // Actions
// CORRECTED ACTIONS - Use action() wrapper for all of them
setProjectData: action((state, payload) => {
  state.projectData = payload;
}),
setProjectPhotos: action((state, payload) => {
  state.projectPhotos = payload;
}),
setProjectTeamTechs: action((state, payload) => {
  state.projectTeamTechs = payload;
}),
setProjectSchedule: action((state, payload) => {
  state.projectSchedule = payload;
}),
setTaskPhotos: action((state, payload) => {
  state.taskPhotos = payload;
}),
setTeamInfo: action((state, payload) => {
  state.teamInfo = payload;
}),
setLoading: action((state, payload) => {
  state.isLoading = payload;
}),
setError: action((state, payload) => {
  state.error = payload;
}),
  
  // Thunk action to fetch all project data
  fetchAllProjectData: thunk(async (actions, projId, { getState }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    console.log(projId)
    console.log('here in store')
    console.log(backendURL)
    try {
      actions.setLoading(true);
      actions.setError(null);

      // Fetch all data in parallel
      const [
        projectRes,
        photosRes,
        teamTechsRes,
        scheduleRes,
        taskPhotosRes
      ] = await Promise.all([
        Axios.get(`${backendURL}/api/projects/${projId}`),
        Axios.get(`${backendURL}/api/projects/photos/${projId}`),
        Axios.get(`${backendURL}/api/teams/project-manpower/${projId}`),
        Axios.get(`${backendURL}/api/projects/schedule/${projId}`),
        Axios.get(`${backendURL}/api/projects/task-photos/${projId}`)
      ]);
      console.log(projectRes)
      // Update state with all data
      actions.setProjectData(projectRes.data);
      actions.setProjectPhotos(photosRes.data);
      actions.setProjectTeamTechs(teamTechsRes.data);
      actions.setProjectSchedule(scheduleRes.data);
      actions.setTaskPhotos(taskPhotosRes.data);

    } catch (error) {
      console.error('Error fetching project data:', error);
      actions.setError('Failed to load project data');
    } finally {
      actions.setLoading(false);
    }
  }),

  // Thunk action to fetch team info (depends on project data)
  fetchTeamInfo: thunk(async (actions, { projId, projData }, { getState }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    
    if (!projData || !projData.id) return;

    try {
      const teamInfoRes = await Axios.get(`${backendURL}/api/teams/${projData.id}`);
      actions.setTeamInfo(teamInfoRes.data);
    } catch (error) {
      console.error('Error fetching team info:', error);
    }
  }),

  // Clear all project data when leaving the page
  clearProjectData: action((state) => {
    state.projectData = {};
    state.projectPhotos = [];
    state.projectTeamTechs = [];
    state.projectSchedule = [];
    state.taskPhotos = [];
    state.teamInfo = {};
    state.isLoading = false;
    state.error = null;
  }),
  // In your store file, add these new state properties and actions:

// Add to your state
currentTask: null,
currentParentTask: null,
currentTaskPhase: null,
projectedTask: null,
projectExists: 'loading',
projectCompleted: false,
isBehindSchedule: false,
onHold: false,
noTask: false,
tasksIsLoading: false,
fetchedData: null,

// Add these actions
setCurrentTask: action((state, payload) => {
  state.currentTask = payload;
}),
setCurrentParentTask: action((state, payload) => {
  state.currentParentTask = payload;
}),
setCurrentTaskPhase: action((state, payload) => {
  state.currentTaskPhase = payload;
}),
setProjectedTask: action((state, payload) => {
  state.projectedTask = payload;
}),
setProjectExists: action((state, payload) => {
  state.projectExists = payload;
}),
setProjectCompleted: action((state, payload) => {
  state.projectCompleted = payload;
}),
setIsBehindSchedule: action((state, payload) => {
  state.isBehindSchedule = payload;
}),
setOnHold: action((state, payload) => {
  state.onHold = payload;
}),
setNoTask: action((state, payload) => {
  state.noTask = payload;
}),
setTasksIsLoading: action((state, payload) => {
  state.tasksIsLoading = payload;
}),
setFetchedData: action((state, payload) => {
  state.fetchedData = payload;
}),

// Thunk to find project tasks (replaces the custom hook)
findProjectTasks: thunk(async (actions, { projectId, projectData }, { getState }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const state = getState();
  
  try {
    actions.setTasksIsLoading(true);
    
    // Fetch schedule data
    const scheduleRes = await Axios.get(`${backendURL}/api/projects/schedule/${projectId}`);
    const fetchedData = scheduleRes.data;
    actions.setFetchedData(fetchedData)
    
    if (!fetchedData || Object.keys(fetchedData).length === 0) {
      console.log('Project has no schedule yet');
      actions.setProjectExists(false);
      actions.setNoTask(true);
      actions.setTasksIsLoading(false);
      return;
    }
    
    console.log('date now: ', state.date);
    console.log(fetchedData);
    actions.setProjectExists(true);
    
    // Find parent task
    const foundParentTask = fetchedData.find(t => 
      t.task_type === 'summary' && 
      new Date(state.date) >= new Date(t.task_start) && 
      new Date(state.date) <= new Date(t.task_end)
    );
    
    console.log(foundParentTask);
    
    if (!foundParentTask) {
      actions.setProjectCompleted(true);
      actions.setTasksIsLoading(false);
      return;
    }
    
    if (projectData?.on_hold === 1) {
      actions.setCurrentTask(projectData.current_task);
      actions.setCurrentParentTask(projectData.task_phase);
      actions.setOnHold(true);
      actions.setTasksIsLoading(false);
      return;
    }
    
    if (foundParentTask.task_name === 'Structural/Civil Works') {
      actions.setCurrentParentTask({
        ...foundParentTask, 
        task_name: 'Structural/Civil Works and Manufacturing'
      });
    } else {
      actions.setCurrentParentTask(foundParentTask);
    }
    
    // Find current task based on current date
    const foundCurrentTask = fetchedData.find(t => 
      (t.task_actual_current || t.task_done === 0) && 
      t.task_type === 'task'
    );
    
    // Find projected current task
    const foundProjectedCurrentTask = fetchedData.find(t => 
      t.task_type === 'task' && 
      new Date(state.date) >= new Date(t.task_start) && 
      new Date(state.date) < new Date(t.task_end)
    );
    
    console.log(foundProjectedCurrentTask);
    
    // Set behind schedule flag
    if (foundCurrentTask && foundProjectedCurrentTask) {
      actions.setIsBehindSchedule(foundCurrentTask.task_id !== foundProjectedCurrentTask.task_id);
    }
    
    // Find current task phase
    if (foundCurrentTask) {
      const foundCurrentTaskPhase = fetchedData.find(t => 
        t.task_id === foundCurrentTask.task_parent
      );
      actions.setCurrentTaskPhase(foundCurrentTaskPhase);
    }
    
    console.log(foundCurrentTask);
    console.log(foundProjectedCurrentTask);
    
    actions.setCurrentTask(foundCurrentTask);
    actions.setProjectedTask(foundProjectedCurrentTask);
    actions.setTasksIsLoading(false);
    
  } catch (error) {
    console.error('Error finding project tasks:', error);
    actions.setProjectExists(false);
    actions.setTasksIsLoading(false);
  }
}),

// Optional: Clear task data when needed
clearProjectTasks: action((state) => {
  state.currentTask = null;
  state.currentParentTask = null;
  state.currentTaskPhase = null;
  state.projectedTask = null;
  state.projectExists = 'loading';
  state.projectCompleted = false;
  state.isBehindSchedule = false;
  state.onHold = false;
  state.noTask = false;
  state.tasksIsLoading = false;
}),
})