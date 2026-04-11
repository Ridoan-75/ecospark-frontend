export const QUERY_KEYS = {
  ME: ["me"],

  USERS: ["users"],
  USER: (id: string) => ["users", id],

  IDEAS: ["ideas"],
  IDEA: (id: string) => ["ideas", id],
  MY_IDEAS: ["ideas", "my"],
  TOP_VOTED_IDEAS: ["ideas", "top-voted"],
  ADMIN_IDEAS: ["ideas", "admin"],

  CATEGORIES: ["categories"],
  CATEGORY: (id: string) => ["categories", id],

  VOTE_STATS: (ideaId: string) => ["votes", ideaId, "stats"],
  MY_VOTES: ["votes", "my"],

  COMMENTS: (ideaId: string) => ["comments", ideaId],
  MY_COMMENTS: ["comments", "my"],
  ADMIN_COMMENTS: ["comments", "admin"],

  MY_PAYMENTS: ["payments", "my"],
  ADMIN_PAYMENTS: ["payments", "admin"],
  PAYMENT_ACCESS: (ideaId: string) => ["payments", "access", ideaId],

  ADMIN_SUBSCRIBERS: ["newsletter", "admin"],
} as const;