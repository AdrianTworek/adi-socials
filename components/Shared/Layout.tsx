import { FC } from 'react'

import useDarkThemeContext from '../../context/settings/DarkTheme'
import useShowLanguageModalContext from '../../context/languageModal/ShowLanguageModal'

import { Header, Chat, LanguageModal } from '..'

const Layout: FC = ({ children }) => {
  const { darkTheme } = useDarkThemeContext()
  const { showLanguageModal } = useShowLanguageModalContext()

  return (
    <div className={darkTheme ? 'dark' : undefined}>
      <div
        className="min-h-screen min-w-[360px] bg-gray-200 
      dark:bg-slate-900 transition-all"
      >
        <Header />
        {children}
        <Chat />
      </div>

      {showLanguageModal && <LanguageModal />}
    </div>
  )
}

export default Layout
