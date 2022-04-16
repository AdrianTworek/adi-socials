import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSession } from 'next-auth/react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'

import { Notification } from '../../types/notification'

interface NotificationsContextProps {
  children: ReactNode | ReactNode[]
}

type NotificationsContextType = {
  notifications: any[]
  loading: boolean
  setNotifications: Dispatch<SetStateAction<any[]>>
  setLoading: Dispatch<SetStateAction<boolean>>
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  setNotifications: () => {},
  loading: false,
  setLoading: () => {},
})

export const NotificationsContextProvider = ({
  children,
}: NotificationsContextProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { data: session } = useSession()

  useEffect(() => {
    setLoading(true)

    if (session) {
      onSnapshot(
        query(
          collection(db, 'users', session.user.uid, 'notifications'),
          orderBy('created_at', 'desc')
        ),
        (snapshot) => {
          setNotifications(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
        }
      )
    }

    setLoading(false)
  }, [db])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        loading,
        setLoading,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

const useNotificationsContext = () => useContext(NotificationsContext)

export default useNotificationsContext
