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
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../../firebase'

import { Chat } from '../../types/chatData'
import { Message } from '../../types/message'

interface ChatContextProps {
  children: ReactNode | ReactNode[]
}

interface ChatData {
  id: string
  userImg: string
  username: string
}

type ChatContextType = {
  showChat: boolean
  chatData: ChatData
  messages: any[]
  chats: any[]
  unreadChats: number
  setShowChat: Dispatch<SetStateAction<boolean>>
  setChatData: Dispatch<SetStateAction<ChatData>>
  setMessages: Dispatch<SetStateAction<any[]>>
  setChats: Dispatch<SetStateAction<any[]>>
  setUnreadChats: Dispatch<SetStateAction<number>>
}

const ChatContext = createContext<ChatContextType>({
  showChat: false,
  chatData: { id: '', userImg: '', username: '' },
  messages: [],
  chats: [],
  unreadChats: 0,
  setShowChat: () => {},
  setChatData: () => {},
  setMessages: () => {},
  setChats: () => {},
  setUnreadChats: () => {},
})

export const ChatContextProvider = ({ children }: ChatContextProps) => {
  const [showChat, setShowChat] = useState<boolean>(false)
  const [chatData, setChatData] = useState<ChatData>({
    id: '',
    userImg: '',
    username: '',
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [unreadChats, setUnreadChats] = useState<number>(0)

  const { data: session } = useSession()

  useEffect(() => {
    if (session)
      return onSnapshot(
        query(
          collection(db, 'users', session.user.uid, 'chats'),
          orderBy('created_at', 'desc')
        ),
        (snapshot) => {
          setChats(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
        }
      )
  }, [db])

  useEffect(() => {
    if (session) {
      return onSnapshot(
        query(
          collection(db, 'users', session.user.uid, 'chats'),
          where('isUnread', '==', true)
        ),
        (snapshot) => {
          setUnreadChats(snapshot.size)
        }
      )
    }
  }, [db])

  return (
    <ChatContext.Provider
      value={{
        showChat,
        setShowChat,
        chatData,
        setChatData,
        messages,
        setMessages,
        chats,
        setChats,
        unreadChats,
        setUnreadChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

const useChatContext = () => useContext(ChatContext)

export default useChatContext
