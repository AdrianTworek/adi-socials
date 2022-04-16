import { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { Friend } from '../../types/friends'

interface Props {
  friends: Friend[]
  friendsNumber: number
}

const Friends: FC<Props> = ({ friends, friendsNumber }) => {
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <div className="w-full max-w-[31.25rem] lg:max-w-[25rem] bg-white dark:bg-slate-800 mx-auto lg:mx-0 my-4 p-3 rounded-md shadow-sm">
      <div className="flex justify-between -mb-2">
        <Link href={`/users/${router.query.userId}/friends`} passHref>
          <h3 className="text-xl text-gray-800 dark:text-gray-100 font-semibold cursor-pointer hover:underline">
            {t('friends')}
          </h3>
        </Link>

        <Link href={`/users/${router.query.userId}/friends`} passHref>
          <button className="text-indigo-500 font-medium px-2 py-1 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700">
            {t('seeAllFriends')}
          </button>
        </Link>
      </div>

      <span className="text-md font-medium text-gray-500">
        {friendsNumber}{' '}
        {friendsNumber === 1 ? t('friend') : t('friendsQuantity')}
      </span>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {friends.map((friend) => (
          <Link key={friend.id} href={`/users/${friend.id}`}>
            <div className="flex flex-col gap-1 cursor-pointer">
              <img
                src={friend.userImg}
                alt={`Picture of ${friend.username}`}
                className="rounded-md cursor-pointer transition-all hover:brightness-125"
              />
              <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold leading-4">
                {friend.username}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Friends
