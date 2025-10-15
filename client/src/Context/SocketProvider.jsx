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
    }
  })

  return (
    <SocketContext.Provider value={forecastSocket}>
      {children}
    </SocketContext.Provider>
  )
}
