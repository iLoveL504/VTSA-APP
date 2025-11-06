import { Axios } from '../api/axios'
import { useStoreState } from 'easy-peasy'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const summaryMap = {
  'Mechanical Installation': 'Installation',
  'Preliminaries': 'Preliminaries',
  'Structural/Civil Works': 'Structural/Manufacturing',
  'Manufacturing and Importation': 'Structural/Manufacturing',
  'Planning For Mobilization And Execution': 'Planning',
  'Testing and Commissioning': 'Test and Comm'
}

const useUpdateProjects = (projectIDs) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const dateNow = useStoreState(state => state.date)
  const [updateIsLoading, setUpdateIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!projectIDs || projectIDs.length === 0) return

      let payload = {}
      try {
        for (let i = 0; i < projectIDs.length; i++) {
          const project = projectIDs[i]
          const response = await Axios.get(`/api/projects/schedule/${project.id}`)
          if (!response || !response.data) continue
            console.log('98888888888888888888888888888888')
            console.log(project.id)
            console.log('98888888888888888888888888888888')
          const tasks = response.data

          // ---- HOLD DAYS ----
          let holdDays = null
          const isOnHold = project.on_hold ? true : false
          if (project.hold_date) {
            const date = dayjs(project.hold_date)
            const now = dayjs(dateNow)
            holdDays = now.diff(date, 'd')
          }

          // ---- CURRENT TASKS ----
          const foundParentTask = tasks.find(
            t => t.task_type === 'summary' &&
            new Date(dateNow) >= new Date(t.task_start) &&
            new Date(dateNow) <= new Date(t.task_end)
          )

          const ct = tasks.find(
            t => t.task_type === 'task' &&
            new Date(dateNow) >= new Date(t.task_start) &&
            new Date(dateNow) <= new Date(t.task_end)
          )

          const actualTask = tasks.find(
            t => t.task_type === 'task' && (!t.task_done || t.task_actual_current)
          )

          if (!actualTask || !ct || !foundParentTask) {
            console.warn(`⚠️ Missing task for project ${project.id}`, {
              actualTask, ct, foundParentTask
            })
            continue
          }

          const actualTaskId = actualTask.task_id
          const currentTask_id = ct.task_id
          const phase = tasks.find(t => t.task_id === ct.task_parent)
          console.log(`${project.id}`, `is in ${ct.task_name}`)
          // ---- FIND SPECIFIC TASK DATES (safe lookups) ----
          const findDate = (name, key = 'task_start') => {
            const task = tasks.find(t => t.task_name === name)
            return task ? task[key]?.split('T')[0] : null
          }

          const installation_start_date = findDate('Mechanical Installation', 'task_start')
          const end_date = findDate('Final Cleaning / Hand over', 'task_end')
          const start_date = findDate('Preliminaries', 'task_start')
          const tnc_start_date = findDate('Testing and Commissioning', 'task_start')
          const manufacturing_end_date = findDate('Manufacturing and Importation Process', 'task_end')

          // ---- QAQC, TNC, JOINT INSPECTION FLAGS ----
          const now = new Date(dateNow)
          let in_tnc = 0
          if (project.tnc_assign_date) {
            in_tnc = new Date(project.tnc_assign_date) <= now ? 1 : 0
          }

          let in_qaqc = false
          if (project.qaqc_inspection_date) {
            const inspectionDate = new Date(project.qaqc_inspection_date)
            inspectionDate.setHours(0, 0, 0, 0)
            now.setHours(0, 0, 0, 0)
            in_qaqc = inspectionDate <= now
          }

          let joint_inspection = false
          if (project.pms_joint_inspection) {
            joint_inspection = new Date(project.pms_joint_inspection) <= now
          }
          console.log(`${project.id}`, foundParentTask.task_name)

          // ---- STATUS ----
          let phaseName = phase ? phase.task_name : 'Unknown Phase'
          if (project.progress === 90) phaseName === 'Testing and Commissioning'
          const foundCurrentTask = ct.task_name
          const handover_done = project.handover_done
          const is_behind = actualTaskId !== currentTask_id
          console.log(foundCurrentTask)
          payload[`project${project.id}`] = {
            id: project.id,
            status: summaryMap[foundParentTask.task_name] || 'N/A',
            end_date,
            start_date,
            manufacturing_end_date,
            tnc_start_date,
            installation_start_date,
            foundCurrentTask,
            in_tnc,
            in_qaqc,
            phaseName,
            joint_inspection,
            currentTask_id,
            handover_done,
            is_behind,
            holdDays,
            isOnHold
          }
        }

        if (Object.keys(payload).length > 0) {
          const response = await Axios.put(`/api/projects/update-status`, payload)
          console.log('✅ Project status updated', response.data)
          if (response.data.success === true) {
            setUpdateIsLoading(false)
          }
        } else {
          console.warn('⚠️ No valid project payload to update.')
          setUpdateIsLoading(false)
        }

      } catch (e) {
        console.error('❌ Error updating project statuses:', e)
        setUpdateIsLoading(false)
      }
    }

    fetchData()
  }, [projectIDs, backendURL, dateNow])

  return [updateIsLoading]
}

export default useUpdateProjects
