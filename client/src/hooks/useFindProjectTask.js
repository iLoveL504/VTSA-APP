import { useEffect, useState } from "react"
import useAxiosFetch from "./useAxiosFetch.js"
import { useStoreState } from "easy-peasy"

const useFindProjectTask = (id) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const dateNow = useStoreState(state => state.date)

    const [tasksIsLoading, setTasksIsLoading] = useState(true)
    //projected current task
    const [projectedTask, setProjectedTask] = useState(null)

    //real current task
    const [currentTask, setCurrentTask] = useState(null)
    const [currentParentTask, setCurrentParentTask] = useState(null)
    const [currentTaskPhase, setCurrentTaskPhase] = useState(null)
    const [projectExists, setProjectExists] = useState('loading')
    const {data: fetchedData, fetchError: fetchError, isLoading: isLoading} = useAxiosFetch(`${backendURL}/api/projects/schedule/${id}`)
    const [projectCompleted, setProjectCompleted] = useState(false)
    const [isBehindSchedule, setIsBehindSchedule] = useState(false)


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
                console.log(foundParentTask)
            if (foundParentTask === undefined) return setProjectCompleted(true)
            if(foundParentTask.task_name === 'Structural/Civil Works'){
                setCurrentParentTask({...foundParentTask, task_name: 'Strucutural/Civil Works and Manufacturing'})
            } else setCurrentParentTask(foundParentTask)
            console.log('hihi')
            //
            //find current task based on current date
            const foundCurrentTask = fetchedData.find(t => ((t.task_actual_current || t.task_done === 0) && t.task_type === 'task'))
            //find actual current task
            const foundProjectedCurrentTask = fetchedData.find(t => t.task_type === 'task' && new Date(dateNow) > new Date(t.task_start) && new Date(dateNow) < new Date(t.task_end))
            setIsBehindSchedule(foundCurrentTask.task_id !== foundProjectedCurrentTask.task_id)

            const foundCurrentTaskPhase = fetchedData.find(t => t.task_id === foundCurrentTask.task_parent)
            setCurrentTaskPhase(foundCurrentTaskPhase)
            console.log(foundCurrentTask)
            console.log(foundProjectedCurrentTask)
            setCurrentTask(foundCurrentTask)
            setProjectedTask(foundProjectedCurrentTask)
            setTasksIsLoading(false)
            //find current percent progress
            
        }
    }, [isLoading, fetchedData, dateNow, fetchError])

    return{currentTask, 
        currentParentTask, 
        tasksIsLoading, 
        fetchError, 
        projectExists, 
        fetchedData, 
        projectCompleted, 
        currentTaskPhase,
        isBehindSchedule,
        projectedTask
    }
}

export default useFindProjectTask