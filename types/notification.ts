export type Notification = {
  id: string
  userId?: string
  postId?: string
  type: 'like' | 'comment' | 'friend_request'
  username: string
  userImg: string
  created_at: any
}
