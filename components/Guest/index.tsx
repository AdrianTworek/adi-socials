import { FC, useState } from 'react'
import Head from 'next/head'
import { signIn } from 'next-auth/react'
import { useTranslation } from 'next-i18next'

interface Props {
  providers: Object
}

const Guest: FC<Props> = ({ providers }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <title>adiSocials</title>
      </Head>
      <div className="bg-guest">
        <div className="absolute w-full min-h-screen bg-black opacity-60 top-0 left-0"></div>
        <div className="absolute w-full  z-50 min-h-screen flex flex-col items-center justify-center gap-3 p-4">
          <h2
            className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text 
        bg-gradient-to-br from-red-500 to-indigo-400"
          >
            adiSocials
          </h2>
          <h3 className="max-w-[18.75rem] text-lg md:text-xl text-center text-gray-400 mb-4">
            {t('joinAdiSocials')}. {t('findYour')}{' '}
            <span className="text-indigo-400 font-medium">
              {t('yourFriends')}
            </span>
            , {t('share')}{' '}
            <span className="text-pink-400 font-medium">{t('thoughts')}</span>{' '}
            {t('andPost')}{' '}
            <span className="text-yellow-500 font-medium">{t('images')}</span>.
          </h3>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="relative group overflow-hidden px-5 py-3 bg-white text-gray-700 hover:text-white font-bold rounded-lg transition-all ease-in-out duration-250"
                disabled={loading}
                onClick={async () => {
                  setLoading(true)
                  await signIn(provider.id, { callbackUrl: '/' })
                  setLoading(false)
                }}
              >
                <span className="relative z-30">
                  {t('signInWith')} {provider.name}
                </span>
                <span className="absolute z-20 w-4 h-4 bg-indigo-400 rounded-full -bottom-1 -left-1 group-hover:w-[20rem] group-hover:h-[10rem] group-hover:-bottom-10 group-hover:-left-10 transition-all ease-in-out duration-300"></span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Guest
