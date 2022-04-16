import { Fragment, FC, useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from '../../firebase'

import { Message } from '../../types/message'

import useChatContext from '../../context/chat/Chat'

const ChatBody: FC = () => {
  const [messages, setMessages] = useState<Message[]>([])

  const { data: session } = useSession()
  const { chatData, setChatData } = useChatContext()
  const { t } = useTranslation('common')

  const lastMessageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onSnapshot(
      query(
        collection(
          db,
          'users',
          session.user.uid,
          'chats',
          chatData?.id,
          'messages'
        ),
        orderBy('created_at')
      ),
      (snapshot) => {
        setMessages(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
      }
    )
  }, [db, chatData])

  // Update chat window when someone else sent a message
  useEffect(() => {
    ;(async () => {
      if (
        messages[messages.length - 1]?.sentBy !== session.user.uid &&
        messages[messages.length - 1]?.sentBy !== chatData.id
      ) {
        if (messages[messages.length - 1]?.sentBy) {
          const newChat = await getDoc(
            doc(
              db,
              'users',
              session.user.uid,
              'chats',
              messages[messages.length - 1].sentBy
            )
          )
          setChatData({
            id: newChat.data().sentBy,
            username: newChat.data().username,
            userImg: newChat.data().userImg,
          })
        }
      }
    })()
  }, [messages])

  useEffect(() => {
    if (lastMessageRef.current) {
      setTimeout(
        () => lastMessageRef.current!.scrollIntoView({ behavior: 'smooth' }),
        200
      )
    }
  }, [messages])

  return (
    <div className="h-full flex flex-col items-center gap-3 p-2 overflow-y-scroll chat-scrollbar">
      {!messages.length && (
        <div className="flex flex-col items-center mt-6">
          <img
            src={chatData.userImg}
            alt="user image"
            className="w-16 h-16 rounded-full"
          />

          <p className="text-lg dark:text-gray-200 font-semibold">
            {chatData.username}
          </p>

          <p className="text-sm dark:text-gray-400">{t('youHaventChatted')}</p>
        </div>
      )}

      <>
        {messages.map((message: Message, idx: number) => (
          <Fragment key={message.id}>
            {/* Show date only above the first message from that particular day */}
            {new Date(messages[idx]?.created_at?.seconds * 1000).getDate() !==
              new Date(
                messages[idx - 1]?.created_at?.seconds * 1000
              ).getDate() && (
              <p className="text-center text-[0.70rem] text-gray-500 dark:text-gray-400">
                {message?.created_at?.seconds &&
                  new Date(
                    message.created_at.seconds * 1000
                  ).toLocaleDateString()}
              </p>
            )}{' '}
            {/* Show time only when the new message has different author */}
            {messages[idx]?.sentBy !== messages[idx - 1]?.sentBy && (
              <>
                <p
                  className={`${
                    message.sentBy === session.user.uid ? 'ml-auto' : 'mr-auto'
                  } text-[0.70rem] text-gray-500 dark:text-gray-400`}
                >
                  {new Date(message?.created_at?.seconds * 1000)
                    .toLocaleTimeString()
                    .slice(0, 5)}
                </p>
              </>
            )}
            {/* Message content */}
            <div className="w-full flex gap-2 items-center">
              {message.sentBy !== session.user.uid && (
                <img
                  src={chatData.userImg}
                  alt="user image"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div
                key={idx}
                className={`${
                  message.sentBy === session.user.uid
                    ? 'ml-auto bg-indigo-500'
                    : 'mr-auto bg-pink-500'
                } break-words max-w-[70%] p-2 rounded-xl`}
              >
                <p className="text-white">{message.text}</p>
              </div>
            </div>
          </Fragment>
        ))}
        <div ref={lastMessageRef} />
      </>
    </div>
  )
}

export default ChatBody
