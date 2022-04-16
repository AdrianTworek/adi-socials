import NextAuth, { User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { FirebaseAdapter } from '@next-auth/firebase-adapter'
import { db } from '../../../firebase'

import {
  collection,
  query,
  getDocs,
  where,
  limit,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
} from 'firebase/firestore'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  adapter: FirebaseAdapter({
    db,
    collection,
    query,
    getDocs,
    where,
    limit,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    runTransaction,
  }),
  callbacks: {
    async session({ session, user }: { session: any; user: User }) {
      session.user.uid = user.id
      return session
    },
  },
  secret: process.env.JWT_SECRET,
})
