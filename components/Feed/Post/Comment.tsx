import {
  FC,
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../../../firebase'

import { Comment } from '../../../types/comment'

import useOnClickOutside from '../../../hooks/useOnClickOutside'

import { BsThreeDots } from 'react-icons/bs'

interface Props {
  postId: string
  userId: string
  comment: Comment
  commentId: string
  currentComment: string
  setCurrentComment: Dispatch<SetStateAction<string>>
  setIsEdit: Dispatch<SetStateAction<boolean>>
  setText: Dispatch<SetStateAction<string>>
  handleResetForm: Function
}

const Comment: FC<Props> = ({
  postId,
  userId,
  comment,
  commentId,
  currentComment,
  setCurrentComment,
  setIsEdit,
  setText,
  handleResetForm,
}) => {
  const [isLongComment, setIsLongComment] = useState<boolean>(
    comment.text.length > 200
  )
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024)
  const modalRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(
    modalRef,
    useCallback(() => setShowModal(false), [showModal])
  )

  const { data: session } = useSession()

  const router = useRouter()
  const { t } = useTranslation('common')
  const isPostOwner = session.user.uid === userId
  const isCommentOwner = session.user.uid === comment.id

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }

    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  const handleClickEditComment = (comment: Comment) => {
    if (currentComment === commentId) {
      setShowModal(false)
      return
    }

    setShowModal(false)
    setIsEdit(true)
    setCurrentComment(commentId)
    setText(comment.text)
  }

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (currentComment === commentId) {
      handleResetForm()
    }

    await deleteDoc(doc(db, 'posts', postId, 'comments', commentId))

    const q = query(
      collection(db, 'users', userId, 'notifications'),
      where('userId', '==', session.user.uid),
      where('postId', '==', postId),
      where('commentId', '==', commentId)
    )
    const notificationSnapshot = await getDocs(q)

    notificationSnapshot.forEach(async (el: any) => {
      if (el.data().commentId === commentId) {
        await deleteDoc(doc(db, 'users', userId, 'notifications', el.id))
      }
    })
  }

  return (
    <div className="relative group flex gap-3 mb-4">
      {comment.userImg && (
        <img
          src={comment.userImg}
          className="w-9 h-9 rounded-full cursor-pointer"
          alt="User avatar"
          onClick={() => router.push(`/users/${comment.id}`)}
        />
      )}

      <div
        className="relative px-3 max-w-[70%] py-1 rounded-xl text-gray-800 
                dark:text-gray-50 bg-gray-200 dark:bg-gray-700"
      >
        <span
          className="text-[0.8rem] font-medium hover:underline cursor-pointer"
          onClick={() => router.push(`/users/${comment.id}`)}
        >
          {comment.username}
        </span>

        {!isLongComment ? (
          <p className="max-w-[18rem] sm:max-w-max break-words">
            {comment.text}
          </p>
        ) : (
          <p className="max-w-[18rem] sm:max-w-max break-words">
            {comment.text.slice(0, 200)}...
          </p>
        )}

        {isLongComment && (
          <span
            className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
            onClick={() => setIsLongComment(false)}
          >
            {t('seeMore')}
          </span>
        )}

        {(isCommentOwner || isPostOwner) && (
          <div
            ref={modalRef}
            className="absolute top-[50%] translate-y-[-50%] -right-8 z-10"
          >
            <div
              className={`relative z-1 items-center flex ${
                isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } justify-center w-7 h-7 hover:bg-gray-200 dark:hover:bg-gray-600 
               rounded-full cursor-pointer`}
              onClick={() => setShowModal(!showModal)}
            >
              <BsThreeDots className="text-gray-700 dark:text-gray-300" />
            </div>

            {showModal && (
              <div
                className="min-w-max absolute top-8 right-0 flex flex-col
                        bg-gray-300 dark:bg-gray-900 p-2 rounded-lg shadow"
              >
                {isCommentOwner && (
                  <div
                    className="px-1 py-1 bg-gray-300 dark:bg-gray-900 text-gray-600 dark:text-gray-200 
                            text-md font-medium transition-all hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleClickEditComment(comment)}
                  >
                    {t('editComment')}
                  </div>
                )}

                <div
                  className="px-1 py-1 bg-gray-300 dark:bg-gray-900 text-gray-600 dark:text-gray-200 
                            text-md font-medium transition-all hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => {
                    handleDeleteComment(postId, commentId)
                    setShowModal(false)
                  }}
                >
                  {t('deleteComment')}
                </div>
              </div>
            )}
          </div>
        )}

        {comment?.created_at && (
          <p className="absolute -bottom-5 min-w-[12rem] text-[0.8rem] text-slate-600 dark:text-slate-400">
            {new Date(comment.created_at.seconds * 1000).toLocaleDateString()}{' '}
            {new Date(comment.created_at.seconds * 1000)
              .toLocaleTimeString()
              .slice(0, 5)}
          </p>
        )}
      </div>
    </div>
  )
}

export default Comment
