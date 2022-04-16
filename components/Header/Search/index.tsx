import { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase'

import { User } from '../../../types/user'

import { AiOutlineSearch } from 'react-icons/ai'
import { RiCloseFill } from 'react-icons/ri'
import { ImSpinner8 } from 'react-icons/im'

import useDebounce from '../../../hooks/useDebounce'
import useOnClickOutside from '../../../hooks/useOnClickOutside'

import Results from './Results'

const Search: FC = () => {
  const [results, setResults] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showInput, setShowInput] = useState<boolean>(false)
  const [showResults, setShowResults] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const debouncedTerm = useDebounce(searchTerm, 350)
  const { t } = useTranslation('common')

  const mobileRef = useRef()
  const desktopRef = useRef()
  const desktopInputRef = useRef()

  const clearData = () => {
    setSearchTerm('')
    setShowInput(false)
    setShowResults(false)
  }

  useOnClickOutside(mobileRef, () => clearData())
  useOnClickOutside(desktopRef, (e: any) => {
    if (e.target !== desktopInputRef?.current) {
      clearData()
    }
  })

  useEffect(() => {
    const getResults = async () => {
      setLoading(true)

      const users = await getDocs(collection(db, 'users'))
      const filteredUsers: User[] = []
      users.forEach((doc) => {
        if (
          doc.data().name.toLowerCase().includes(debouncedTerm.toLowerCase())
        ) {
          filteredUsers.push({ id: doc.id, ...doc.data() })
        }
      })

      setResults(filteredUsers)
      setLoading(false)
    }

    if (debouncedTerm) getResults()
  }, [debouncedTerm])

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 1280) setShowResults(false)
    }

    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return (
    <>
      <div
        className="flex xl:hidden justify-center items-center w-8 h-8 
        bg-gray-50 dark:bg-gray-800 rounded-full"
        onClick={() => setShowInput(true)}
      >
        <AiOutlineSearch className="text-lg text-gray-800 dark:text-gray-400" />
      </div>

      <div className="relative flex items-center">
        <label
          htmlFor="search-header"
          className="hidden xl:block absolute left-2"
        >
          <AiOutlineSearch className="text-lg text-gray-500 dark:text-gray-300" />
        </label>
        <input
          ref={desktopInputRef}
          type="text"
          id="search-header"
          placeholder={`${t('searchPlaceholder')} adiSocials`}
          className="hidden xl:block text-sm bg-gray-300 dark:bg-gray-700 rounded-full 
          py-2 pl-8 pr-4 outline-none text-gray-700 dark:text-gray-300 
          placeholder:text-gray-500 dark:placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => {
            if (e.target.value) {
              setShowResults(true)
            } else {
              setShowResults(false)
            }
            setSearchTerm(e.target.value)
          }}
        />
      </div>

      {showInput && (
        <div
          ref={mobileRef}
          className="fixed left-0 top-0 pt-1 pb-3 px-4 bg-gray-50 dark:bg-gray-900 z-40 shadow-sm shadow-gray-700 rounded-md rounded-l-none"
        >
          <div className="flex items-center gap-2 h-[49px]">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full
              cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700"
              onClick={() => {
                setSearchTerm('')
                setShowInput(false)
              }}
            >
              <RiCloseFill className="text-xl text-gray-800 dark:text-gray-200" />
            </button>
            <input
              type="text"
              placeholder={`${t('searchPlaceholder')} adiSocials`}
              className="inline-block text-sm bg-gray-200 dark:bg-slate-600 rounded-full py-2 px-4 outline-none
              text-gray-600 dark:text-gray-200 placeholder:text-gray-600 dark:placeholder:text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col mt-2">
            <h3 className="text-lg text-gray-800 dark:text-gray-300 font-semibold my-2">
              {t('results')}
            </h3>

            {loading ? (
              <ImSpinner8 className="text-indigo-500 text-2xl animate-spin" />
            ) : (
              <Results
                results={results}
                setSearchTerm={setSearchTerm}
                setShowResults={setShowResults}
                setShowInput={setShowInput}
              />
            )}

            <div className="max-w-[17rem] mt-2">
              <span className="text-indigo-500">{t('searchingFor')}: </span>
              <span className="max-w-[15rem] text-indigo-500 dark:text-indigo-300 font-semibold break-words">
                {searchTerm}
              </span>
            </div>
          </div>
        </div>
      )}

      {showResults && (
        <div
          ref={desktopRef}
          className="fixed left-0 top-[3.5rem] pt-1 px-4 w-[17rem] pb-3
          bg-gray-50 dark:bg-gray-900 z-40 h-auto shadow-sm shadow-gray-600 dark:shadow-gray-700 border-t border-gray-200 dark:border-gray-800 rounded-l-none rounded-md"
        >
          <h3 className="text-lg text-gray-800 dark:text-gray-300 font-semibold my-2">
            {t('results')}
          </h3>

          {loading ? (
            <ImSpinner8 className="text-pink-500 text-2xl animate-spin" />
          ) : (
            <Results
              results={results}
              setSearchTerm={setSearchTerm}
              setShowResults={setShowResults}
              setShowInput={setShowInput}
            />
          )}

          <div className="max-w-[17rem] mt-2">
            <span className="text-indigo-500">{t('searchingFor')}: </span>
            <span className="max-w-[15rem] text-indigo-500 dark:text-indigo-300 font-semibold break-words">
              {searchTerm}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Search
