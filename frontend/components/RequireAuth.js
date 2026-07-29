import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function RequireAuth({ children }) {
  const { user } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    }
  }, [user])

  if (!user) return null

  return children
}
