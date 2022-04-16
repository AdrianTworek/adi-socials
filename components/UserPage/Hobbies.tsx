import { FC, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { deleteField, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

import { User } from '../../types/user'

import hobbiesData, { iconsMap } from '../../utils/hobbiesData'

interface Props {
  user: User
}

const Hobbies: FC<Props> = ({ user }) => {
  const [showHobbies, setShowHobbies] = useState<boolean>(false)
  const [hobbies, setHobbies] = useState<string[]>([])

  const { data: session } = useSession()

  const router = useRouter()
  const { t } = useTranslation('common')

  const isOwner = session.user.uid === router.query.userId

  useEffect(() => {
    setHobbies(user?.hobbies || [])
    setShowHobbies(false)
  }, [user])

  const handleClickHobby = (hobby: string) => {
    if (hobbies.includes(hobby)) {
      setHobbies(hobbies.filter((el) => el !== hobby))
      return
    }

    setHobbies([...hobbies, hobby])
  }

  const handleSave = async () => {
    await updateDoc(doc(db, 'users', session.user.uid), {
      hobbies,
    })

    setShowHobbies(false)
  }

  const handleDelete = async () => {
    await updateDoc(doc(db, 'users', session.user.uid), {
      hobbies: deleteField(),
    })

    setHobbies([])
  }

  return (
    <div className="w-full max-w-[31.25rem] lg:max-w-[25rem] bg-white dark:bg-slate-800 mx-auto lg:mx-0 my-4 p-3 rounded-md shadow-sm">
      <h3 className="text-xl text-gray-800 dark:text-gray-100 font-semibold">
        {t('hobbies')}
      </h3>

      {!showHobbies && (
        <div className="flex flex-wrap gap-1 mt-3">
          {hobbies.map((hobby: string, idx: number) => (
            <div
              key={`${hobby}-${idx}`}
              className="text-sm flex gap-2 items-center text-gray-800 dark:text-gray-200 font-semibold py-1 px-4 
            border border-gray-300 dark:border-slate-600 rounded-full"
            >
              {/* @ts-ignore */}
              {iconsMap[hobby]} {t(hobby)}
            </div>
          ))}
        </div>
      )}

      {isOwner && (
        <>
          {showHobbies ? (
            <>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 uppercase mt-2 text-center">
                {t('recommendedHobbies')}
              </h3>

              <div className="flex flex-wrap justify-center gap-1 mt-3">
                {hobbiesData.map((hobby, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 items-center text-gray-800 dark:text-gray-200 font-semibold py-1 px-4 
                border border-gray-300 dark:border-slate-700 rounded-full transition-all cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 ${
                  hobbies.includes(hobby.text) &&
                  'bg-indigo-500 text-gray-200 hover:bg-indigo-500 dark:hover:bg-indigo-500'
                }`}
                    onClick={() => handleClickHobby(hobby.text)}
                  >
                    {hobby.icon && hobby.icon} {t(hobby.text)}
                  </div>
                ))}
              </div>

              <button
                className="w-full font-medium bg-gray-200 dark:bg-slate-500 dark:text-gray-50 mt-5 py-1 rounded-md
              transition-all hover:bg-gray-300 dark:hover:bg-slate-400"
                onClick={() => setShowHobbies(false)}
              >
                {t('cancel')}
              </button>

              {hobbies.length > 0 && (
                <button
                  className="w-full font-medium text-gray-200 bg-indigo-600  mt-3 py-1 rounded-md
              transition-all hover:bg-indigo-500"
                  onClick={handleSave}
                >
                  {t('save')}
                </button>
              )}
            </>
          ) : (
            <>
              <button
                className="bg-red-600 text-gray-200 mt-5 rounded-lg font-semibold px-3 py-1 transition-all hover:bg-red-700 cursor-pointer disabled:bg-red-900 disabled:text-gray-400"
                onClick={handleDelete}
                disabled={hobbies.length === 0}
              >
                {t('deleteHobbies')}
              </button>

              <button
                className="w-full font-medium bg-gray-200 dark:bg-slate-500 dark:text-gray-50 mt-2 py-1 rounded-md
              transition-all hover:bg-gray-300 dark:hover:bg-slate-400"
                onClick={() => setShowHobbies(true)}
              >
                {t('addHobbies')}
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Hobbies
