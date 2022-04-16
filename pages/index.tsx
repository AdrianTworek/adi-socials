import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { getProviders, getSession } from 'next-auth/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Feed, Guest, Layout, Sidebar, Contacts } from '../components'

const Home = ({
  providers,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!session) return <Guest providers={providers} />

  return (
    <Layout>
      <Head>
        <title>adiSocials</title>
      </Head>
      <div className="flex justify-center gap-[3rem] p-2">
        <Sidebar />
        <Feed />
        <Contacts />
      </div>
    </Layout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const session = await getSession(context)

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      providers,
      session,
    },
  }
}
