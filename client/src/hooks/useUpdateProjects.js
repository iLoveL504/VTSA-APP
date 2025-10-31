import {Axios} from '../api/axios'
import { useStoreState } from 'easy-peasy'
import { useEffect, useState } from 'react'

const summaryMap = {
    'Mechanical Installation (Passenger Elevator)': 'Installation',
    'Preliminaries': 'Preliminaries',
    'Structural/Civil Works': 'Structural/Manufacturing',
    'Manufacturing and Importation': 'Structural/Manufacturing',
    'Planning For Mobilization And Execution': 'Planning',
    'Testing and Commissioning (Passenger Elevator)': 'Test and Comm'
}

const useUpdateProjects = (projectIDs) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const dateNow = useStoreState(state => state.date)
    const [updateIsLoading, setUpdateIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            console.log(projectIDs)
            if(projectIDs) {
          
                let payload = {}
                try{
                    for (let i = 0; i < projectIDs.length; i++){
                        //console.log(projectIDs[i])
                        //schedule/${projectIDs[i]}
                        //console.log(projectIDs[i].id)
                        const response = await Axios.get(`/api/projects/schedule/${projectIDs[i].id}`)
                     
                        if(!response) return
                        //console.log(response)
                        const foundParentTask = response.data.find(t => t.task_type === 'summary' && new Date(dateNow) > new Date(t.task_start) && new Date(dateNow) < new Date(t.task_end))
                       // console.log(foundParentTask)
                               
                        if(foundParentTask === undefined) continue 
                       // if(foundParentTask.task_name === 'Testing and Commissioning (Passenger Elevator)') console.log(summaryMap[foundParentTask])

                       //actual current task based on date
                        const ct = response.data.find(t => t.task_type === 'task' && new Date(dateNow) > new Date(t.task_start) && new Date(dateNow) < new Date(t.task_end))

                        const phase = response.data.find(t => t.task_id === ct.task_parent)
                        console.log(projectIDs[i])
                        const installation_start_date = response.data.find(t => t.task_name === 'Mechanical Installation (Passenger Elevator)').task_start.split("T")[0]
                        
                        const end_date = response.data.find(t => t.task_name === 'Final Cleaning / Hand over').task_end.split("T")[0]
                        const start_date = response.data.find(t => t.task_name === 'Preliminaries').task_start.split("T")[0]
                        const tnc_start_date = response.data.find(t => t.task_name === 'Testing and Commissioning (Passenger Elevator)').task_start.split("T")[0]
                        const foundCurrentTask = ct.task_name
                        const manufacturing_end_date = response.data.find(t => t.task_name === 'Manufacturing and Importation Process (Passenger Elevator)').task_end.split("T")[0]
                        const currentTask_id = ct.task_id
                        const handover_done = projectIDs[i].handover_done
                        //Check if project is in "TNC phase"
                        let in_tnc = 0
                        let in_qaqc = false
                        let joint_inspection = false
                       // console.log(`${projectIDs[i].id}: `, projectIDs[i].tnc_assign_date !== null)
                        if(projectIDs[i].tnc_assign_date !== null){
                            in_tnc = (new Date(projectIDs[i].tnc_assign_date) <= new Date(dateNow)) ? 1 : 0
                            //console.log(`${projectIDs[i].id}: `, new Date(projectIDs[i].tnc_assign_date) <= new Date(dateNow))
                        }
                        if(projectIDs[i].qaqc_inspection_date !== null){
                            
                            const inspectionDate = new Date(projectIDs[i].qaqc_inspection_date);
                            const now = new Date(dateNow);

                            // Normalize both to YYYY-MM-DD (ignore time)
                            inspectionDate.setHours(0, 0, 0, 0);
                            now.setHours(0, 0, 0, 0);
                            in_qaqc = inspectionDate <= now;

                            console.log(in_qaqc)
                            console.log('------------qaqc----------')
                            //console.log(`${projectIDs[i].id}: `, new Date(projectIDs[i].qaqc_inspection_date) <= new Date(dateNow))
                        }
                        console.log(in_qaqc)
                        if(projectIDs[i].pms_joint_inspection !== null){
                            joint_inspection = (new Date(projectIDs[i].pms_joint_inspection) <= new Date(dateNow)) ? true : false
                            console.log(joint_inspection)
                            //console.log(`${projectIDs[i].id}: `, new Date(projectIDs[i].qaqc_inspection_date) <= new Date(dateNow))
                        }
                        // console.log(`${projectIDs[i].lift_name}: `, currentTask_id)

                        //Check 
                       const phaseName = phase.task_name
                        //console.log(start_date)
                        payload[`project${projectIDs[i].id}`] = {'id': projectIDs[i].id, 
                            'status': summaryMap[foundParentTask.task_name], 
                            end_date, start_date, manufacturing_end_date, 
                            tnc_start_date, installation_start_date, 
                            foundCurrentTask, in_tnc, in_qaqc, 
                            phaseName, joint_inspection, currentTask_id,
                            handover_done
                        }
                        //console.log('hi')
                    } 
                    // console.log('hihidsafidsahfi')
                    // console.log(payload )
                    const response = await Axios.put(`/api/projects/update-status`, payload)
                    if (response.data.success === true){
                        // console.log('hi')
                        setUpdateIsLoading(false)
                    }
                    
                } catch (e) {
                        console.log('sadfffffffffffffffffff')
                        setUpdateIsLoading(false)
                        console.log('error', e)
                }

            }

        }
        fetchData()
        
    }, [projectIDs, backendURL, dateNow])

    return [updateIsLoading]
}

export default useUpdateProjects