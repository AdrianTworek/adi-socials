import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation } from 'next-i18next'

import { polyfill } from 'smoothscroll-polyfill'

import { LocaleContextProvider } from '../context/settings/Locale'
import { DarkThemeContextProvider } from '../context/settings/DarkTheme'
import { CompactModeContextProvider } from '../context/settings/CompactMode'
import { ActiveSectionsContextProvider } from '../context/header/ActiveSections'
import { ShowSidebarContextProvider } from '../context/sidebar/ShowSidebar'
import { PostsContextProvider } from '../context/posts/feed/Posts'
import { FormContextProvider } from '../context/posts/feed/Form'
import { NotificationsContextProvider } from '../context/header/Notifications'
import { ChatContextProvider } from '../context/chat/Chat'
import { ShowLanguageModalContextProvider } from '../context/languageModal/ShowLanguageModal'

import '../styles/globals.css'
import { useEffect } from 'react'

function App({ Component, pageProps }: AppProps) {
  // Smooth scrolling
  useEffect(() => {
    polyfill()
  }, [])

  return (
    <SessionProvider session={pageProps.session}>
      <LocaleContextProvider>
        <DarkThemeContextProvider>
          <ShowLanguageModalContextProvider>
            <ChatContextProvider>
              <NotificationsContextProvider>
                <FormContextProvider>
                  <PostsContextProvider>
                    <CompactModeContextProvider>
                      <ActiveSectionsContextProvider>
                        <ShowSidebarContextProvider>
                          <Component {...pageProps} />
                        </ShowSidebarContextProvider>
                      </ActiveSectionsContextProvider>
                    </CompactModeContextProvider>
                  </PostsContextProvider>
                </FormContextProvider>
              </NotificationsContextProvider>
            </ChatContextProvider>
          </ShowLanguageModalContextProvider>
        </DarkThemeContextProvider>
      </LocaleContextProvider>
    </SessionProvider>
  )
}

export default appWithTranslation(App)
