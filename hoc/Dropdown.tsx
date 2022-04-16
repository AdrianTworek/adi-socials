import {
  FC,
  ComponentType,
  useRef,
  useCallback,
  useState,
  useEffect,
} from 'react'
import { useTranslation } from 'next-i18next'

import { DropdownHeightContextProvider } from '../context/settings/DropdownHeight'
import useActiveSectionsContext from '../context/header/ActiveSections'
import { useDropdownHeightContext } from '../context/settings'
import useChatContext from '../context/chat/Chat'
import useNotificationsContext from '../context/header/Notifications'

import useOnClickOutside from '../hooks/useOnClickOutside'

const Wrapper: FC = ({ children }) => {
  const [isFullHeight, setIsFullHeight] = useState<boolean>(false)

  const { activeIcon, setActiveIcon } = useActiveSectionsContext()
  const { height } = useDropdownHeightContext()
  const { chats } = useChatContext()
  const { notifications } = useNotificationsContext()
  const { t } = useTranslation()

  const dropdownRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(
    dropdownRef,
    useCallback(() => setActiveIcon(''), [activeIcon])
  )

  // Set 100% height when there are lots of items inside the dropdown
  useEffect(() => {
    if (activeIcon === 'Account') {
      setIsFullHeight(false)
    } else if (activeIcon === 'iChat' && chats.length > 4) {
      setIsFullHeight(true)
    } else if (activeIcon === 'Notifications' && notifications.length > 4) {
      setIsFullHeight(true)
    }
  }, [activeIcon])

  return (
    <div
      ref={dropdownRef}
      className={`no-scrollbar fixed top-[3.5rem] right-4 ${
        isFullHeight && 'bottom-4'
      } min-w-[20rem] px-2 py-4 bg-gray-50 dark:bg-gray-900 shadow-sm overflow-x-hidden overflow-y-scroll shadow-gray-700 border-t border-gray-400 dark:border-gray-800 rounded-md transition-all`}
      style={{ height: height || undefined }}
    >
      <h3 className="mb-3 pl-2 text-xl pb-2 border-b border-gray-700 text-gray-700 dark:text-gray-200 text-extrabold">
        {t(activeIcon)}
      </h3>

      {children}
    </div>
  )
}

function Dropdown<T>(WrappedComponent: ComponentType<T>) {
  return (props: T) => (
    <DropdownHeightContextProvider>
      <Wrapper>
        <WrappedComponent {...props} />
      </Wrapper>
    </DropdownHeightContextProvider>
  )
}

export default Dropdown
