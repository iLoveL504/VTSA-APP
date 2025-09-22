import { useEffect, useState } from "react"
import useAxiosFetch from "../hooks/useAxiosFetch"
import { useStoreState } from "easy-peasy"

const taskMap = {
    unloading_equipment_date: 'Unloading of elevator equipments',
    scaffolding_date: 'Scaffolding Installation',
    hauling_date: 'Hauling Works',
    template_date: 'Template Setting',
    boring_holes_date: 'Marking and Boring of Holes',
    rail_bracket_date: 'Rail Bracket Installation',
    guide_rail_car_date: 'Guide Rail Setting - Main/Car',
    guide_rail_cwt_date: 'Guide Rail Setting - Counterweight (CWT)',
    guide_rail_gauge_date: 'Guide Rail Setting - Gauging',
    door_sills_date: 'Landing Door Assembly - Sills and Supports',
    door_jamb_date: 'Landing Door Assembly - Jamb and Supports',
    door_frame_date: 'Landing Door Assembly - Frame and Doors',
    machine_traction_date: 'M/R Equipment Setting - Traction Machine',
    machine_beams_date: 'M/R Equipment Setting - Support Beams',
    machine_governor_date: 'M/R Equipment Setting - Governor',
    control_panel_date: 'Installation of Control Panel',
    car_accessories_date: 'Car Assembly - All Accessories',
    car_wiring_date: 'Car Assembly - Car Piping Wiring',
    travelling_cable_date: 'Travelling Cable Layout',
    counterweight_date: 'Counterweight Assembly',
    ropes_hoisting_date: 'Laying out of Ropes - Hoisting',
    ropes_governor_date: 'Laying out of Ropes - Governor',
    ropes_compensating_date: 'Laying out of Ropes - Compensating',
    wiring_mr_date: 'Wiring - Machine Room',
    wiring_hoistway_date: 'Wiring - Hoistway',
    pit_ladder_date: 'Installation of Pit Ladder / Hoistway Lighting',
    initial_test_date: 'Initial testing',
    slow_speed_date: 'Slow speed',
    high_speed_date: 'High speed and Mechanical Adjustment',
    load_test_date: 'Load Test',
    final_adjust_date: 'Final Adjust',
    features_test_date: 'Features Test / Correction of Defects',
    handover_date: 'Final Cleaning / Hand over'
};

const reverseTaskMap = {
    'Unloading of elevator equipments': 'unloading_equipment_date',
    'Scaffolding Installation': 'scaffolding_date',
    'Hauling Works': 'hauling_date',
    'Template Setting': 'template_date',
    'Marking and Boring of Holes': 'boring_holes_date',
    'Rail Bracket Installation': 'rail_bracket_date',
    'Guide Rail Setting - Main/Car': 'guide_rail_car_date',
    'Guide Rail Setting - Counterweight (CWT)': 'guide_rail_cwt_date',
    'Guide Rail Setting - Gauging': 'guide_rail_gauge_date',
    'Landing Door Assembly - Sills and Supports': 'door_sills_date',
    'Landing Door Assembly - Jamb and Supports': 'door_jamb_date',
    'Landing Door Assembly - Frame and Doors': 'door_frame_date',
    'M/R Equipment Setting - Traction Machine': 'machine_traction_date',
    'M/R Equipment Setting - Support Beams': 'machine_beams_date',
    'M/R Equipment Setting - Governor': 'machine_governor_date',
    'Installation of Control Panel': 'control_panel_date',
    'Car Assembly - All Accessories': 'car_accessories_date',
    'Car Assembly - Car Piping Wiring': 'car_wiring_date',
    'Travelling Cable Layout': 'travelling_cable_date',
    'Counterweight Assembly': 'counterweight_date',
    'Laying out of Ropes - Hoisting': 'ropes_hoisting_date',
    'Laying out of Ropes - Governor': 'ropes_governor_date',
    'Laying out of Ropes - Compensating': 'ropes_compensating_date',
    'Wiring - Machine Room': 'wiring_mr_date',
    'Wiring - Hoistway': 'wiring_hoistway_date',
    'Installation of Pit Ladder / Hoistway Lighting': 'pit_ladder_date',
    'Initial testing': 'initial_test_date',
    'Slow speed': 'slow_speed_date',
    'High speed and Mechanical Adjustment': 'high_speed_date',
    'Load Test': 'load_test_date',
    'Final Adjust': 'final_adjust_date',
    'Features Test / Correction of Defects': 'features_test_date',
    'Final Cleaning / Hand over': 'handover_date'
};

const useFindProjectTask = (id) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const dateNow = useStoreState(state => state.date)

    const [tasksFetchError, setTasksFetchError] = useState(null)
    const [tasksIsLoading, setTasksIsLoading] = useState(true)
    const [currentTask, setCurrentTask] = useState({})
    const [allTaskDates, setAllTaskDates] = useState([])

    const {data: fetchedData, fetchError: fetchError, isLoading: isLoading} = useAxiosFetch(`${backendURL}/projects/schedule/${id}`)

    useEffect(() => {
        if (!isLoading) {
            console.log(fetchError)
            if(fetchError){
                console.log('no schedule found')
                setTasksFetchError(fetchError)
                setTasksIsLoading(isLoading)
                return
            }
            setTasksFetchError(fetchError)
            setTasksIsLoading(false)
            const d2 = new Date(dateNow)
 
            console.log(fetchedData)
            const zzz = Object.entries(fetchedData[0])
            .filter(([key]) => key.endsWith("date") || key.endsWith("_end_date") || key.endsWith("_done")) 
            console.log(zzz)
            let correct = {}
            for(let i = 0; i < zzz.length; i++){
         
                if(i !== zzz.length - 1 && i !== zzz.length - 2){
                    correct[i] = {
                        name: taskMap[zzz[i][0]], 
                        date: new Date(zzz[i][1]),
                        end_date: new Date(zzz[i + 1][1]),
                        done: zzz[i+2][1]
                    }
                }
            }
            console.log(correct)
            let dateFields = Object.entries(correct)
            .filter((f, index) => index % 3 === 0)
            .map((t) => t[1])
            console.log(dateFields)
            setAllTaskDates(dateFields)
            

            // const dateFields = Object.entries(fetchedData[0])
            // .filter(([key]) => key.endsWith("date") || key.endsWith("_end_date")) 
            // .map(([key, value]) => ({ key, value: new Date(value) }));


            for (let i = 0; i < dateFields.length; i++) {
                if (dateFields[i].date < d2) {
                    if (i + 1 < dateFields.length && dateFields[i + 1].date > d2) {
                    console.log(dateFields[i]);
                    setCurrentTask({
                        name: dateFields[i].name,
                        date: dateFields[i].date.toISOString().split("T")[0],
                        end_date: dateFields[i].end_date.toISOString().split("T")[0],
                        done: dateFields[i].done
                    });
                    return;
                    }
                }
            }
        }

        
    }, [isLoading, fetchedData, fetchError])
    const findReverseTaskName = (name) => {
            const rt = reverseTaskMap[name]
            return rt
        
    }

    return [currentTask, tasksFetchError, tasksIsLoading, allTaskDates, findReverseTaskName]
}

export default useFindProjectTask