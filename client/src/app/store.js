import { createStore, action, thunk, computed } from "easy-peasy"
import {Axios} from '../api/axios.js'

const d = new Date()

const addDuration = (start, days) => {
    const date = new Date(start)
    date.setDate(date.getDate() + days)
    return date
}

const modifiedDate = addDuration(d, 0)

export default createStore({
    date: modifiedDate,
    user: { username: null, roles: null },
    setUser: action((state, payload) => {
        state.user.username = payload.username
        state.user.roles = payload.roles
    }),
    isLoggedIn: false,
    setIsLoggedIn: action((state, payload) => {
        state.isLoggedIn = payload
    }),
    employees: [],
    setEmployees: action((state, payload) => {
        state.employees = Array.isArray(payload) ? payload : []
        state.searchResults = Array.isArray(payload) ? payload : []
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