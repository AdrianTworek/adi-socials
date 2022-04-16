import { FC } from 'react'
import Moment from 'react-moment'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'

import { Chat } from '../../../types/chatData'

import useChatContext from '../../../context/chat/Chat'
import useActiveSectionsContext from '../../../context/header/ActiveSections'

import Dropdown from '../../../hoc/Dropdown'

const iChatDropdown: FC = () => {
  const { data: session } = useSession()
  const { setShowChat, setChatData, chats } = useChatContext()
  const { setActiveIcon } = useActiveSectionsContext()
  const { t } = useTranslation('common')

  const handleClickChat = (chat: Chat) => {
    // Populate chat window with chat data
    setShowChat(true)
    setChatData({
      id: chat.id,
      username: chat.username,
      userImg: chat.userImg,
    })

    // Reset active menu section to trigger to close iChat dropdown
    setActiveIcon('')
  }

  return (
    <div className="flex flex-col">
      {!chats.length ? (
        <span className="pl-2 text-gray-400 dark:text-gray-500 font-medium">
          {t('noChats')}
        </span>
      ) : (
        <>
          {chats.map((chat: Chat) => (
            <div
              key={chat.id}
              className="flex gap-2 items-center p-2 transition-all rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700"
              onClick={() => handleClickChat(chat)}
            >
              <img
                src={chat.userImg}
                alt="user image"
                className="w-12 h-12 rounded-full"
              />

              <div>
                <p className="text-[1rem] text-gray-900 dark:text-gray-200">
                  {chat.username}
                </p>
                <div className="flex gap-1">
                  <p className="max-w-[9rem] text-[0.8rem] text-gray-500 dark:text-gray-400 truncate">
                    {chat.sentBy === session.user.uid && 'You:'}{' '}
                    {chat.lastMessage}
                  </p>

                  <div className="text-[0.7rem] text-gray-400 ml-1 self-end">
                    {chat?.created_at && (
                      <Moment fromNow>{chat.created_at.toDate() - 4000}</Moment>
                    )}
                  </div>
                </div>
              </div>

              {/* Unread message dot */}
              {chat.isUnread && (
                <div className="w-3 h-3 ml-auto rounded-full bg-indigo-600"></div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default Dropdown(iChatDropdown)
