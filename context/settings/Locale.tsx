import { createContext, ReactNode, useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import moment from 'moment'

interface LocaleContextProps {
  children: ReactNode | ReactNode[]
}

const LocaleContext = createContext({})

export const LocaleContextProvider = ({ children }: LocaleContextProps) => {
  const { i18n } = useTranslation('common')

  // Loads necessary module for "moment" library if language is changed
  useEffect(() => {
    if (i18n.language !== 'en') {
      try {
        import(`moment/locale/${i18n.language}`).then(() => {
          moment.locale(i18n.language)
        })
      } catch (error) {
        console.error(error)
      }
    } else {
      moment.locale('en')
    }
  }, [i18n.language])

  return <LocaleContext.Provider value={{}}>{children}</LocaleContext.Provider>
}

const useLocaleContext = () => useContext(LocaleContext)

export default useLocaleContext
