import { FC, FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { Picker } from 'emoji-mart'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../../firebase'

import { Comment as CommentType } from '../../../types/comment'

import useDarkThemeContext from '../../../context/settings/DarkTheme'

import useOnClickOutside from '../../../hooks/useOnClickOutside'

import { BsFillEmojiHeartEyesFill } from 'react-icons/bs'

import Comment from './Comment'
import IconButton from '../IconButton'

interface Props {
  postId: string
  comments: CommentType[]
  userId: string
}

const CommentsSection: FC<Props> = ({ postId, comments, userId }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [showEmojis, setShowEmojis] = useState<boolean>(false)
  const [text, setText] = useState<string>('')
  const [currentComment, setCurrentComment] = useState<string>('')

  const { data: session } = useSession()
  const { darkTheme } = useDarkThemeContext()
  const { t } = useTranslation('common')

  const inputRef = useRef<HTMLInputElement>(null)
  const emojisPickerRef = useRef<any>(null)

  useOnClickOutside(
    emojisPickerRef,
    useCallback(() => setTimeout(() => setShowEmojis(false)), [showEmojis])
  )

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current!.focus()
    }
  }, [isEdit, text])

  const addEmojiToInput = (e: any) => {
    let sym = e.unified.split('-')
    let codesArr: any[] = []

    sym.forEach((el: any) => codesArr.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArr)

    setText(text + emoji)
  }

  const handleSubmit = async (id: string) => {
    if (text) {
      setLoading(true)

      if (isEdit) {
        await updateDoc(doc(db, 'posts', id, 'comments', currentComment), {
          text: text,
        })
      } else {
        // Add comment
        const commentRef = await addDoc(
          collection(db, 'posts', id, 'comments'),
          {
            id: session?.user?.uid,
            text: text,
            username: session?.user?.name,
            userImg: session?.user?.image,
            created_at: serverTimestamp(),
          }
        )

        // Prevent from sending notification if author commented his post
        if (session?.user.uid !== userId) {
          await addDoc(collection(db, 'users', userId, 'notifications'), {
            userId: session.user.uid,
            username: session.user.name,
            userImg: session.user.image,
            postId: id,
            commentId: commentRef.id,
            type: 'comment',
            created_at: serverTimestamp(),
          })
        }
      }
    }

    // Reset form
    handleResetForm()

    setLoading(false)
  }

  const handleResetForm = () => {
    setIsEdit(false)
    setText('')
    setCurrentComment('')
  }

  return (
    <>
      <form
        className={`flex items-center gap-2 mt-3 ${
          comments.length > 0 && 'mb-4'
        } mx-4`}
        onSubmit={(e: FormEvent) => {
          e.preventDefault()
          handleSubmit(postId)
        }}
      >
        {session.user.image && (
          <label htmlFor="commentInput">
            <img
              src={session.user.image}
              className="w-9 h-9 rounded-full cursor-pointer"
              alt="User avatar"
            />
          </label>
        )}

        <div className="relative flex-1">
          <input
            id="commentInput"
            disabled={loading}
            ref={inputRef}
            type="text"
            className="w-full text-sm bg-gray-200 dark:bg-gray-700 rounded-full 
            py-2 pl-3 pr-12 outline-none text-gray-700 dark:text-gray-200 
          placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder={`${t('writeComment')}...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="absolute top-0.5 right-2.5">
            <IconButton
              type={'button'}
              icon={
                <BsFillEmojiHeartEyesFill
                  className="relative w-8 h-8 p-1.5 text-2xl text-blue-500 rounded-full 
                  transition-all hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => setShowEmojis(!showEmojis)}
                />
              }
              tooltipText="Emojis"
            />
          </div>

          {showEmojis && (
            <div ref={emojisPickerRef}>
              <Picker
                onSelect={addEmojiToInput}
                theme={darkTheme ? 'dark' : 'light'}
                style={{
                  position: 'absolute',
                  top: '3rem',
                  right: 0,
                  maxWidth: 300,
                  borderRadius: 20,
                  zIndex: 30,
                }}
              />
            </div>
          )}
        </div>

        {isEdit && (
          <div
            className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
            onClick={() => handleResetForm()}
          >
            {t('cancel')}
          </div>
        )}
      </form>
      <div className="flex flex-col gap-4 mx-4">
        {comments.map((comment: any) => (
          <Comment
            key={comment.id}
            postId={postId}
            userId={userId}
            commentId={comment.id}
            comment={comment.data()}
            setText={setText}
            setIsEdit={setIsEdit}
            handleResetForm={handleResetForm}
            currentComment={currentComment}
            setCurrentComment={setCurrentComment}
          />
        ))}
      </div>
    </>
  )
}

export default CommentsSection
