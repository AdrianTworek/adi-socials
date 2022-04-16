import { FC } from 'react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

interface Props {
  section: string
  userId: string
}

const HeaderNavigation: FC<Props> = ({ section, userId }) => {
  const { t } = useTranslation('common')

  return (
    <div className="flex justify-center lg:justify-start mt-1">
      <Link href={`/users/${userId}`}>
        <div
          className={`text-gray-700 dark:text-gray-300 font-medium px-5 py-3 rounded-lg transition-all cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-700 ${
            section === 'Posts' &&
            'text-indigo-500 dark:text-indigo-500 border-b-2 border-indigo-500'
          }`}
        >
          {t('posts')}
        </div>
      </Link>
      <Link href={`/users/${userId}/friends`}>
        <div
          className={`text-gray-700 dark:text-gray-300 font-medium px-5 py-3 rounded-lg transition-all cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-700 ${
            section === 'Friends' &&
            'text-indigo-500 dark:text-indigo-500 border-b-2 border-indigo-500'
          }`}
        >
          {t('friends')}
        </div>
      </Link>
    </div>
  )
}

export default HeaderNavigation
