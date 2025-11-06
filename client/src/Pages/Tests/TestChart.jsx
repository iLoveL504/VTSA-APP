import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Axios } from "../../api/axios.js";
import Queue from "../../../../DataStructs/Queue";
import "./CustomGanttChart.css"; // ✅ external styles
import '../../css/ConfirmSchedule.css'

const CustomGanttChart = () => {
  const location = useLocation();
  const { projId } = useParams();
  const navigate = useNavigate();

  const [view, setView] = useState(ViewMode.Month);
  const [isSaving, setIsSaving] = useState(false);
  const [processedTasks, setProcessedTasks] = useState([]);

  const { schedule, holiday, toggle: isCalendarDays } = location.state || [];
  console.log(schedule)
  const tasks = useMemo(() => {
    if (!schedule) return [];

    return schedule.map((s) => ({
      id: s.task_id.toString(),
      name: s.task_name,
      start: new Date(s.task_start),
      end: new Date(s.task_end),
      type:
        s.task_type === "summary" || s.task_type === "project" ? "project" : "task",
      progress: s.task_percent_progress || 0,
      isDisabled: true,
        styles: {
        backgroundColor: s.task_type === "summary" ? "#1a579e" : "#3b82f6",
        progressColor: "#4ade80",
        progressSelectedColor: "#22c55e",
        }
    }));
  }, [schedule]);

  useEffect(() => {
    if (tasks.length > 0) setProcessedTasks(tasks);
  }, [tasks]);

  const handleMakeSchedule = async () => {
    try {
      setIsSaving(true);
      const values = new Queue();

      location.state.schedule.map((s) => {
        const value = {
          task_id: s.task_id,
          task_name: s.task_name,
          task_start: s.task_start.toISOString().split("T")[0],
          task_end: s.task_end.toISOString().split("T")[0],
          task_duration: s.task_duration,
          task_type: s.task_type,
          task_parent: s.task_parent,
          task_percent: s.task_percent,
          section_title: s.section_title || null,
          item_code: s.item_code || null,
          wt: s.wt || null,
        };
        values.enqueue(value);
      });

      let holidays = []
      if (holiday.length !== 0) {
          const sqlReady = holiday.map(h => {
          const d = new Date(h);
          d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
          return d.toISOString().split('T')[0];
        });        
        holidays = sqlReady
      }

      
      const valuesArray = values.elements;
      const payload = { id: 801, tasks: valuesArray, holidays, isCalendarDays };

      console.log("Payload being sent:", payload);

      const response = await Axios.post(
        `/api/projects/schedule/${Number(projId)}`,
        payload
      );

      if (response.data?.success) {
        alert(response.data.message || "Schedule saved successfully!");
        navigate(`/projects/${projId}`);
      } else {
        alert("Unexpected server response. Please try again.");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Error saving schedule. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='Content ConfirmSchedule'>
      <div className='confirm-header'>
        Confirm Project Schedule
      </div>

        <div className='gantt-section'>
              <div className="gantt-wrapper">
              <div className="gantt-header">
                <h2 className="gantt-title">Project Schedule</h2>

                <div className="gantt-controls">
                  <select
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    className="gantt-select"
                  >
                    <option value={ViewMode.Day}>Day</option>
                    <option value={ViewMode.Week}>Week</option>
                    <option value={ViewMode.Month}>Month</option>
                  </select>

                  <button
                    onClick={handleMakeSchedule}
                    disabled={isSaving}
                    className={`gantt-button ${isSaving ? "disabled" : ""}`}
                  >
                    {isSaving ? "Saving..." : "Make Schedule"}
                  </button>
                </div>
              </div>

              {processedTasks.length > 0 ? (
                <div className="gantt-container">
                  <Gantt
                    style={{ height: '600px' }}
                    tasks={processedTasks}
                    viewMode={view}
                    listCellWidth="250px"
                    barCornerRadius={5}
                    columnWidth={65}
                    locale="en-GB"
                  />
                </div>
              ) : (
                <p className="no-schedule-text">No schedule data available.</p>
              )}
            </div>  
          </div>          
    </div>

  );
};

export default CustomGanttChart;
