import { Gantt} from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { useRef, useEffect, useState} from "react";
import { Willow } from "wx-react-gantt";
import ProjectTasks from "./ProjectScheduleData.js";
import { columns, links, scales, taskTypes } from "./ganttComponents.jsx";
import useAxiosFetch from '../../hooks/useAxiosFetch.js'

const MyGanttComponent = ({id, setPayload, setManu}) => {
  const {data: projInfo, isLoading:projIsLoading} = useAxiosFetch(`http://localhost:4000/projects/${id}`)
  const [tasks, setTasks] = useState([])
  const apiRef = useRef();
  const scaleHeightRef = useRef(50);
  function toMySQLDate(input) {
    const [day, month, year] = input.split("/");
    return `${year}-${month}-${day}`;
  }
  
  useEffect(() => {
    if (!projIsLoading){
      if (projInfo.manufacturing_end_date === null) {
        setManu(true)
        return
      }
      const d1 = new Date(projInfo.manufacturing_end_date)
      console.log(toMySQLDate(d1.toLocaleDateString("en-GB")))
      const project = new ProjectTasks(d1)
      setPayload({date: project.buildPayload()})
      setTasks(project.tasks)
    }
  }, [projInfo])
  // console.log(allDates)
  /* Makes the "summary" task type not draggable */
  useEffect(() => {
    if (apiRef.current) {
        apiRef.current.intercept("drag-task", ({ id, top }) => {
            return !(typeof top === "undefined" && apiRef.current.getTask(id).type === "summary");
      });
    }
  }, [apiRef.current]);

  /* allows the chart to be zoomed in and out */
  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.on("zoom-scale", () => {
        console.log("The current zoom level is", apiRef.current.getState().zoom);
      });
    }
  }, [apiRef.current]);

 const readonly = true; 

  return (
    <div className="gt-cell">
      <Willow>
        <Gantt 
          readonly={readonly}
          apiRef={apiRef} 
          links={links} 
          scales={scales}
          scaleHeight={scaleHeightRef.current} 
          columns={columns} 
          tasks={tasks} 
          taskTypes={taskTypes} 
          init={(api) => (apiRef.current = api)}
          zoom
          id={id}
        />
      </Willow>
    </div>  
  );
};
export default MyGanttComponent;