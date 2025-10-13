import { ForecastModel as forecast } from "../model/ForecastModel.js"

export default function forecastMenNameSpace(nsp) {
    nsp.on("connection", (socket) => {
        console.log('connection made')
        socket.on("forecast_team", async (date) => {
            console.log('hiii')
            const results = await forecast.forecastTeam(date)
            socket.emit("forecast_done", results)

        })
        socket.on("no_project_team", async () => {
            console.log('hiiddi')
            const results = await forecast.teamsNoProject()
            socket.emit("no_project_done", results)
        })
        socket.on("tentative_project_team", async () => {
            console.log('hiiddi')
            const results = await forecast.tentativeProjectTeams()
            socket.emit("tentative_projects_done", results)
        })
    })
}