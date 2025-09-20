import {useState, useEffect} from 'react'
import axios from 'axios'

const useAxiosFetch = (dataUrl) => {
    const [data, setData] = useState([])
    const [fetchError, setFetchError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        if (!dataUrl) return

        let isMounted = true
        const controller = new AbortController()
        const fetchData = async() => {
            setIsLoading(true)
            try{
                const response = await axios.get(dataUrl,{
                    signal: controller.signal
                })
                if(isMounted){
                    setData(response.data)
                    setFetchError(null)
                }
            }catch(e){
                if(isMounted){
                    setFetchError(e.message)
                    setIsLoading(false)
                    setData([])
                }
            }
            finally{
                isMounted && setTimeout(() => setIsLoading(false))
            }
        }
        fetchData()
       return () => {
            console.log('cleanup function')
            isMounted = false
            controller.abort()
        }
    },[dataUrl])

    return { data, fetchError, isLoading }
}

export default useAxiosFetch