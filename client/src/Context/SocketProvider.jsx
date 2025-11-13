import { SocketContext } from './SocketContext'
import { useSocket } from '../hooks/useSocket.js'
import { useStoreActions, useStoreState } from 'easy-peasy'

export const SocketProvider = ({ children }) => {
  const setForecastData = useStoreActions(action => action.setForecastData)
  const setTeamNoProject = useStoreActions(action => action.setTeamNoProject)
  const setTentativeProjectTeams = useStoreActions(action => action.setTentativeProjectTeams)
  const setProjects = useStoreActions(action => action.setProjects)
  const setPeProjects = useStoreActions(action => action.setPeProjects)
  const setNotifications = useStoreActions(action => action.setNotifications)
  const setInstallationTeams = useStoreActions(action => action.setInstallationTeams)
  const setEmployees = useStoreActions(action => action.setEmployees)

  const setInbox = useStoreActions(action => action.setInbox)
  const setSentMessages = useStoreActions(action => action.setSentMessages)

  //user state
  const user = useStoreState(state => state.user)
  const currentProj = useStoreState(state => state.currentProj)
  const currentProjId = useStoreState(state => state.currentProjId)
  //store actions to update projects
  const fetchAllProjectData = useStoreActions(action => action.fetchAllProjectData)
  const findProjectTasks = useStoreActions(action => action.findProjectTasks)
const silentRefreshProjects = useStoreActions(action => action.silentRefreshProjects)
const silentRefreshDesignatedProjects = useStoreActions(action => action.silentRefreshDesignatedProjects)

  const forecastSocket = useSocket("/forecast", {
    forecast_done: (data) => setForecastData(data.map(d => ({ ...d, group: 'forecasted' }))),
    no_project_done: (data) => setTeamNoProject(data.map(d => ({ ...d, group: 'no-project' }))),
    tentative_projects_done: (data) => {
        console.log(data)
        setTentativeProjectTeams(data)
    },
    insert_member_done: () => {
        console.log('done inserting')
        //some emit callback here forecastSocket.emit('whatever')
    },
    save_done: () => {
        console.log('done saving')
        //some emit callback here forecastSocket.emit('whatever')
    },
    fetched_finalized_teams: (data) => {
      console.log(data)
      setInstallationTeams(data)
    }
  })

  const utilitiesSocket = useSocket("/utilities", {
    update_done: (projects) => {setProjects(projects); console.log(projects)},
    pe_projects_fetch_done: (data) => setPeProjects(data),
    notification_update_done: (data) => {
      console.log('New notifications:', data);
      setNotifications(data)
    },
    update_task: () => {
      console.log('updating task')
      console.log('projid: ', currentProjId)

      console.log(`user role ---- ${user.roles}`)
      console.log('I will refresh project data')
      fetchAllProjectData(currentProjId)
      findProjectTasks({ projectId: currentProjId, projectData: currentProj })
    },
      refresh_projects: () => {
        // Use silent refreshes instead
        silentRefreshProjects()
        console.log('🔄 Silent refreshing designated projects')
        silentRefreshDesignatedProjects(user.employee_id)
      }

  })

  const usersSocket = useSocket("/users", {
    update_done: (users) => {setEmployees(users); console.log(users)}
  })

  // 💬 Messages socket
    const messagesSocket = useSocket("/messages", {
      fetch_inbox_done: (data) => {
        console.log("📥 Inbox fetched:", data)
        setInbox(data)
      },
      fetch_sent_done: (data) => {
        console.log("📤 Sent fetched:", data)
        setSentMessages(data)
      },
      send_message_done: (data) => {
        console.log("✅ Message sent:", data)
      },
      new_message_done: (data) => {
        console.log('-----------message received--------------')
        console.log("📨 New message received:", data)
        setInbox(data)
      },
      mark_as_read_done: ({ message_id, data }) => {
        console.log("👁️ Marked as read:", message_id)
        console.log(data)
        setInbox(data)
      },
      delete_message_done: ({ message_id }) => {
        console.log("🗑️ Message deleted:", message_id)
      }
    })

  return (
    <SocketContext.Provider value={{forecastSocket, utilitiesSocket, usersSocket, messagesSocket}}>
      {children}
    </SocketContext.Provider>
  )
}
