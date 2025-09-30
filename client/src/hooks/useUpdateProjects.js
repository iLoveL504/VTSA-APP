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
    'Testing and Commissioning (Passenger Elavator)': 'Test and Comm'
}

const useUpdateProjects = (projectIDs) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const projects = useStoreState(state => state.projects)
    const dateNow = useStoreState(state => state.date)
    const [updateIsLoading, setUpdateIsLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            if(projectIDs) {
                console.log()
                let payload = {}
                try{
                    for (let i = 0; i < projectIDs.length; i++){
                        const response = await Axios.get(`${backendURL}/projects/schedule/${projectIDs[i]}`)
                        const foundParentTask = response.data.find(t => t.task_type === 'summary' && new Date(dateNow) > new Date(t.task_start) && new Date(dateNow) < new Date(t.task_end))
                        console.log(`project ${projectIDs[i]} is in ${foundParentTask.task_name} phase`)
                        console.log(i)
                        payload[`project${projectIDs[i]}`] = {'id': projectIDs[i], 'status': summaryMap[foundParentTask.task_name]}
                    } 
                    const response = await Axios.put(`${backendURL}/projects/update-status`, payload)
                    if (response.data.success === true){
                        console.log('hi')
                        setUpdateIsLoading(false)
                    }
                    
                } catch (e) {
                        console.log('error', e)
                }

            }

        }
        fetchData()
        
    }, [projectIDs])

    return [updateIsLoading]
}

export default useUpdateProjects