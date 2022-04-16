import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import {
  Guest,
  Layout,
  Sidebar,
  UserHeader,
  Intro,
  Posts,
  Friends,
  Hobbies,
  HeaderNavigation,
} from '../../../components'

import { getUserInfo } from '../../../utils/getUserInfo'

const UserProfile = ({
  providers,
  session,
  user,
  userId,
  friends,
  friendsNumber,
  posts,
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
        <HeaderNavigation section="Posts" userId={userId} />
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 pb-[30rem]">
          <div className="w-full max-w-[31.25rem] lg:max-w-[25rem]">
            <Intro bio={user.bio} />
            <Hobbies user={user} />
            <Friends
              friends={friends.slice(0, 9)}
              friendsNumber={friendsNumber}
            />
          </div>
          <Posts posts={posts} />
        </div>
      </div>
    </Layout>
  )
}

export default UserProfile

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      ...(await getUserInfo(context)),
    },
  }
}
