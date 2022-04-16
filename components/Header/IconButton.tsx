import { FC, useState, ReactNode, useEffect } from 'react'

import useActiveSectionsContext from '../../context/header/ActiveSections'
import useChatContext from '../../context/chat/Chat'
import useNotificationsContext from '../../context/header/Notifications'

import Tooltip from '../Shared/Tooltip'

interface Props {
  icon: ReactNode
  name?: string
  tooltipText?: string
  middle?: boolean
  hamburger?: boolean
  dropdownComponent?: ReactNode
}

let lastIcon: string

const IconButton: FC<Props> = ({
  icon,
  name,
  tooltipText,
  middle,
  hamburger,
  dropdownComponent,
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [showContent, setShowContent] = useState<boolean>(false)

  const { activeIcon, setActiveIcon, currentPage } = useActiveSectionsContext()
  const isActiveMenuItem = activeIcon === name
  const isCurrentPage = currentPage === name

  const { notifications } = useNotificationsContext()
  const { unreadChats } = useChatContext()

  useEffect(() => {
    setTimeout(() => {
      lastIcon = activeIcon
    })
  }, [activeIcon])

  const handleClick = () => {
    setShowTooltip(false)
    setActiveIcon(name || '')

    // Enables to close dropdown both ways (onClickOutside hook and toggle after clicking icon)
    if (lastIcon === name) {
      setShowContent(false)
      setActiveIcon('')
    } else {
      setShowContent(true)
      setActiveIcon(name)
    }
  }

  return (
    <>
      <button
        className={
          hamburger
            ? `relative flex ${
                !middle ? 'xl:hidden' : 'w-[6rem] xl:w-[8rem]'
              } justify-center items-center ml-1 w-10 h-10 transition-all hover:bg-gray-300
              dark:hover:bg-gray-800 rounded-lg cursor-pointer relative`
            : `flex justify-center items-center ${
                isActiveMenuItem
                  ? 'bg-gradient-to-br from-red-400 to-indigo-500'
                  : 'bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700'
              } ml-1 w-10 h-10 transition-all cursor-pointer rounded-full relative`
        }
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
      >
        {icon}

        {/* iChat badges */}
        {name === 'iChat' && unreadChats > 0 && (
          <div className="absolute flex items-center justify-center w-5 h-5 bg-indigo-600 text-gray-100 font-medium text-sm -right-1.5 -top-1 rounded-full">
            <div>{unreadChats}</div>
          </div>
        )}

        {/* Notifications */}
        {name === 'Notifications' && notifications.length > 0 && (
          <div className="absolute flex items-center justify-center w-5 h-5 bg-indigo-600 text-gray-100 font-medium text-sm -right-1.5 -top-1 rounded-full">
            <div>{notifications.length}</div>
          </div>
        )}

        {/* Handle border bottom of middle icons */}
        {isCurrentPage && middle && (
          <div className="absolute left-0 -bottom-[10px] w-full h-[3px] bg-gradient-to-br from-red-500 to-indigo-400"></div>
        )}

        {/* Show tooltip when icon is hovered */}
        {showTooltip && tooltipText && <Tooltip text={tooltipText} />}
      </button>

      {/* Show dropdown if it's active section */}
      {isActiveMenuItem && showContent && dropdownComponent}
    </>
  )
}

export default IconButton
