import { FC } from 'react'
import { useTranslation } from 'next-i18next'

import { Post as PostType } from '../../types/post'

import Post from '../Feed/Post'

interface Props {
  posts: PostType[]
}

const Posts: FC<Props> = ({ posts }) => {
  const { t } = useTranslation('common')

  return (
    <div className="max-w-[31.25rem] lg:max-w-[50rem] w-full lg:my-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 bg-white dark:bg-slate-800 rounded-md shadow-sm p-3">
        {t('posts')}
      </h3>

      <div className="flex flex-col gap-4 mt-4">
        {posts?.map((post) => (
          <div
            key={post.postId}
            className="bg-white dark:bg-slate-800 rounded-md shadow-sm"
          >
            <Post id={post.postId} postData={post} postPage userPage />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Posts
