import { FC, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { deleteField, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

interface Props {
  bio?: string
}

const Intro: FC<Props> = ({ bio }) => {
  const [showTextarea, setShowTextarea] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [charsRemaining, setCharsRemaining] = useState<number>(100)
  const [bioText, setBioText] = useState<string | undefined>(bio)

  const { data: session } = useSession()

  const textRef = useRef<HTMLTextAreaElement>(null)

  const router = useRouter()
  const { t } = useTranslation('common')

  // Update bioText if user change the page without server-side rendering
  useEffect(() => {
    setBioText(bio)
  }, [bio])

  useEffect(() => {
    setCharsRemaining(100 - input.length)
  }, [input])

  useEffect(() => {
    if (textRef.current) {
      textRef.current.focus()

      if (bioText) {
        textRef.current.selectionStart = bioText.length
      }
    }
  }, [showTextarea])

  const handleSave = async () => {
    if (input === bioText) {
      handleResetFields()
      return
    }

    await updateDoc(doc(db, 'users', session.user.uid), {
      bio: input.trim(),
    })

    handleResetFields()
  }

  const handleDelete = async () => {
    await updateDoc(doc(db, 'users', session.user.uid), {
      bio: deleteField(),
    })

    handleResetFields()
  }

  const handleResetFields = () => {
    setBioText(input)
    setShowTextarea(false)
    setInput('')
  }

  return (
    <div className="bg-white dark:bg-slate-800 mx-auto lg:mx-0 my-4 p-3 rounded-md shadow-sm">
      <h3 className="text-xl text-gray-800 dark:text-gray-100 font-semibold">
        Intro
      </h3>

      <h4 className="text-lg text-gray-600 dark:text-gray-300 my-2 text-center">
        {bioText}
      </h4>

      {session.user.uid === router.query.userId && (
        <>
          {showTextarea ? (
            <div className="flex flex-col items-center gap-1">
              <textarea
                ref={textRef}
                rows={3}
                placeholder={t('describeWhoYouAre')}
                className="w-full bg-gray-300 text-gray-700 dark:bg-slate-500 text-center py-2 mt-3 rounded-lg placeholder:text-gray-700 dark:placeholder:text-gray-200 dark:text-gray-50 font-semibold
                  outline-none border border-transparent focus:border-indigo-600 hover:bg-gray-200 dark:hover:bg-slate-400 dark:focus:bg-slate-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>

              <span className="ml-auto text-sm dark:text-gray-200">
                {charsRemaining} {t('charactersRemaining')}
              </span>

              <div className="flex gap-1 ml-auto mt-1">
                <button
                  className="bg-gray-300 dark:bg-slate-500 text-gray-700 dark:text-gray-50 rounded-lg font-semibold px-3 py-1 transition-all hover:bg-gray-400 dark:hover:bg-slate-400"
                  onClick={() => {
                    setShowTextarea(false)
                    setInput('')
                  }}
                >
                  {t('cancel')}
                </button>
                <button
                  className="bg-gray-300 dark:bg-slate-500 text-gray-700 dark:text-gray-50 rounded-lg font-semibold px-3 py-1 disabled:bg-gray-200 dark:disabled:bg-slate-600 disabled:text-gray-400 dark:disabled:text-gray-400 transition-all hover:bg-gray-400 dark:hover:bg-slate-400"
                  disabled={charsRemaining < 0 || !input}
                  onClick={handleSave}
                >
                  {t('save')}
                </button>

                {bioText && input.length === 0 && (
                  <button
                    className="bg-red-700 text-gray-200 rounded-lg font-semibold px-3 py-1 transition-all hover:bg-red-600"
                    onClick={handleDelete}
                  >
                    {t('delete')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              className="w-full font-medium bg-gray-200 dark:bg-slate-500 dark:text-gray-50 mt-3 py-1 rounded-md
              transition-all hover:bg-gray-300 dark:hover:bg-slate-400"
              onClick={() => {
                if (bioText) {
                  setInput(bioText)
                }
                setShowTextarea(true)
              }}
            >
              {bioText ? t('editBio') : t('addBio')}
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Intro
