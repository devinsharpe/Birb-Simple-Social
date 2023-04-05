import { RelationshipType } from ".prisma/client";
import { prisma } from "../server/db/client";

export const HANDLE_REGEX = /(^|[^@\w])@(\w{3,24})\b/g;
export const HANDLE_REGEX_CLEAN = /^(?<!\w)[\w]{3,24}$/;

export const getRelationshipCounts = async (id: string) => {
  const followerCount = await prisma.profileRelationship.count({
    where: {
      AND: [{ followingId: id }, { type: RelationshipType.FOLLOW }],
    },
  });
  const followingCount = await prisma.profileRelationship.count({
    where: {
      AND: [{ followerId: id }, { type: RelationshipType.FOLLOW }],
    },
  });
  return { followerCount, followingCount };
};
