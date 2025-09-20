import { Gantt, WillowDark, Willow } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import "../../gantt-custom.css"
import MyGanttComponent from "../../outComponent/GANTT_CHART/GanttChart.jsx";
import { Axios } from '../../api/axios.js'
import { useState } from 'react'

const ScheduleProjects = ({projId, allTaskDates}) => {
  console.log(allTaskDates)
  const [payload, setPayload] = useState({})
  const [ manufacutringEndMissing, setManufacturingEndMissing ] = useState(false)
  const handleClick = async () => {
    console.log(payload)
    window.location.reload()
    await Axios.post(`/projects/schedule/${projId}`, payload)
  }

  return (
  <div className='Content ScheduleProject'>
    <button className='ScheduleButton' onClick={handleClick} disabled={manufacutringEndMissing}
    >Make Schedule</button>
    <div>
      <MyGanttComponent id={projId} setPayload={setPayload} setManu={setManufacturingEndMissing} />
    </div>
  </div>
  )

};

export default ScheduleProjects;