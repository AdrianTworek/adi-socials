import { FC, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Moment from 'react-moment'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../../firebase'

import { Post as PostType } from '../../../types/post'
import { Comment } from '../../../types/comment'

import useFeedFormContext from '../../../context/posts/feed/Form'

import { BiLike } from 'react-icons/bi'
import { AiFillLike } from 'react-icons/ai'
import { BsFillTrashFill } from 'react-icons/bs'
import { MdEdit } from 'react-icons/md'
import { FaRegComment } from 'react-icons/fa'

import IconButton from '../IconButton'
import CommentsSection from './CommentsSection'
import Input from '../Input'
import EditPostModal from '../../EditPostModal'

interface Props {
  id: string
  postData: PostType
  postPage?: boolean
  userPage?: boolean
}

const Post: FC<Props> = ({ id, postData, postPage, userPage }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [likes, setLikes] = useState<any>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [showComments, setShowComments] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)

  const { data: session } = useSession()
  const {
    setText,
    setSelectedFile,
    isEdit,
    setIsEdit,
    currentPost,
    setCurrentPost,
  } = useFeedFormContext()

  const router = useRouter()
  const { t } = useTranslation('common')
  const isOwner = session.user.uid === postData.id

  useEffect(
    () =>
      onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  )

  useEffect(
    () =>
      setIsLiked(
        likes.findIndex((like: any) => like.id === session.user.uid) !== -1
      ),
    [likes]
  )

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', id, 'comments'),
          orderBy('created_at', 'desc')
        ),
        (snapshot: any) => setComments(snapshot.docs)
      ),
    [db, id]
  )

  const addLikeAndNotification = async () => {
    await setDoc(doc(db, 'posts', id, 'likes', session?.user.uid), {
      username: session?.user?.name,
    })

    // Prevent from sending notification if author liked his/her post
    if (session?.user.uid !== postData.id) {
      await addDoc(collection(db, 'users', postData.id, 'notifications'), {
        userId: session.user.uid,
        username: session.user.name,
        userImg: session.user.image,
        postId: id,
        type: 'like',
        created_at: serverTimestamp(),
      })
    }
  }

  const unlikeAndDeleteNotification = async () => {
    await deleteDoc(doc(db, 'posts', id, 'likes', session?.user.uid))
    const q = query(
      collection(db, 'users', postData.id, 'notifications'),
      where('userId', '==', session?.user.uid),
      where('postId', '==', id)
    )
    const notificationSnapshot = await getDocs(q)

    notificationSnapshot.forEach(async (el) => {
      if (el.data().type === 'like') {
        await deleteDoc(doc(db, 'users', postData.id, 'notifications', el.id))
      }
    })
  }

  const likePost = async () => {
    isLiked ? unlikeAndDeleteNotification() : addLikeAndNotification()
  }

  const fillFormData = () => {
    setIsEdit(true)
    setText(postData.text)
    setSelectedFile(postData.image)
    setCurrentPost(id)
  }

  const handleEditPost = () => {
    // Post from feed page
    if (!postPage && !userPage) {
      fillFormData()
      window.scrollTo(0, 0)
      return
    }

    // Post from UserDetailedPage or postPage
    setShowEditModal(true)
    setTimeout(() => {
      fillFormData()
    })
  }

  const handleDeletePost = async () => {
    if (isEdit && currentPost === id) {
      setIsEdit(false)
      setText('')
      setSelectedFile(undefined)
      setCurrentPost('')
    }
    await deleteDoc(doc(db, 'posts', id))

    // Refresh page if user deletes his post on the userDetail page
    if (userPage) window.location.reload()
  }

  return (
    <div className={`${userPage && 'max-w-[32rem]'} pt-1 pb-3`}>
      <div
        className="flex items-center gap-2 py-2 px-4 cursor-pointer"
        onClick={() => router.push(`/posts/${id}`)}
      >
        {postData?.userImg && (
          <img
            src={postData?.userImg}
            className="w-9 h-9 rounded-full cursor-pointer"
            alt="User avatar"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/users/${postData.id}`)
            }}
          />
        )}
        <div className="flex flex-col">
          <h3
            className="text-gray-700 dark:text-gray-200 font-medium hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/users/${postData.id}`)
            }}
          >
            {postData?.username}
          </h3>
          {postPage ? (
            <span className="text-[0.8rem] text-gray-500 dark:text-gray-400 font-regular">
              {String(
                new Date(
                  postData?.created_at?.seconds * 1000
                ).toLocaleDateString()
              )}
            </span>
          ) : (
            <>
              {postData?.created_at && (
                <span className="text-[0.8rem] text-gray-500 dark:text-gray-400 font-regular">
                  <Moment fromNow>
                    {postData?.created_at?.toDate() - 10000}
                  </Moment>
                </span>
              )}
            </>
          )}
        </div>

        {isOwner && (
          <div
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation()
              handleEditPost()
            }}
          >
            <IconButton
              icon={
                <MdEdit
                  className="relative w-8 h-8 p-1.5 text-xl text-gray-600 dark:text-gray-400 rounded-full transition-all
                hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                />
              }
              tooltipText={t('edit')}
            />
          </div>
        )}
      </div>

      <div className="px-5 mb-2 text-gray-700 dark:text-gray-200">
        {postData?.text}
      </div>

      {postData?.image && (
        <img
          src={postData.image}
          className="mt-4 mb-2 mx-auto w-full max-h-[35rem] object-contain cursor-pointer"
          alt="Post image"
          onClick={() => router.push(`/posts/${id}`)}
        />
      )}

      <div className="flex justify-between mx-5 my-3">
        {likes.length > 0 && (
          <div className="flex items-center gap-1">
            <AiFillLike className="text-xl p-1 bg-pink-500 text-gray-50 cursor-pointer rounded-full" />
            <span className="text-sm text-gray-700 dark:text-gray-400">
              {likes.length}
            </span>
          </div>
        )}

        {comments.length > 0 && (
          <div className="text-sm text-gray-700 dark:text-gray-400">
            {comments.length > 0 && (
              <>
                {comments.length === 1 ? (
                  <span
                    className="hover:underline cursor-pointer"
                    onClick={() => setShowComments(!showComments)}
                  >
                    1 {t('comment')}
                  </span>
                ) : (
                  <span
                    className="hover:underline cursor-pointer"
                    onClick={() => setShowComments(!showComments)}
                  >
                    {comments.length} {t('comments')}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div
        className={`flex items-center justify-around gap-2 py-2 border-t border-b border-gray-300 dark:border-gray-700 ${
          userPage && 'max-w-[32rem] justify-around'
        }`}
      >
        <button
          className="h-8 flex items-center gap-1 mx-2 md:mx-12 px-2 py-1 text-sm text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg"
          onClick={likePost}
        >
          <BiLike
            className={`text-2xl cursor-pointer ${isLiked && 'text-pink-500'}`}
          />{' '}
          {isLiked ? 'Unlike' : 'Like'}
        </button>

        <button
          className="h-8 flex items-center gap-1.5 mx-2 md:mx-12 px-2 py-1 text-sm text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg"
          onClick={() => setShowComments(!showComments)}
        >
          <FaRegComment className="text-xl cursor-pointer" /> {t('toComment')}
        </button>

        {/* Enables user to delete his post only on the feed and userDetailed page */}
        {((isOwner && !postPage) || (userPage && isOwner)) && (
          <button
            className="h-8 flex items-center gap-1 mx-2 md:mx-12 px-2 py-1 text-sm text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg"
            onClick={handleDeletePost}
          >
            <BsFillTrashFill className="text-lg cursor-pointer" /> {t('delete')}
          </button>
        )}
      </div>

      {showComments && (
        <CommentsSection userId={postData.id} postId={id} comments={comments} />
      )}

      {showEditModal && (
        <EditPostModal
          userPage={userPage}
          postPage={postPage}
          setShowEditModal={setShowEditModal}
        />
      )}
    </div>
  )
}

export default Post
