const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"

export const API_ENDPOINTS = {
  // Auth
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  LOGOUT: "/users/logout",
  REFRESH_TOKEN: "/users/refresh-token",
  PROFILE: "/users/profile",

  // Pools
  POOLS: "/pool",
  CREATE_POOL: "/pool/createPool",
  DISCOVER_POOLS: "/pool/discover",
  JOIN_POOL: "/pool/:id/join",
  WITHDRAW_REQUEST: "/pool/:id/withdraw",
  VIEW_REQUESTS: "/pool/:id/requests",
  ACCEPT_REQUEST: "/pool/:id/accept",
  REJECT_REQUEST: "/pool/:id/reject",
  UPDATE_STATUS: "/pool/:id/status",

  // Chat
  SEND_MESSAGE: "/chat/:poolId/send",
  GET_MESSAGES: "/chat/:poolId/messages",
  MARK_SEEN: "/chat/:poolId/mark-seen",
  UNREAD_COUNTS: "/chat/unread-counts",
  DELETE_MESSAGE: "/chat/:messageId",
  EDIT_MESSAGE: "/chat/:id/edit",
  REPLY_MESSAGE: "/chat/:poolId/reply",

  // Posts
  CREATE_POST: "/posts/create",
  POOL_POSTS: "/posts/pool/:poolId",
  LIKE_POST: "/posts/:postId/like",
  COMMENT_POST: "/posts/:postId/comment",
  FEED_POSTS: "/posts/feed",

  // Reviews
  CREATE_REVIEW: "/reviews/:userId",
  USER_REVIEWS: "/reviews/user/:userId",
  AVERAGE_RATING: "/reviews/user/:userId/average-rating",

  // QR
  GENERATE_QR: "/qr/generate",
  VERIFY_QR: "/qr/verify",
}

export default API_BASE_URL
