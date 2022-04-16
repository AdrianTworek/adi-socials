import { FC } from 'react'
import Moment from 'react-moment'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { db } from '../../../firebase'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'

import { Notification } from '../../../types/notification'

import useNotificationsContext from '../../../context/header/Notifications'

import { BsPersonFill, BsFillTrashFill } from 'react-icons/bs'
import { ImSpinner8 } from 'react-icons/im'
import { MdAddComment } from 'react-icons/md'
import { AiFillLike } from 'react-icons/ai'

import Dropdown from '../../../hoc/Dropdown'

const NotificationsDropdown: FC = () => {
  const { data: session } = useSession()
  const { notifications, loading } = useNotificationsContext()
  const { t } = useTranslation()

  const router = useRouter()

  const handleConfirmNotification = async (request: Notification) => {
    await Promise.all([
      // Add user who sent this notification to the friends
      setDoc(doc(db, 'users', session.user.uid, 'friends', request.id), {
        username: request.username,
        userImg: request.userImg,
      }),
      // Add current logged user to the friends of the user who sent this notification
      setDoc(doc(db, 'users', request.id, 'friends', session.user.uid), {
        username: session.user.name,
        userImg: session.user.image,
      }),
    ])

    // Remove notification
    handleDeleteFriendRequest(request)
  }

  const handleDeleteFriendRequest = async (request: Notification) =>
    await deleteDoc(
      doc(db, 'users', session.user.uid, 'notifications', request.id)
    )

  const handleDeleteNotification = async (notificationId: string) =>
    await deleteDoc(
      doc(db, 'users', session.user.uid, 'notifications', notificationId)
    )

  return (
    <ul className="min-w-[18rem] flex flex-col mt-3 text-gray-700 dark:text-gray-200 text-md font-medium rounded-md">
      {loading ? (
        <ImSpinner8 className="mt-3 mx-auto text-indigo-500 text-3xl animate-spin" />
      ) : (
        <>
          {!notifications.length ? (
            <span className="pl-2 text-gray-400 dark:text-gray-500">
              {t('noNotifications')}
            </span>
          ) : (
            <>
              {notifications.map((notification: Notification) => (
                <li
                  key={notification.id}
                  className="relative flex items-center gap-2 px-2 py-3.5 transition-all hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                  onClick={() =>
                    notification.type === 'friend_request'
                      ? router.push(`/users/${notification.id}`)
                      : router.push(`/posts/${notification.postId}`)
                  }
                >
                  <div className="relative self-start">
                    {session.user.image && (
                      <>
                        <img
                          src={notification.userImg}
                          alt="request image"
                          className="w-12 h-12 rounded-full"
                        />
                        <div
                          className={`absolute -bottom-1 -right-0.5 ${
                            notification.type === 'comment'
                              ? 'bg-green-600'
                              : 'bg-indigo-600'
                          } rounded-full`}
                        >
                          {notification.type === 'friend_request' && (
                            <BsPersonFill className="text-3xl p-1.5 text-gray-200" />
                          )}
                          {notification.type === 'like' && (
                            <AiFillLike className="text-2xl p-1.5 text-gray-200" />
                          )}
                          {notification.type === 'comment' && (
                            <MdAddComment className="text-2xl p-1.5 text-gray-200" />
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="leading-5 max-w-[12rem] flex flex-col gap-1 text-gray-700 dark:text-gray-300">
                    <div>
                      <span className="text-gray-800 dark:text-gray-100 font-bold">
                        {notification.username}
                      </span>{' '}
                      {notification.type === 'friend_request' &&
                        t('sentYouFriendRequest')}
                      {notification.type === 'like' && t('likedYourPost')}
                      {notification.type === 'comment' &&
                        t('addedCommentToYourPost')}
                    </div>

                    <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                      <Moment fromNow>
                        {notification?.created_at?.toDate() - 10000}
                      </Moment>
                    </span>

                    {notification.type === 'friend_request' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          className="text-md font-medium px-4 py-2 bg-indigo-600 rounded-md text-gray-200
                    cursor-pointer"
                          onClick={() =>
                            handleConfirmNotification(notification)
                          }
                        >
                          {t('confirm')}
                        </button>
                        <button
                          className="text-md font-medium px-3 py-1 bg-gray-600 rounded-md text-gray-200
                    cursor-pointer"
                          onClick={() =>
                            handleDeleteFriendRequest(notification)
                          }
                        >
                          {t('remove')}
                        </button>
                      </div>
                    )}
                  </div>

                  {notification.type === 'friend_request' && (
                    <div className="w-3 h-3 ml-3 bg-indigo-500 rounded-full"></div>
                  )}

                  {notification.type !== 'friend_request' && (
                    <div
                      className="group absolute right-2 p-3 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNotification(notification.id)
                      }}
                    >
                      <BsFillTrashFill className="group-hover:text-gray-100 dark:text-gray-100" />
                    </div>
                  )}
                </li>
              ))}
            </>
          )}
        </>
      )}
    </ul>
  )
}

export default Dropdown(NotificationsDropdown)
