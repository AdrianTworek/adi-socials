import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { getProviders, getSession } from 'next-auth/react'
import { db } from '../firebase'

export const getUserInfo = async (context: any) => {
  const providers = await getProviders()
  const session = await getSession(context)

  const user = await getDoc(doc(db, 'users', context.query.userId))

  const friendRef = await getDoc(
    doc(db, 'users', context.query.userId, 'friends', session?.user?.uid)
  )

  const isFriend = friendRef.exists()

  // Get number of friends
  let q = query(collection(db, 'users', user.id, 'friends'))
  const friendsSnapshot = await getDocs(q)
  const friends = friendsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }))

  // Get user posts
  q = query(
    collection(db, 'posts'),
    where('id', '==', context.query.userId),
    orderBy('created_at', 'desc')
  )
  const postsSnapshot = await getDocs(q)
  const posts = postsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    postId: doc.id,
    created_at: {
      seconds: doc.data().created_at.seconds,
    },
  }))

  // Check if we sent invitation to someone
  const myRequestRef = await getDoc(
    doc(db, 'users', user.id, 'notifications', session.user.uid)
  )

  const isMyRequest = myRequestRef.exists()

  // Check if someone has already sent us invitation before visiting the
  // user's detail page
  const someoneRequestRef = await getDoc(
    doc(db, 'users', session.user.uid, 'notifications', user.id)
  )

  const isSomeoneRequest = someoneRequestRef.exists()

  return {
    providers,
    session,
    user: user.data(),
    userId: user.id,
    friends,
    friendsNumber: friendsSnapshot.size,
    posts,
    isFriend,
    isMyRequest,
    isSomeoneRequest,
  }
}
