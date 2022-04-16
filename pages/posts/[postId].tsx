import Head from 'next/head'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getProviders, getSession } from 'next-auth/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'

import { Guest, Layout, Sidebar } from '../../components'
import Post from '../../components/Feed/Post'

const PostPage = ({
  providers,
  session,
  id,
  postData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!session) return <Guest providers={providers} />

  return (
    <Layout>
      <Head>
        <title> adiSocials</title>
      </Head>
      <Sidebar />
      <div className="flex justify-center mx-auto max-w-[38rem] 2xl:max-w-[45rem]">
        <div className="w-full mb-[10rem] mx-2 bg-gray-50 dark:bg-slate-800 rounded-lg shadow-md">
          <Post id={id} postData={JSON.parse(postData)} postPage />
        </div>
      </div>
    </Layout>
  )
}

export default PostPage

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const providers = await getProviders()
  const session = await getSession(context)
  const post = await getDoc(doc(db, 'posts', context.query.postId))

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      providers,
      session,
      id: post.id,
      postData: JSON.stringify(post.data()),
    },
  }
}
