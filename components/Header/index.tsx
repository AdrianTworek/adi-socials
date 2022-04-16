import { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'

import useActiveSectionsIconContext from '../../context/header/ActiveSections'
import useShowSidebarContext from '../../context/sidebar/ShowSidebar'

import { HiMenu } from 'react-icons/hi'
import { AiFillCaretDown, AiFillHome } from 'react-icons/ai'
import { BsFillChatDotsFill } from 'react-icons/bs'
import { IoMdNotifications, IoLogoBitcoin } from 'react-icons/io'
import { MdGroups } from 'react-icons/md'

import Search from './Search'
import IconButton from './IconButton'
import {
  AccountDropdown,
  NotificationsDropdown,
  iChatDropdown,
} from './Dropdowns'

const IChatDropdown = iChatDropdown

const Header: FC = () => {
  const { data: session } = useSession()
  const { activeIcon, setActiveIcon } = useActiveSectionsIconContext()
  const { showSidebar, setShowSidebar } = useShowSidebarContext()

  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <header
      className="flex items-center justify-between w-full bg-gray-50 dark:bg-gray-900 
      px-4 py-2 border-b border-gray-300 dark:border-gray-800 shadow sticky z-50 top-0 mb-4"
    >
      <div
        className="flex items-center gap-2"
        onClick={() => setActiveIcon('Home')}
      >
        <Link href="/" passHref>
          <h1
            className="text-4xl font-extrabold text-transparent bg-clip-text 
            bg-gradient-to-br from-red-500 to-indigo-400 cursor-pointer"
          >
            aS
          </h1>
        </Link>

        <Search />

        <div
          className="block xl:hidden"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <IconButton
            icon={
              <HiMenu
                className={`text-2xl text-gray-700 dark:text-gray-300 ${
                  showSidebar && 'dark:text-indigo-600'
                }`}
              />
            }
            tooltipText={t('more')}
            name="More"
            hamburger
          />
        </div>
      </div>

      <div className="hidden md:flex">
        <Link href="/" passHref>
          <a>
            <IconButton
              icon={
                <AiFillHome className="text-2xl text-gray-700 dark:text-gray-300" />
              }
              tooltipText={t('Home')}
              name="Home"
              hamburger
              middle
            />
          </a>
        </Link>
        <Link href="/groups" passHref>
          <a>
            <IconButton
              icon={
                <MdGroups className="text-3xl text-gray-700 dark:text-gray-300" />
              }
              tooltipText={t('groups')}
              name="Groups"
              hamburger
              middle
            />
          </a>
        </Link>

        <Link href="/cryptocurrencies" passHref>
          <a>
            <IconButton
              icon={
                <IoLogoBitcoin className="text-2xl text-gray-700 dark:text-gray-300" />
              }
              tooltipText={t('cryptocurrencies')}
              name="Cryptocurrencies"
              hamburger
              middle
            />
          </a>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <div
          className={`
          hidden xl:flex items-center gap-1.5 p-1 pr-2 mr-3 text-gray-800 dark:text-gray-200 
          cursor-pointer transition-all hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full
          ${
            router.query.userId === session.user.uid &&
            'bg-indigo-500 text-gray-100 hover:bg-indigo-600 dark:hover:bg-indigo-600'
          }
          `}
          onClick={() => router.push(`/users/${session.user.uid}`)}
        >
          {session.user.image && (
            <img src={session.user.image} className="w-7 h-7 rounded-full" />
          )}
          {session.user.name.split(' ')[0]}
        </div>

        <IconButton
          icon={
            <BsFillChatDotsFill
              className={`text-md text-gray-700 dark:text-gray-300 ${
                activeIcon === 'iChat' && 'text-gray-200'
              }`}
            />
          }
          tooltipText={t('iChat')}
          name="iChat"
          dropdownComponent={<IChatDropdown />}
        />
        <IconButton
          icon={
            <IoMdNotifications
              className={`text-lg text-gray-700 dark:text-gray-300 ${
                activeIcon === 'Notifications' && 'text-gray-200'
              }`}
            />
          }
          tooltipText={t('Notifications')}
          name="Notifications"
          dropdownComponent={<NotificationsDropdown />}
        />
        <IconButton
          icon={
            <AiFillCaretDown
              className={`text-sm text-gray-700 dark:text-gray-300 ${
                activeIcon === 'Account' && 'text-gray-200'
              }`}
            />
          }
          tooltipText={t('Account')}
          name="Account"
          dropdownComponent={<AccountDropdown />}
        />
      </div>
    </header>
  )
}

export default Header
