import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export const useSocket = (eventHandlers = {}) => {
  const socketRef = useRef(null)

  
  useEffect(() => {
    if (!socketRef.current) {
      const socketURL = import.meta.env.VITE_BACKEND_URL
      console.log('connecting to', socketURL)
      const token = localStorage.getItem('token')

      socketRef.current = io(socketURL, {
        auth: { token },
        transports: ['websocket', 'polling'], 
        reconnection: true,        
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler)
    })

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.off(event, handler)
      })
    }
  }, [eventHandlers])

  return socketRef.current
}
