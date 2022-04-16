import { FC } from 'react'
import useChatContext from '../../context/chat/Chat'

import ChatBody from './ChatBody'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'

const Chat: FC = () => {
  const { showChat } = useChatContext()

  if (!showChat) return null

  return (
    <div className="fixed bottom-0 right-[5%] w-[20rem] h-[28.125rem] flex flex-col bg-gray-50 dark:bg-slate-800 rounded-t-md z-30 shadow-xl shadow-gray-400 dark:shadow-gray-900">
      <ChatHeader />
      <ChatBody />
      <ChatInput />
    </div>
  )
}

export default Chat
