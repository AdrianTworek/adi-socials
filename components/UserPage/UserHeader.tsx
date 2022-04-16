import { FC, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Session } from 'next-auth'
import { useTranslation } from 'next-i18next'
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from '../../firebase'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'

import { Friend } from '../../types/friends'

import addImage from '../../utils/addImage'

import useChatContext from '../../context/chat/Chat'

import { AiFillCamera, AiOutlineUserDelete } from 'react-icons/ai'
import { ImSpinner8 } from 'react-icons/im'
import { BsFillChatDotsFill, BsFillPersonPlusFill } from 'react-icons/bs'
import { RiCloseFill } from 'react-icons/ri'

import IconButton from '../Feed/IconButton'

interface Props {
  user: any
  userId: string
  session: Session
  friends: Friend[]
  friendsNumber: number
  isMyRequestSent: boolean
  isSomeoneRequestSent: boolean
  isFriend: boolean
}

const UserHeader: FC<Props> = ({
  user,
  userId,
  session,
  friends,
  friendsNumber,
  isMyRequestSent,
  isSomeoneRequestSent,
  isFriend,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [addFriend, setAddFriend] = useState<boolean>(!isFriend)
  // Request of the current logged in user
  const [isMyRequest, setIsMyRequest] = useState<boolean>(isMyRequestSent)
  // Request of the user from the current page
  const [isSomeoneRequest, _] = useState<boolean>(isSomeoneRequestSent)
  const [selectedFile, setSelectedFile] = useState<string | undefined>(
    undefined
  )
  const [userImg, setUserImg] = useState<string | undefined>(
    user.image || undefined
  )

  const { setShowChat, setChatData } = useChatContext()

  const filePickerRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const { t } = useTranslation('common')

  useEffect(() => {
    setUserImg(user.image)
  }, [user])

  // Set friendStatus when user change UI without firing getServerSideProps again
  useEffect(() => {
    setAddFriend(!isFriend)
  }, [router.query, isFriend])

  const handleUpdateImage = async () => {
    if (selectedFile) {
      setLoading(true)

      const imgRef = ref(storage, `users/${userId}/image`)

      await uploadString(imgRef, selectedFile, 'data_url').then(async () => {
        const downloadUrl = await getDownloadURL(imgRef)
        await updateDoc(doc(db, 'users', userId), {
          image: downloadUrl,
        })
      })

      setUserImg(selectedFile)
      setSelectedFile(undefined)
      setLoading(false)
      window.location.reload()
    }
  }

  const cancelFriendRequest = async () => {
    setLoading(true)
    await deleteDoc(doc(db, 'users', userId, 'notifications', session.user.uid))
    setIsMyRequest(false)
    setAddFriend(true)
    setLoading(false)
  }

  const handleFriendButton = async () => {
    setLoading(true)

    if (isMyRequest) {
      cancelFriendRequest()
      return
    }

    if (addFriend) {
      // Send friend request
      await setDoc(
        doc(db, 'users', userId, 'notifications', session.user.uid),
        {
          username: session.user.name,
          userImg: session.user.image,
          type: 'friend_request',
          created_at: serverTimestamp(),
        }
      )

      setAddFriend(false)
      setIsMyRequest(true)
    } else {
      // Delete a friend
      await Promise.all([
        deleteDoc(doc(db, 'users', userId, 'friends', session.user.uid)),
        deleteDoc(doc(db, 'users', session.user.uid, 'friends', userId)),
      ])

      setAddFriend(true)
    }

    setLoading(false)
  }

  const handleChatWindow = () => {
    setShowChat(true)
    setChatData({
      id: userId,
      userImg: user.image,
      username: user.name,
    })
  }

  return (
    <div
      className="flex flex-col md:flex-row md:max-w-[60rem] items-center gap-2 md:gap-4 mt-12 mx-4 md:mx-auto
      px-6 pb-4 border-b border-gray-300 dark:border-gray-800"
    >
      {user?.image && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={selectedFile || userImg}
              className="w-32 h-32 rounded-full border-2 border-gray-400  dark:border-gray-700 cursor-pointer hover:brightness-90 transition-all"
              alt="User avatar"
            />

            {session.user.uid === router.query.userId && (
              <div
                className="absolute right-0 bottom-0"
                onClick={() => filePickerRef.current.click()}
              >
                <input
                  type="file"
                  ref={filePickerRef}
                  accept="image/*"
                  hidden
                  onChange={(e) => addImage(e, setSelectedFile)}
                  onClick={(e: any) => (e.target.value = null)}
                />
                <IconButton
                  icon={
                    <AiFillCamera className="text-3xl text-gray-800 dark:text-gray-50 p-[0.3rem] bg-gray-300 dark:bg-gray-700 rounded-full hover:brightness-125 transition-all" />
                  }
                  tooltipText={t('updatePicture')}
                />
              </div>
            )}
          </div>

          {selectedFile && (
            <>
              {loading ? (
                <ImSpinner8 className="mt-3 text-indigo-500 text-2xl animate-spin" />
              ) : (
                <div className="flex gap-2 mt-3">
                  <button
                    className="bg-gray-50 dark:bg-slate-500 dark:text-gray-50 px-3 py-1 rounded-md
                transition-all hover:bg-gray-100 dark:hover:bg-slate-400 font-medium"
                    disabled={loading}
                    onClick={() => setSelectedFile(undefined)}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    className="bg-pink-600 text-gray-50 px-3 py-1 rounded-md
                transition-all hover:bg-pink-500 font-medium"
                    disabled={loading}
                    onClick={handleUpdateImage}
                  >
                    {t('save')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex flex-col items-center md:items-start">
        <h2 className="text-3xl text-gray-800 dark:text-gray-50 font-semibold mt-3">
          {user.name}
        </h2>

        <span className="text-md font-medium text-gray-500">
          {friendsNumber}{' '}
          {friendsNumber === 1 ? t('friend') : t('friendsQuantity')}
        </span>

        <div className="flex justify-center -space-x-1.5 mt-1">
          {friends?.map((friend: Friend) => (
            <img
              key={friend.id}
              src={friend?.userImg}
              className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-slate-800 cursor-pointer"
              onClick={() => router.push(`/users/${friend.id}`)}
            />
          ))}
        </div>
      </div>

      {session.user.uid !== router.query.userId && (
        <div className="flex gap-2 mt-3 md:ml-auto md:mt-auto">
          <button
            className="flex gap-2 font-semibold items-center bg-blue-500 text-gray-50 py-2 px-4 rounded-md cursor-pointer hover:brightness-125 transition-all"
            onClick={handleFriendButton}
            disabled={loading}
          >
            {/* 1) No request - default button */}
            {addFriend && !isMyRequest && !isSomeoneRequest && (
              <span className="flex items-center gap-1 font-semibold">
                {loading ? (
                  <ImSpinner8 className="mr-1 text-gray-50 text-sm animate-spin" />
                ) : (
                  <BsFillPersonPlusFill />
                )}
                {t('addFriend')}
              </span>
            )}

            {/* 2) If request was sent */}
            {isMyRequest && (
              <span className="flex items-center gap-1 font-semibold">
                {loading ? (
                  <ImSpinner8 className="mr-1 text-gray-50 text-sm animate-spin" />
                ) : (
                  <RiCloseFill className="text-lg" />
                )}
                {t('cancelRequest')}
              </span>
            )}

            {/* 3) If they're already friends */}
            {!addFriend && !isMyRequest && (
              <span className="flex items-center gap-1 font-semibold">
                {loading ? (
                  <ImSpinner8 className="mr-1 text-gray-50 text-sm animate-spin" />
                ) : (
                  <AiOutlineUserDelete className="text-2xl" />
                )}
                {t('deleteFriend')}
              </span>
            )}
          </button>
          <button
            className="flex gap-1 font-semibold items-center bg-pink-500 text-gray-50 py-2 px-4 rounded-md cursor-pointer hover:brightness-125 transition-all"
            onClick={handleChatWindow}
          >
            <BsFillChatDotsFill /> {t('message')}
          </button>
        </div>
      )}
    </div>
  )
}

export default UserHeader
