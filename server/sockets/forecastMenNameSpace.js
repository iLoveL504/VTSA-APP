import { ForecastModel as forecast } from "../model/ForecastModel.js";

export default function forecastMenNameSpace(nsp) {
  nsp.on("connection", (socket) => {
    console.log("✅ Forecast namespace connected:", socket.id);

    const emitAllUpdates = async (date) => {
      const updatedTeams = await forecast.tentativeProjectTeams();
      const updatedForecast = await forecast.forecastTeam(date || new Date());
      const updatedNoProject = await forecast.teamsNoProject();

      nsp.emit("tentative_projects_done", updatedTeams);
      nsp.emit("forecast_done", updatedForecast);
      nsp.emit("no_project_done", updatedNoProject);
    };

    socket.on("forecast_team", async (date) => {
      const results = await forecast.forecastTeam(date);
      nsp.emit("forecast_done", results);
    });

    socket.on("no_project_team", async () => {
      const results = await forecast.teamsNoProject();
      nsp.emit("no_project_done", results);
    });

    socket.on("tentative_project_team", async () => {
      const results = await forecast.tentativeProjectTeams();
      nsp.emit("tentative_projects_done", results);
    });

    socket.on("insert_forecast_member", async (data) => {
      await forecast.insertForecastMembers(data);
      await emitAllUpdates(data.date);
    });

    // 🔥 New: Assign or update foreman for a project
    socket.on("assign_foreman", async (data) => {
      await forecast.assignOrUpdateForeman(data);
      await emitAllUpdates(data.date);
    });

    // 🔥 New: Remove a forecast member
    socket.on("remove_forecast_member", async (data) => {
      await forecast.removeForecastMember(data);
      await emitAllUpdates(data.date);
    });

    socket.on("save", async (data, callback) => {

      try {
        await forecast.finalizeTeam(data);
        await emitAllUpdates(data.date);
        callback({success: true})
      } catch (error) {
        console.log(error)
        callback({success: false, error: error.message})
      }
      nsp.emit("save_done")
    });

    socket.on('installation_teams', async () => {
      try {
        const results = await forecast.projectFinalizedTeams()
        nsp.emit('fetched_finalized_teams', results)
      } catch {

      }
    })
  });
}
