import useFindProjectTask from './useFindProjectTask'
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
    const projects = useStoreState(state => state.projects)
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
                        const response = await Axios.get(`${backendURL}/projects/schedule/${projectIDs[i]}`)
                        if(!response) return
                        console.log(response)
                        const foundParentTask = response.data.find(t => t.task_type === 'summary' && new Date(dateNow) > new Date(t.task_start) && new Date(dateNow) < new Date(t.task_end))
                        console.log(projectIDs[i])
                        console.log(foundParentTask)
                        if(foundParentTask === undefined) return 
                        if(foundParentTask.task_name === 'Testing and Commissioning (Passenger Elevator)') console.log(summaryMap[foundParentTask])
                        console.log(projectIDs[i])
                        console.log('i still run')
                        const end_date = response.data.find(t => t.task_name === 'Final Cleaning / Hand over').task_end.split("T")[0]
                        const start_date = response.data.find(t => t.task_name === 'Preliminaries').task_start.split("T")[0]
                        const manufacturing_end_date = response.data.find(t => t.task_name === 'Manufacturing and Importation Process (Passenger Elevator)').task_end.split("T")[0]
                       console.log(`project ${projectIDs[i]} is in ${foundParentTask} phase`)
                       
                        console.log(start_date)
                        payload[`project${projectIDs[i]}`] = {'id': projectIDs[i], 'status': summaryMap[foundParentTask.task_name], end_date, start_date, manufacturing_end_date}
                        console.log('hi')
                    } 
                    console.log(payload )
                    const response = await Axios.put(`${backendURL}/projects/update-status`, payload)
                    if (response.data.success === true){
                        console.log('hi')
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
        
    }, [projectIDs])

    return [updateIsLoading]
}

export default useUpdateProjects