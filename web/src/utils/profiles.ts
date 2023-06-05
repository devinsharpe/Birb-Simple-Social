// import { RelationshipType } from ".prisma/client";
import { and, eq } from "drizzle-orm";
// import { prisma } from "../server/db/client";
import db from "~/server/db";
import { profileRelationships } from "~/server/db/schema/app";
import { RelationshipType } from "~/server/db/schema/enums";

export const HANDLE_REGEX = /(^|[^@\w])@(\w{3,24})\b/g;
export const HANDLE_REGEX_CLEAN = /^(?<!\w)[\w]{3,24}$/;

// TODO: Add getRelationshipCounts that uses ProfileRelationship param and one query

export const getRelationshipCounts = async (id: string) => {
  const followerCount = await db.query.profileRelationships
    .findMany({
      columns: {
        id: true,
      },
      where: and(
        eq(profileRelationships.followingId, id),
        eq(profileRelationships.type, RelationshipType.Follow)
      ),
    })
    .then((prfRels) => prfRels.length);
  const followingCount = await db.query.profileRelationships
    .findMany({
      columns: {
        id: true,
      },
      where: and(
        eq(profileRelationships.followerId, id),
        eq(profileRelationships.type, RelationshipType.Follow)
      ),
    })
    .then((prfRels) => prfRels.length);
  return { followerCount, followingCount };
};

// export const getRelationshipCountsOld = async (id: string) => {
//   const followerCount = await prisma.profileRelationship.count({
//     where: {
//       AND: [{ followingId: id }, { type: RelationshipType.FOLLOW }],
//     },
//   });
//   const followingCount = await prisma.profileRelationship.count({
//     where: {
//       AND: [{ followerId: id }, { type: RelationshipType.FOLLOW }],
//     },
//   });
//   return { followerCount, followingCount };
// };
