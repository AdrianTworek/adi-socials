import { FC, useRef } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import useShowLanguageModalContext from '../../context/languageModal/ShowLanguageModal'
import useOnClickOutside from '../../hooks/useOnClickOutside'

const LanguageModal: FC = () => {
  const { setShowLanguageModal } = useShowLanguageModalContext()
  const { t } = useTranslation('common')
  const router = useRouter()
  const { locale } = router

  const modalRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(modalRef, () => setShowLanguageModal(false))

  const handleChangeLanguage = (language: string) => {
    if (locale === language) {
      return setShowLanguageModal(false)
    }

    router.push('/', '/', { locale: language })
  }

  return (
    <div className="flex items-center justify-center fixed z-50 inset-0 w-full min-h-screen">
      <div className="w-full min-h-screen bg-black opacity-75"></div>
      <div
        ref={modalRef}
        className="flex flex-col gap-2 items-center justify-center fixed px-8 py-6 bg-slate-100 text-gray-900 rounded-lg"
      >
        <h3 className="text-xl text-gray-600 font-semibold">
          {t('changeLanguage')}
        </h3>

        <p
          className="text-lg font-medium cursor-pointer hover:underline"
          onClick={() => handleChangeLanguage('pl')}
        >
          PL
        </p>
        <p
          className="text-lg font-medium cursor-pointer hover:underline"
          onClick={() => handleChangeLanguage('en')}
        >
          EN
        </p>
      </div>
    </div>
  )
}

export default LanguageModal
