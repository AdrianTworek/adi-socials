import { FC, useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { db, storage } from '../../firebase'
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  deleteField,
} from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

import useOnClickOutside from '../../hooks/useOnClickOutside'

import useFeedFormContext from '../../context/posts/feed/Form'
import useDarkThemeContext from '../../context/settings/DarkTheme'

import { HiOutlinePhotograph } from 'react-icons/hi'
import { RiCloseFill } from 'react-icons/ri'
import { BsFillEmojiHeartEyesFill } from 'react-icons/bs'

import IconButton from './IconButton'

import addImage from '../../utils/addImage'

interface Props {
  userPage?: boolean
  postPage?: boolean
}

const Input: FC<Props> = ({ userPage, postPage }) => {
  const [showEmojis, setShowEmojis] = useState<boolean>(false)
  const emojisPickerRef = useRef<any>(null)
  useOnClickOutside(
    emojisPickerRef,
    useCallback(() => setTimeout(() => setShowEmojis(false)), [showEmojis])
  )

  const { data: session } = useSession()
  const {
    text,
    setText,
    selectedFile,
    setSelectedFile,
    loading,
    setLoading,
    currentPost,
    setCurrentPost,
    isEdit,
    setIsEdit,
  } = useFeedFormContext()
  const { darkTheme } = useDarkThemeContext()

  const router = useRouter()
  const { t } = useTranslation('common')

  const filePickerRef = useRef<HTMLInputElement>(null)

  // Cancel input data when unmounting
  useEffect(() => handleCancelEdit(), [router])

  const addEmojiToInput = (e: any) => {
    let sym = e.unified.split('-')
    let codesArr: any[] = []

    sym.forEach((el: any) => codesArr.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArr)

    setText(text + emoji)
  }

  const handleCancelEdit = () => {
    setIsEdit(false)
    setText('')
    setSelectedFile(undefined)
    setCurrentPost('')
  }

  const addPost = async () => {
    const docRef = await addDoc(collection(db, 'posts'), {
      id: session?.user?.uid,
      text,
      username: session?.user?.name,
      userImg: session?.user?.image,
      created_at: serverTimestamp(),
    })

    if (selectedFile) {
      const imgRef = ref(storage, `posts/${docRef.id}/image`)

      await uploadString(imgRef, selectedFile, 'data_url').then(async () => {
        const downloadUrl = await getDownloadURL(imgRef)
        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadUrl,
        })
      })
    }
  }

  const updatePost = async () => {
    // Update only post text if user has not changed existing image
    if (selectedFile?.startsWith('https://firebasestorage')) {
      await updateDoc(doc(db, 'posts', currentPost), {
        text: text?.trim(),
      })
    }

    // Clear image field if user wants to delete current post image
    else if (!selectedFile) {
      await updateDoc(doc(db, 'posts', currentPost), {
        text: text?.trim(),
        image: deleteField(),
      })
    }

    // Update both text and image (second condition checks whether user chose new image from his device)
    else if (
      selectedFile &&
      !selectedFile.startsWith('https://firebasestorage')
    ) {
      const imgRef = ref(storage, `posts/${currentPost}/image`)

      await uploadString(imgRef, selectedFile, 'data_url').then(async () => {
        const downloadUrl = await getDownloadURL(imgRef)
        await updateDoc(doc(db, 'posts', currentPost), {
          text: text?.trim(),
          image: downloadUrl,
        })
      })
    }

    // Refresh page if user is not on the feed
    if (userPage || postPage) {
      window.location.reload()
    }
  }

  const handleSubmit = async () => {
    if (loading) return

    setLoading(true)
    setShowEmojis(false)
    setText('')
    setSelectedFile(undefined)
    setCurrentPost('')
    setIsEdit(false)

    if (isEdit) {
      await updatePost()
    } else {
      await addPost()
    }

    setLoading(false)
  }

  return (
    <>
      <div className="flex gap-3 mb-2">
        {session.user.image && (
          <img
            src={session.user.image}
            className="w-9 h-9 rounded-full cursor-pointer hover:brightness-90 transition-all"
            alt="User avatar"
            onClick={() => router.push(`/users/${session.user.uid}`)}
          />
        )}
        <textarea
          placeholder={`${t('whatsOnYourMind')}, ${
            session.user.name.split(' ')[0]
          }?`}
          value={text}
          disabled={loading}
          onChange={(e) => setText(e.target.value)}
          className={`w-full min-h-[3.5rem] tracking-wide bg-transparent outline-none text-lg
        text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400
          pb-2 border-b-2 border-gray-300 dark:border-gray-700`}
        />
      </div>

      {selectedFile && !loading && (
        <div className="relative pl-12 py-3">
          <img
            src={selectedFile}
            alt="Your selected image"
            className="relative rounded-2xl max-h-80 object-contain"
          />
          <button
            className="absolute top-6 left-16 flex items-center justify-center w-8 h-8 rounded-full
            cursor-pointer bg-gray-400 dark:bg-gray-700"
            onClick={() => setSelectedFile(undefined)}
          >
            <RiCloseFill className="text-xl text-gray-800 dark:text-gray-200" />
          </button>
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex gap-1 items-center pl-12">
          <div onClick={() => filePickerRef.current.click()}>
            <input
              type="file"
              ref={filePickerRef}
              accept="image/*"
              hidden
              onChange={(e) => addImage(e, setSelectedFile)}
              onClick={(e: any) => (e.target.value = null)}
            />
            <IconButton
              type="button"
              icon={
                <HiOutlinePhotograph
                  className="relative w-8 h-8 p-1.5 text-2xl text-green-500 rounded-full transition-all
                hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                />
              }
              tooltipText={t('photo')}
            />
          </div>

          <div onClick={() => setShowEmojis(!showEmojis)}>
            <IconButton
              type="button"
              icon={
                <BsFillEmojiHeartEyesFill
                  className="relative w-8 h-8 p-1.5 text-2xl text-blue-500 
                  rounded-full transition-all hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                />
              }
              tooltipText="Emojis"
            />
          </div>

          {showEmojis && (
            <div className="relative" ref={emojisPickerRef}>
              <Picker
                onSelect={addEmojiToInput}
                theme={darkTheme ? 'dark' : 'light'}
                style={{
                  position: 'absolute',
                  top: 30,
                  left: '-7rem',
                  maxWidth: 300,
                  borderRadius: 20,
                  zIndex: 30,
                }}
              />
            </div>
          )}
        </div>

        <div className="ml-auto">
          {isEdit && !userPage && !postPage && (
            <button
              className="px-4 md:px-6 py-1.5 text-gray-500 dark:text-gray-200 font-medium bg-transparent border border-pink-400
              disabled:opacity-50 rounded-full cursor-pointer shadow-sm hover:opacity-80 transition-all"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              {t('cancel')}
            </button>
          )}

          <button
            className="ml-2 px-4 md:px-6 py-1.5 text-gray-200 font-medium bg-gradient-to-br from-red-500 to-indigo-400 
          disabled:opacity-50 rounded-full cursor-pointer shadow-sm hover:opacity-80 transition-all"
            onClick={handleSubmit}
            disabled={(!text.trim() && !selectedFile) || loading}
          >
            {isEdit ? t('edit') : t('post')}
          </button>
        </div>
      </div>
    </>
  )
}

export default Input
