import { FC } from 'react'

import { Post as PostType } from '../../types/post'

import usePostsContext from '../../context/posts/feed/Posts'

import Input from './Input'
import Post from './Post'

const Feed: FC = () => {
  const { posts } = usePostsContext()

  return (
    <div className="flex flex-col flex-1 gap-6 max-w-[38rem] 2xl:max-w-[45rem] pb-[30rem]">
      <div
        className="relative flex flex-col flex-1 h-min
        gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg shadow-md"
      >
        <Input />
      </div>

      {posts.map((post: PostType) => (
        <div
          key={post.id}
          className="flex flex-col gap-3 bg-gray-50 dark:bg-slate-800 rounded-lg shadow-md"
        >
          <Post id={post.id} postData={{ ...post.data() }} />
        </div>
      ))}
    </div>
  )
}

export default Feed
