import Link from 'next/link'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Friend } from '../../../../types/friends'

import {
  Guest,
  Layout,
  Sidebar,
  UserHeader,
  HeaderNavigation,
} from '../../../../components'

import { getUserInfo } from '../../../../utils/getUserInfo'

const Friends = ({
  providers,
  session,
  user,
  userId,
  friends,
  friendsNumber,
  isFriend,
  isMyRequestSent,
  isSomeoneRequestSent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!session) return <Guest providers={providers} />

  return (
    <Layout>
      <Head>
        <title>{user.name} | adiSocials</title>
      </Head>
      <Sidebar />
      <div className="mx-auto px-4 xl:ml-[23rem] 2xl:mx-auto max-w-[60rem]">
        <UserHeader
          user={user}
          userId={userId}
          session={session}
          friends={friends.slice(0, 7)}
          friendsNumber={friendsNumber}
          isMyRequestSent={isMyRequestSent}
          isSomeoneRequestSent={isSomeoneRequestSent}
          isFriend={isFriend}
        />
        <HeaderNavigation section="Friends" userId={userId} />
        <div className="mt-4">
          <div className="xl:mx-0 grid grid-cols-1 md:grid-cols-2 justify-items-start gap-3 mt-4 p-4">
            {friends.length === 0 ? (
              <h3 className="text-lg text-gray-500 dark:text-gray-400">
                This user has not added any friend yet
              </h3>
            ) : (
              <>
                {friends.map((friend: Friend) => (
                  <Link key={friend.id} href={`/users/${friend.id}`}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <img
                        src={friend.userImg}
                        alt={`Picture of ${friend.username}`}
                        className="w-24 rounded-md cursor-pointer transition-all hover:brightness-125"
                      />
                      <p className="text-gray-700 dark:text-gray-300 font-semibold leading-4">
                        {friend.username}
                      </p>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Friends

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      ...(await getUserInfo(context)),
    },
  }
}
