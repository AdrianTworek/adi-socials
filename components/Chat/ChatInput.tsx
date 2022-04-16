import { FC, useCallback, useRef, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { Picker } from 'emoji-mart'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../firebase'

import useDarkThemeContext from '../../context/settings/DarkTheme'
import useChatContext from '../../context/chat/Chat'

import useOnClickOutside from '../../hooks/useOnClickOutside'

import { BsFillEmojiHeartEyesFill } from 'react-icons/bs'
import { IoMdSend } from 'react-icons/io'

import IconButton from '../Feed/IconButton'

const ChatInput: FC = () => {
  const [text, setText] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)

  const { data: session } = useSession()
  const { chatData } = useChatContext()
  const { darkTheme } = useDarkThemeContext()
  const { t } = useTranslation()

  const emojisPickerRef = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useOnClickOutside(
    emojisPickerRef,
    useCallback(() => setTimeout(() => setShowEmojis(false)), [showEmojis])
  )

  useEffect(() => {
    setText('')
    inputRef.current!.focus()

    // Mark chat as read when open
    ;(async () => {
      const chatRef = await getDoc(
        doc(db, 'users', session.user.uid, 'chats', chatData.id)
      )

      if (chatRef.exists()) {
        await updateDoc(
          doc(db, 'users', session.user.uid, 'chats', chatData.id),
          {
            isUnread: false,
          }
        )
      } else {
        await setDoc(doc(db, 'users', session.user.uid, 'chats', chatData.id), {
          isUnread: false,
        })
      }
    })()
  }, [chatData])

  const addEmojiToInput = (e: any) => {
    let sym = e.unified.split('-')
    let codesArr: any[] = []

    sym.forEach((el: any) => codesArr.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArr)

    setText(text + emoji)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setText('')
    setShowEmojis(false)

    if (text) {
      await Promise.all([
        addDoc(
          collection(
            db,
            'users',
            session.user.uid,
            'chats',
            chatData.id,
            'messages'
          ),
          {
            text,
            sentBy: session.user.uid,
            created_at: serverTimestamp(),
          }
        ),
        addDoc(
          collection(
            db,
            'users',
            chatData.id,
            'chats',
            session.user.uid,
            'messages'
          ),
          {
            text,
            sentBy: session.user.uid,
            created_at: serverTimestamp(),
          }
        ),
        setDoc(doc(db, 'users', chatData.id, 'chats', session.user.uid), {
          isUnread: true,
          userId: session.user.uid,
          userImg: session.user.image,
          username: session.user.name,
          lastMessage: text,
          sentBy: session.user.uid,
          created_at: serverTimestamp(),
        }),
        setDoc(doc(db, 'users', session.user.uid, 'chats', chatData.id), {
          isUnread: false,
          userId: chatData.id,
          userImg: chatData.userImg,
          username: chatData.username,
          lastMessage: text,
          sentBy: session.user.uid,
          created_at: serverTimestamp(),
        }),
      ])
    }
  }

  return (
    <div className="mt-auto p-2 pb-4">
      <form
        onSubmit={handleSubmit}
        className={`w-full ${text && 'flex gap-2'}`}
      >
        <div className="relative flex-1">
          <input
            type="text"
            ref={inputRef}
            placeholder={`${t('sendMessage')}...`}
            className="w-full bg-gray-200 dark:bg-slate-700 dark:text-gray-100 px-3 pr-12 py-1.5 rounded-full outline-none transition-all"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="absolute top-0.5 right-2.5">
            <IconButton
              type="button"
              icon={
                <BsFillEmojiHeartEyesFill
                  className="relative w-8 h-8 p-1.5 text-2xl text-blue-500 rounded-full 
                  transition-all hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => setShowEmojis(!showEmojis)}
                />
              }
              tooltipText="Emojis"
              tooltipPosition="top"
            />
          </div>
        </div>

        {text.trim() && (
          <div className="flex items-center" onClick={handleSubmit}>
            <IconButton
              type="button"
              icon={<IoMdSend className="text-2xl text-pink-400" />}
              tooltipText={t('send')}
              tooltipPosition="top"
            />
          </div>
        )}
      </form>

      {showEmojis && (
        <div ref={emojisPickerRef}>
          <Picker
            onSelect={addEmojiToInput}
            theme={darkTheme ? 'dark' : 'light'}
            style={{
              position: 'absolute',
              bottom: '4rem',
              left: '0',
              maxWidth: 300,
              borderRadius: 20,
              zIndex: 30,
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ChatInput
