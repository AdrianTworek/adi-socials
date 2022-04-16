import { FC, ReactNode, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { CSSTransition } from 'react-transition-group'

import {
  useDropdownHeightContext,
  useDarkThemeContext,
  useCompactModeContext,
} from '../../../context/settings'
import useShowLanguageModalContext from '../../../context/languageModal/ShowLanguageModal'

import { AiFillSetting } from 'react-icons/ai'
import {
  BsChevronRight,
  BsMoonFill,
  BsArrowLeft,
  BsGlobe,
} from 'react-icons/bs'
import { BiLogOut } from 'react-icons/bi'
import { IoMdResize } from 'react-icons/io'

import Dropdown from '../../../hoc/Dropdown'

interface DropdownItemProps {
  children: ReactNode | ReactNode[]
  leftIcon?: any
  rightIcon?: any
  goToMenu?: string
  onClick?: Function
  logOut?: Function
}

const AccountDropdown: FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | undefined>('main')

  const { data: session } = useSession()
  const { setHeight } = useDropdownHeightContext()
  const { darkTheme, setDarkTheme } = useDarkThemeContext()
  const { compactMode, setCompactMode } = useCompactModeContext()
  const { setShowLanguageModal } = useShowLanguageModalContext()

  const router = useRouter()
  const { t } = useTranslation()

  const calculateHeight = (el: any) => {
    compactMode
      ? setHeight(el.offsetHeight + 65)
      : setHeight(el.offsetHeight + 85)
  }

  const DropdownItem: FC<DropdownItemProps> = ({
    children,
    leftIcon,
    rightIcon,
    goToMenu,
    logOut,
    onClick,
  }) => {
    return (
      <li
        className="flex gap-3 items-center w-[305px] p-2 py-3 rounded-md cursor-pointer 
            transition-all hover:bg-gray-300 dark:hover:bg-gray-800"
        onClick={() => {
          setActiveMenu(goToMenu)
          if (onClick) {
            onClick()
          }
          if (logOut) {
            logOut()
          }
        }}
      >
        {leftIcon && (
          <span className="text-xl rounded-full p-2 bg-gray-200 dark:bg-gray-700">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="text-2xl text-gray-400 font-medium ml-auto">
            {rightIcon}
          </span>
        )}
      </li>
    )
  }

  return (
    <>
      <ul className="mt-3 text-gray-700 dark:text-gray-200 text-md font-medium overflow-hidden">
        <CSSTransition
          in={activeMenu === 'main'}
          unmountOnExit
          timeout={500}
          classNames="menu-primary"
          onEnter={calculateHeight}
        >
          <div className="menu">
            <div
              className="pb-3 border-b border-gray-700"
              onClick={() => router.push(`/users/${session.user.uid}`)}
            >
              <div
                className="flex gap-3 items-center p-2 rounded-md cursor-pointer 
                transition-all hover:bg-gray-300 dark:hover:bg-gray-800"
              >
                {session.user.image && (
                  <img
                    src={session.user.image}
                    className="w-14 h-14 rounded-full text-gray-700 dark:text-gray-200"
                  />
                )}
                <div>
                  <span className="block text-lg text-gray-700 dark:text-gray-200 font-semibold">
                    {session.user.name}
                  </span>
                  <span className="text-md text-gray-600 dark:text-gray-400">
                    {t('seeYourProfile')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <DropdownItem
                leftIcon={<AiFillSetting />}
                rightIcon={
                  <BsChevronRight className="text-gray-700 dark:text-gray-300" />
                }
                goToMenu="settings"
              >
                {t('settingsAndPrivacy')}
              </DropdownItem>
            </div>
            <DropdownItem
              leftIcon={<BsMoonFill />}
              rightIcon={
                <BsChevronRight className="text-gray-700 dark:text-gray-300" />
              }
              goToMenu="display"
            >
              {t('displayAndAccessibility')}
            </DropdownItem>
            <DropdownItem
              leftIcon={<BiLogOut className="rotate-180 translate-x-0.5" />}
              goToMenu="main"
              logOut={() => {
                setTimeout(() => signOut(), 1000)
                router.push('/')
              }}
            >
              {t('logout')}
            </DropdownItem>
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeMenu === 'settings'}
          unmountOnExit
          timeout={500}
          classNames="menu-secondary"
          onEnter={calculateHeight}
        >
          <div>
            <div className="flex gap-3 items-center mb-3 pl-2">
              <BsArrowLeft
                className="text-gray-800 dark:text-gray-400 text-xl w-[36px] h-[36px] font-semibold rounded-full
                transition-all hover:bg-gray-300 dark:hover:bg-gray-700 p-1 cursor-pointer"
                onClick={() => setActiveMenu('main')}
              />

              <span className="block text-lg text-gray-700 dark:text-gray-200 font-semibold">
                {t('settingsAndPrivacy')}
              </span>
            </div>

            <DropdownItem
              leftIcon={<BsGlobe />}
              goToMenu="settings"
              onClick={() => setShowLanguageModal(true)}
            >
              {t('language')}
            </DropdownItem>
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeMenu === 'display'}
          unmountOnExit
          timeout={500}
          classNames="menu-secondary"
          onEnter={calculateHeight}
        >
          <div className="min-h-[450px]">
            <div className="flex gap-3 items-center mb-3 pl-2">
              <BsArrowLeft
                className="text-gray-800 dark:text-gray-400 text-xl w-[36px] h-[36px] font-semibold rounded-full
                transition-all hover:bg-gray-300 dark:hover:bg-gray-700 p-1 cursor-pointer"
                onClick={() => setActiveMenu('main')}
              />

              <span className="block text-lg text-gray-700 dark:text-gray-200 font-semibold">
                {t('displayAndAccessibility')}
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex gap-5 items-center max-w-[305px] px-3">
                <BsMoonFill className="text-5xl" />
                <div className="flex flex-col gap-1">
                  <span className="text-md text-gray-700 dark:text-gray-200">
                    {t('darkMode')}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-600">
                    {t('darkModeDesc')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pl-[40px] pr-3">
                <div
                  className="flex items-center p-3 rounded-lg justify-between transition-all 
                  cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setDarkTheme(false)}
                >
                  <span>{t('off')}</span>
                  <input
                    type="checkbox"
                    className={`appearance-none w-3 h-3 rounded-full border-[0.25rem] ${
                      !darkTheme ? 'border-indigo-600' : 'border-gray-500'
                    } cursor-pointer`}
                    checked={!darkTheme}
                    readOnly
                  />
                </div>

                <div
                  className="flex items-center p-3 rounded-lg justify-between transition-all 
                  cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setDarkTheme(true)}
                >
                  <span>{t('on')}</span>
                  <input
                    type="checkbox"
                    className={`appearance-none w-3 h-3 rounded-full border-[0.25rem] ${
                      darkTheme ? 'border-indigo-600' : 'border-gray-500'
                    } cursor-pointer`}
                    checked={darkTheme}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex gap-4 items-center max-w-[305px] px-3">
                <IoMdResize className="text-5xl" />
                <div className="flex flex-col gap-1">
                  <span className="text-md text-gray-700 dark:text-gray-200">
                    {t('compactMode')}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-600">
                    {t('compactModeDesc')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pl-[40px] pr-3">
                <div
                  className="flex items-center p-3 rounded-lg justify-between transition-all 
                  cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setCompactMode(false)}
                >
                  <span>{t('off')}</span>
                  <input
                    type="checkbox"
                    className={`appearance-none w-3 h-3 rounded-full border-[0.25rem] ${
                      !compactMode ? 'border-indigo-600' : 'border-gray-500'
                    }  cursor-pointer`}
                    checked={!compactMode}
                    readOnly
                  />
                </div>

                <div
                  className="flex items-center p-3 rounded-lg justify-between transition-all 
                  cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setCompactMode(true)}
                >
                  <span>{t('on')}</span>
                  <input
                    type="checkbox"
                    className={`appearance-none w-3 h-3 rounded-full border-[0.25rem] ${
                      compactMode ? 'border-indigo-600' : 'border-gray-500'
                    } cursor-pointer`}
                    checked={compactMode}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
      </ul>
    </>
  )
}

export default Dropdown(AccountDropdown)
