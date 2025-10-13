import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

export const useSocket = (namespace = "/", eventHandlers = {}) => {
  const socketRef = useRef(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketURL = import.meta.env.VITE_BACKEND_URL + namespace
    console.log('connecting to namespace', namespace)
    const token = localStorage.getItem('token')

    const newSocket = io(socketURL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
    })

    socketRef.current = newSocket

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id)
      setSocket(newSocket)
    })

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err)
    })

    return () => {
      newSocket.disconnect()
      socketRef.current = null
      setSocket(null)
    }
  }, [namespace])

  useEffect(() => {
    if (!socket) return
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler)
    })

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.off(event, handler)
      })
    }
  }, [socket, eventHandlers])

  return socket
}
