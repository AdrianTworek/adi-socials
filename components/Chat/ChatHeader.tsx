import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import useChatContext from '../../context/chat/Chat'

import { IoMdClose } from 'react-icons/io'

import IconButton from '../Feed/IconButton'

const ChatHeader: FC = () => {
  const { setShowChat, chatData, setChatData } = useChatContext()

  const router = useRouter()
  const { t } = useTranslation('common')

  useEffect(() => {
    const handler = (e: any) => e.key === 'Escape' && handleCloseChat()
    window.addEventListener('keyup', handler)

    return () => {
      window.removeEventListener('keyup', handler)
    }
  }, [])

  const handleCloseChat = () => {
    setShowChat(false)
    setChatData({
      id: '',
      userImg: '',
      username: '',
    })
  }

  return (
    <div className="flex justify-between items-center p-2 border-b dark:border-slate-700">
      <div
        className="flex gap-1.5 items-center cursor-pointer"
        onClick={() => router.push(`/users/${chatData.id}`)}
      >
        <img
          src={chatData.userImg}
          alt="User image"
          className="w-9 h-9 rounded-full"
        />
        <p className="font-semibold text-gray-800 dark:text-gray-100">
          {chatData.username}
        </p>
      </div>

      <div className="flex items-center" onClick={handleCloseChat}>
        <IconButton
          icon={
            <IoMdClose className="text-2xl text-indigo-600 dark:text-indigo-400" />
          }
          tooltipText={t('close')}
          tooltipPosition="top"
        />
      </div>
    </div>
  )
}

export default ChatHeader
