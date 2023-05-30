export enum RequestStatus {
  Pending = "PENDING",
  Accepted = "ACCEPTED",
  Cancelled = "CANCELLED",
  Denied = "DENIED",
  Removed = "REMOVED",
  Forced = "FORCE_REMOVED",
}
export const RequestStatusValues = [
  ...Object.values(RequestStatus),
] as unknown as [RequestStatus, ...RequestStatus[]];

export enum RelationshipType {
  Follow = "FOLLOW",
  Block = "BLOCK",
}
export const RelationshipTypeValues = [
  ...Object.values(RelationshipType),
] as unknown as [RelationshipType, ...RelationshipType[]];

export enum Theme {
  Auto = "AUTO",
  Light = "LIGHT",
  Dark = "DARK",
}
export const ThemeValues = [...Object.values(Theme)] as unknown as [
  Theme,
  ...Theme[]
];

export enum PostReviewStatus {
  Processing = "PROCESSING",
  Approved = "APPROVED",
  Appealed = "APPEALED",
  RejectedAuto = "REJECTED_AUTO",
  RejectedManual = "REJECTED_MANUAL",
}
export const PostReviewStatusValues = [
  ...Object.values(PostReviewStatus),
] as unknown as [PostReviewStatus, ...PostReviewStatus[]];

export enum PostType {
  Image = "IMAGE",
  Text = "TEXT",
}
export const PostTypeValues = [...Object.values(PostType)] as unknown as [
  PostType,
  ...PostType[]
];

export enum Visibility {
  Active = "ACTIVE",
  Archived = "ARCHIVED",
  Rejected = "Rejected",
}
export const VisibilityValues = [...Object.values(Visibility)] as unknown as [
  Visibility,
  ...Visibility[]
];

export enum Reaction {
  Downcast = "DOWNCAST",
  Fire = "FIRE",
  Heart = "HEART",
  HeartEyes = "HEART_EYES",
  Joy = "JOY",
  PinchedFingers = "PINCHED_FINGERS",
  Smile = "SMILE",
  Skull = "SKULL",
  ThumbsUp = "THUMBS_UP",
  Weeping = "WEEPING",
}
export const ReactionValues = [...Object.values(Reaction)] as unknown as [
  Reaction,
  ...Reaction[]
];
