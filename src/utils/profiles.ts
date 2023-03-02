import { RelationshipType } from ".prisma/client";
import { prisma } from "../server/db/client";

export const getRelationshipCounts = async (id: string) => {
  const followerCount = await prisma.profileRelationship.count({
    where: {
      followingId: id,
      type: RelationshipType.FOLLOW,
    },
  });
  const followingCount = await prisma.profileRelationship.count({
    where: {
      followerId: id,
      type: RelationshipType.FOLLOW,
    },
  });
  return { followerCount, followingCount };
};
