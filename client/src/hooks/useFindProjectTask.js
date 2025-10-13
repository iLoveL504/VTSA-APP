import { useEffect, useState } from "react"
import useAxiosFetch from "./useAxiosFetch.js"
import { useStoreState } from "easy-peasy"

const useFindProjectTask = (id) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const dateNow = useStoreState(state => state.date)

    const [tasksIsLoading, setTasksIsLoading] = useState(true)
    const [currentTask, setCurrentTask] = useState(null)
    const [currentParentTask, setCurrentParentTask] = useState(null)
    const [projectExists, setProjectExists] = useState('loading')
    const {data: fetchedData, fetchError: fetchError, isLoading: isLoading} = useAxiosFetch(`${backendURL}/projects/schedule/${id}`)
    const [projectCompleted, setProjectCompleted] = useState(false)

    useEffect(() => {
        if(fetchError) {
            setProjectExists(false)
            setTasksIsLoading(false)
            console.log('no schedule')
            return
        }
        if(!isLoading && fetchedData){
            console.log('date now: ', dateNow)
            console.log(fetchedData)
            setProjectExists(true)

            //find Parent task
            const foundParentTask = fetchedData.find(t => t.task_type === 'summary' && new Date(dateNow) > new Date(t.task_start) && new Date(dateNow) < new Date(t.task_end))
            if (foundParentTask === undefined) return setProjectCompleted(true)
            if(foundParentTask.task_name === 'Structural/Civil Works'){
                setCurrentParentTask({...foundParentTask, task_name: 'Strucutural/Civil Works and Manufacturing'})
            } else setCurrentParentTask(foundParentTask)
    
            //find current task
            const foundCurrentTask = fetchedData.find(t => t.task_type === 'task' && new Date(dateNow) > new Date(t.task_start) && new Date(dateNow) < new Date(t.task_end))
            console.log(foundCurrentTask)
            setCurrentTask(foundCurrentTask)
            setTasksIsLoading(false)
            //find current percent progress
            
        }
    }, [isLoading, fetchedData, dateNow, fetchError])

    return{currentTask, currentParentTask, tasksIsLoading, fetchError, projectExists, fetchedData, projectCompleted}
}

export default useFindProjectTask