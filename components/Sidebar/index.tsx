import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'

import useActiveSectionsContext from '../../context/header/ActiveSections'
import useShowSidebarContext from '../../context/sidebar/ShowSidebar'

import { BsFillPeopleFill } from 'react-icons/bs'
import { IoIosPeople, IoLogoBitcoin } from 'react-icons/io'
import { RiCloseFill } from 'react-icons/ri'
import { ImSpinner8 } from 'react-icons/im'

const Sidebar: FC = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState<boolean>(false)

  const { data: session } = useSession()
  const { showSidebar, setShowSidebar } = useShowSidebarContext()
  const { setActiveIcon } = useActiveSectionsContext()

  const router = useRouter()
  const { t } = useTranslation('common')

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      try {
        const res = await fetch(
          'https://crypto-news-live3.p.rapidapi.com/news',
          {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'crypto-news-live3.p.rapidapi.com',
              'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_CRYPTO_KEY,
            },
          }
        )

        const data = await res.json()
        const randomIndices = getRandomNumbers(data.length)

        const news: any = randomIndices.map((idx: number) => data[idx])
        setNews(news)
      } catch (error) {}

      setLoading(false)
    })()
  }, [])

  // Generate 3 random indices to fetch different news every time
  const getRandomNumbers = (n: number) => {
    let arr = []
    while (arr.length < 3) {
      let num = Math.floor(Math.random() * n)
      if (arr.indexOf(num) === -1) arr.push(num)
    }

    return arr
  }

  return (
    <>
      {showSidebar && (
        <div className="fixed top-12 left-2 xl:w-[18rem] pb-4 bg-gray-200 dark:bg-slate-900 z-40">
          <ul
            className="relative max-w-[18rem] text-gray-700 dark:text-gray-300 text-[1.1rem] font-medium 
             pt-6 pb-3 border-b border-gray-400 dark:border-gray-700"
          >
            <li
              className="flex items-center gap-2 p-2 min-w-[18rem] transition-all 
              cursor-pointer rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={() => router.push(`/users/${session.user.uid}`)}
            >
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  className="w-9 h-9 rounded-full"
                />
              )}
              {session?.user?.name}
            </li>
            <Link href={`/users/${session.user.uid}/friends`} passHref>
              <a>
                <li
                  className="flex items-center gap-3 p-2 min-w-[18rem] transition-all 
                  cursor-pointer rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  <BsFillPeopleFill className="text-3xl text-indigo-600" />{' '}
                  {t('friends')}
                </li>
              </a>
            </Link>
            <Link href="/groups" passHref>
              <a onClick={() => setActiveIcon('Groups')}>
                <li
                  className="flex items-center gap-3 p-2 min-w-[18rem] transition-all 
                  cursor-pointer rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  <IoIosPeople className="text-3xl text-pink-500" />{' '}
                  {t('groups')}
                </li>
              </a>
            </Link>

            <Link href="/cryptocurrencies" passHref>
              <a onClick={() => setActiveIcon('Cryptocurrencies')}>
                <li
                  className="flex items-center gap-3 p-2 min-w-[18rem] transition-all 
                  cursor-pointer rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  <IoLogoBitcoin className="text-3xl text-yellow-500" />{' '}
                  {t('cryptocurrencies')}
                </li>
              </a>
            </Link>
            <div
              className="flex items-center justify-center xl:hidden absolute top-8 right-2 w-8 h-8 rounded-full
              cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700"
              onClick={() => setShowSidebar(false)}
            >
              <RiCloseFill className="text-xl text-gray-800 dark:text-gray-200" />
            </div>
          </ul>

          {loading ? (
            <ImSpinner8 className="mt-8 ml-2 text-indigo-500 text-5xl animate-spin" />
          ) : (
            <div className="mt-4 pl-2">
              <h3 className="text-xl font-medium text-pink-400 dark:text-pink-300">
                {t('randomNews')}
              </h3>

              <div className="max-w-[15rem] flex flex-col gap-4 mt-4">
                {news.every((el) => el) ? (
                  news?.map((el: any, idx) => (
                    <div key={idx}>
                      <h4 className="text-gray-600 dark:text-gray-400 text-[1rem] font-bold">
                        {el?.title}
                      </h4>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {el?.source}
                        </span>
                        <a
                          href={el?.url}
                          target="_blank"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {t('seeArticle')}
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback article if API requests limit is exceeded
                  <div>
                    <h4 className="text-gray-600 dark:text-gray-400 text-[1rem] font-bold">
                      News about Radcliffe - Here you can read about main
                      character of Harry Potter
                    </h4>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        independent.co.uk
                      </span>
                      <a
                        href="https://www.independent.co.uk/topic/daniel-radcliffe"
                        target="_blank"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {t('seeArticle')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Sidebar
