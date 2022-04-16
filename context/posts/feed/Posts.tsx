import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { db } from '../../../firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

import { Post } from '../../../types/post'

interface PostsContextProps {
  children: ReactNode | ReactNode[]
}

type PostsContextType = {
  posts: Post[]
  setPosts: Dispatch<SetStateAction<any>>
}

const PostsContext = createContext<PostsContextType>({
  posts: [],
  setPosts: () => {},
})

export const PostsContextProvider = ({ children }: PostsContextProps) => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'posts'), orderBy('created_at', 'desc')),
        (snapshot: any) => {
          setPosts(snapshot.docs)
        }
      ),
    [db]
  )

  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostsContext.Provider>
  )
}

const usePostsContext = () => useContext(PostsContext)

export default usePostsContext
