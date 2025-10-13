import { SocketContext } from './SocketContext'
import { useSocket } from '../hooks/useSocket.js'
import { useStoreActions } from 'easy-peasy'

export const SocketProvider = ({ children }) => {
  const setForecastData = useStoreActions(action => action.setForecastData)
  const setTeamNoProject = useStoreActions(action => action.setTeamNoProject)
  const setTentativeProjectTeams = useStoreActions(action => action.setTentativeProjectTeams)

  const forecastSocket = useSocket("/forecast", {
    forecast_done: (data) => setForecastData(data.map(d => ({ ...d, group: 'forecasted' }))),
    no_project_done: (data) => setTeamNoProject(data.map(d => ({ ...d, group: 'no-project' }))),
    tentative_projects_done: (data) => setTentativeProjectTeams(data),
  })

  return (
    <SocketContext.Provider value={forecastSocket}>
      {children}
    </SocketContext.Provider>
  )
}
