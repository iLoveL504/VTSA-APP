import { useState } from "react";

const useToggle = () => {
    const [ toggle, setToggle ] = useState(true)
    const invertToggle = () => {
        setToggle(prev => !prev)
    }
    return [ toggle, invertToggle ]
}

export default useToggle

