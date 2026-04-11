export const IDEA_STATUS = {
  DRAFT: "DRAFT",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const VOTE_TYPE = {
  UP: "UP",
  DOWN: "DOWN",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export const USER_ROLE = {
  MEMBER: "MEMBER",
  ADMIN: "ADMIN",
} as const;

export const IDEA_SORT_OPTIONS = [
  { label: "Most Recent", value: "recent" },
  { label: "Top Voted", value: "top_voted" },
  { label: "Most Commented", value: "most_commented" },
  { label: "Most Viewed", value: "most_viewed" },
] as const;

export const IDEAS_PER_PAGE = 10;
export const COMMENTS_PER_PAGE = 20;