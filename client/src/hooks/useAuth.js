import { useState, useEffect } from 'react'

export const useAuth = () => {
    const [roles, setRoles] = useState()
    useEffect(() => {
        console.log('useEffect fired!')
    }, [])

    return [ roles, setRoles ]
}