import { createStore, action, thunk, computed } from "easy-peasy"
import {Axios} from '../api/axios.js'
import InstallationTeams from "../Pages/Teams/InstallationTeams.jsx"
//YYYY-MM-DD for testing
// const d = new Date('2025-10-10')
//always current date
const d = new Date()
const addDuration = (start, days) => {
    const date = new Date(start)
    date.setDate(date.getDate() + days)
    return date
}

const modifiedDate = addDuration(d, 0)

export default createStore({
    date: modifiedDate,
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
        if (!Array.isArray(state.employees)) {
            return []
        }
        const sortedSearch = state.employees.filter(employee => 
            (employee.first_name?.toLowerCase() || '').includes(state.searchEmployee.toLowerCase()) || 
            (employee.last_name?.toLowerCase() || '').includes(state.searchEmployee.toLowerCase())
        )
        return sortedSearch
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
    })
})