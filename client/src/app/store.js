import { createStore, action, thunk, computed } from "easy-peasy"
import {Axios} from '../api/axios.js'
import dayjs from 'dayjs'
// Add this near the top of your store file, after the imports
const summaryMap = {
  'Mechanical Installation': 'Installation',
  'Preliminaries': 'Preliminaries',
  'Structural/Civil Works': 'Structural/Manufacturing',
  'Manufacturing and Importation': 'Structural/Manufacturing',
  'Planning For Mobilization And Execution': 'Planning',
  'Testing and Commissioning': 'Test and Comm'
};


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
    designatedProjects: [],
    setDesignatedProjects: action((state, payload) => {
      state.designatedProjects = payload
    }),
    designatedIsLoading: false,
    setDesignatedIsLoading: action((state, payload) => {
      state.designatedIsLoading = payload
    }),
    fetchDesignatedProjects: thunk(async (actions, payload, { getState }) => {
      const state = getState()
      const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      try {
        actions.setDesignatedIsLoading(true)
        console.log(payload)
        console.log('---------------refreshing designated----------------------')
        const desProj = await Axios.get(`${backendURL}/api/employees/${payload}/designated-project`, {
  params: { role: state.user.roles }
})

        console.log(desProj)
        actions.setDesignatedProjects(desProj.data)
      } catch (err) {
        console.log(err)
      } finally {
        actions.setDesignatedIsLoading(false)
        console.log('---------------refreshing designated----------------------')
      }
   
     
    }),
    projectManagerId: [],
    pmsCoordinatorId: [],
    tncCoordinatorId: [],
    qaqcCoordinatorId: [],
    user: { username: null, roles: null, fullName: null, employee_id: null },
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
    allTeams: [],
    setAllTeams: action ((state, payload) => {
        state.allTeams = payload
    }),
    fetchAllTeams: thunk(async (action) => {
      const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      try {
        const teams = await Axios.get(`${backendURL}/api/teams/dashboard`)
        console.log(teams)
        action.setAllTeams(teams.data)
      } catch (err) {
        console.log(err)
      }
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
    fetchProjects: thunk( async (actions) => {
      const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      try {
        const projs = await Axios.get(`${backendURL}/api/projects`)
        actions.setProjects(projs.data)
      } catch (err) {
        console.log(err)
      }

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
  currentProj: null,
  currentProjId: null,
  projectData: {},
  projectPhotos: [],
  projectTeamTechs: [],
  projectSchedule: [],
  taskPhotos: [],
  teamInfo: {},
  error: null,
  holidays: [],
  qaqcHistory: [],

  // Actions
// CORRECTED ACTIONS - Use action() wrapper for all of them
setCurrentProjId: action((state, payload) => {
  state.currentProjId = payload
}),
setCurrentProj: action((state, payload) => {
  state.currentProj = payload
}),
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
setHolidays: action((state, payload) => {
  state.holidays = payload
}),
setLoading: action((state, payload) => {
  state.isLoading = payload;
}),
setError: action((state, payload) => {
  state.error = payload;
}),
setQaQCHistory: action((state, payload) => {
  state.qaqcHistory = payload
}),
  
  // Thunk action to fetch all project data
  fetchAllProjectData: thunk(async (actions, projId) => {
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
        taskPhotosRes,
        holidays,
        qaqcHis
      ] = await Promise.all([
        Axios.get(`${backendURL}/api/projects/${projId}`),
        Axios.get(`${backendURL}/api/projects/photos/${projId}`),
        Axios.get(`${backendURL}/api/teams/project-manpower/${projId}`),
        Axios.get(`${backendURL}/api/projects/schedule/${projId}`),
        Axios.get(`${backendURL}/api/projects/task-photos/${projId}`),
        Axios.get(`${backendURL}/api/projects/holidays/${projId}`),
        Axios.get(`${backendURL}/api/projects/qaqc/history/${projId}`)
      ]);
      console.log(qaqcHis)
      // Update state with all data
      actions.setProjectData(projectRes.data);
      actions.setProjectPhotos(photosRes.data);
      actions.setProjectTeamTechs(teamTechsRes.data);
      actions.setProjectSchedule(scheduleRes.data);
      actions.setTaskPhotos(taskPhotosRes.data);
      actions.setHolidays(holidays.data)
      actions.setQaQCHistory(qaqcHis.data[projId].inspections)

    } catch (error) {
      console.error('Error fetching project data:', error);
      actions.setError('Failed to load project data');
    } finally {
      actions.setLoading(false);
    }
  }),

  // Thunk action to fetch team info (depends on project data)
  fetchTeamInfo: thunk(async (actions, { projData }) => {
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
    state.qaqcHistory = []
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
noCurrentTask: false,

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
setNoCurrentTask: action((state, payload) => {
  state.noCurrentTask = payload
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

      console.log('inside foundParentTask:')
      console.log(projectData)
      if (projectData.will_resume) {
        const bufferParent = fetchedData.find(t => t.task_id === 600)
        const bufferTask = fetchedData.find(t => t.task_id === 601)
        console.log(bufferParent)
        console.log(bufferTask)

        actions.setCurrentParentTask(bufferParent)
        actions.setCurrentTask(bufferTask)
        actions.setTasksIsLoading(false);
        actions.setOnHold(true)
        return
      }
      if (projectData.status === 'Completed') {
        actions.setProjectCompleted(true);
        actions.setTasksIsLoading(false);
        return;        
      }

    }
    
    if (projectData?.on_hold) {

      actions.setCurrentTask(projectData.current_task);
      actions.setCurrentParentTask(projectData.task_phase);
    //  

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
// Add these to your store model, right before the closing bracket

// Project status update functionality
projectStatuses: {},
isUpdatingStatuses: false,

// Actions for project status updates
setProjectStatuses: action((state, payload) => {
  state.projectStatuses = payload;
}),
setIsUpdatingStatuses: action((state, payload) => {
  state.isUpdatingStatuses = payload;
}),

// Thunk to update project statuses (replaces useUpdateProjects hook)
updateProjectStatuses: thunk(async (actions, payload, { getState }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const state = getState();
  
  if (!payload || !payload.length) return;

  let allStatuses = {};
  
  try {
    actions.setIsUpdatingStatuses(true);
    
    for (let i = 0; i < payload.length; i++) {
      const project = payload[i];
      
      // Only process projects with schedule created
      if (project.schedule_created !== 1) continue;
      
      const response = await Axios.get(`${backendURL}/api/projects/schedule/${project.id}`);
      if (!response || !response.data) continue;
      
      const tasks = response.data;
      
      // ---- HOLD DAYS ----
      let holdDays = null;
      const isOnHold = !!project.on_hold;
      if (project.hold_date) {
        const date = dayjs(project.hold_date);
        const now = dayjs(state.date);
        holdDays = now.diff(date, 'd');
      }
      
      // ---- CURRENT TASKS ----
      const foundParentTask = tasks.find(
        t => t.task_type === 'summary' &&
        new Date(state.date) >= new Date(t.task_start) &&
        new Date(state.date) < new Date(t.task_end)
      );
      
      const ct = tasks.find(
        t => t.task_type === 'task' &&
        new Date(state.date) >= new Date(t.task_start) &&
        new Date(state.date) < new Date(t.task_end)
      );
      
      const actualTask = tasks.find(
        t => t.task_type === 'task' && (!t.task_done || t.task_actual_current)
      );
      
      if (!actualTask || !ct || !foundParentTask) {
        console.warn(`⚠️ Missing task for project ${project.id}`, {
          actualTask, ct, foundParentTask
        });
        continue;
      }
      
      const actualTaskId = actualTask.task_id;
      const currentTask_id = ct.task_id;
      const phase = tasks.find(t => t.task_id === ct.task_parent);
      
      console.log(`------------------update project-----------------------`);
      console.log(`${project.id}`, `is in ${actualTask.task_name}`);
      console.log(`${project.id}`, `projected is in ${ct.task_name}`);
      
      // ---- FIND SPECIFIC TASK DATES ----
      const findDate = (name, key = 'task_start') => {
        const task = tasks.find(t => t.task_name === name);
        return task ? task[key]?.split('T')[0] : null;
      };
      
      const installation_start_date = findDate('Mechanical Installation', 'task_start');
      const end_date = findDate('Final Cleaning / Hand over', 'task_end');
      const start_date = findDate('Preliminaries', 'task_start');
      const tnc_start_date = findDate('Testing and Commissioning', 'task_start');
      const manufacturing_end_date = findDate('Manufacturing and Importation Process', 'task_end');
      
      // ---- QAQC, TNC, JOINT INSPECTION FLAGS ----
      const now = new Date(state.date);
      let in_tnc = 0;
      if (project.tnc_assign_date) {
        in_tnc = new Date(project.tnc_assign_date) <= now ? 1 : 0;
      }
      
      let in_qaqc = false;
      if (project.qaqc_inspection_date) {
        const inspectionDate = new Date(project.qaqc_inspection_date);
        inspectionDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        in_qaqc = inspectionDate <= now;
      }
      
      let joint_inspection = false;
      if (project.pms_joint_inspection) {
        joint_inspection = new Date(project.pms_joint_inspection) <= now;
      }
      
      console.log(`${project.id}`, foundParentTask.task_name);
      
      // ---- STATUS ----
      let phaseName = phase ? phase.task_name : 'Unknown Phase';
      if (project.progress === 90) phaseName = 'Testing and Commissioning';
      const foundCurrentTask = actualTask.task_name;
      const handover_done = project.handover_done;
      const is_behind = actualTaskId !== currentTask_id;
      
      console.log(`${project.id}`, `projected is behind ${is_behind}`);
      console.log(`----------------------project update --------------------------`);
      console.log(actualTaskId);
      console.log(foundCurrentTask);
      
      allStatuses[project.id] = {
        id: project.id,
        status: summaryMap[foundParentTask.task_name] || 'N/A',
        end_date,
        start_date,
        manufacturing_end_date,
        tnc_start_date,
        installation_start_date,
        foundCurrentTask,
        in_tnc,
        in_qaqc,
        phaseName,
        joint_inspection,
        actualTaskId,
        handover_done,
        is_behind,
        holdDays,
        isOnHold,
        currentTask_id
      };
    }
    
    // Batch update to backend
    if (Object.keys(allStatuses).length > 0) {
      const response = await Axios.put(`${backendURL}/api/projects/update-status`, allStatuses);
      console.log('✅ Project status updated', response.data);
      
      if (response.data.success === true) {
        actions.setProjectStatuses(allStatuses);
        
      }
    } else {
      console.warn('⚠️ No valid project payload to update.');
    }
    
  } catch (error) {
    console.error('❌ Error updating project statuses:', error);
  } finally {
    actions.setIsUpdatingStatuses(false);
  }
}),

// Helper action to trigger status updates for filtered projects
updateFilteredProjectStatuses: thunk(async (actions, payload, { getState }) => {
  const state = getState();
  
  // Get projects with schedule created
  const projectsWithSchedule = state.projects.filter(p => p.schedule_created === 1);
  
  if (projectsWithSchedule.length > 0) {
    await actions.updateProjectStatuses(projectsWithSchedule);
  }
}),
silentRefreshDesignatedProjects: thunk(async (actions, payload, { getState }) => {
  const state = getState()
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  try {
    console.log('🔄 Silent refresh of designated projects')
    const desProj = await Axios.get(`${backendURL}/api/employees/${payload}/designated-project`, {
      params: { role: state.user.roles }
    })
    actions.setDesignatedProjects(desProj.data)
  } catch (err) {
    console.log('❌ Silent refresh failed:', err)
  }
}),

// Add silent refresh for projects too
silentRefreshProjects: thunk(async (actions) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  try {
    console.log('🔄 Silent refresh of all projects')
    const projs = await Axios.get(`${backendURL}/api/projects`)
    actions.setProjects(projs.data)
  } catch (err) {
    console.log('❌ Silent refresh failed:', err)
  }
}),
})