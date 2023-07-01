import { and, eq, sql } from "drizzle-orm";
import { comments, posts } from "~/server/db/schema/app";
import { protectedProcedure, router } from "../../trpc";

import type { Comment } from "~/server/db/schema/app";
import { Visibility } from "~/server/db/schema/enums";
import { createId } from "~/server/db/utils";
import { z } from "zod";

export const commentsRouter = router({
  archive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.query.comments.findFirst({
        where: and(
          eq(comments.id, input.id),
          eq(comments.profileId, ctx.session.user.id)
        ),
      });
      if (comment) {
        const updatedComment = await ctx.db
          .update(comments)
          .set({
            visibility: Visibility.Archived,
          })
          .where(eq(comments.id, input.id))
          .returning()
          .then((cmts) => cmts[0] ?? null);
        if (updatedComment)
          await ctx.db
            .update(posts)
            .set({
              commentCount: sql`${posts.commentCount} - 1`,
            })
            .where(eq(posts.id, comment.postId));
        return updatedComment;
      }
      return null;
    }),
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        commentId: z.string().optional(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.postId),
      });
      let parent: Comment | null = null;
      if (input.commentId) {
        parent =
          (await ctx.db.query.comments.findFirst({
            where: eq(comments.id, input.commentId),
          })) ?? null;
        if (!parent) return null;
      }
      if (post) {
        const comment = await ctx.db
          .insert(comments)
          .values({
            ...input,
            id: createId(),
            profileId: ctx.session.user.id,
          })
          .returning()
          .then((cmts) => cmts[0] ?? null);
        await ctx.db
          .update(posts)
          .set({
            commentCount: sql`${posts.commentCount} + 1`,
          })
          .where(eq(posts.id, input.postId));
        return comment;
      }
      return null;
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.query.comments.findFirst({
        where: eq(comments.id, input.id),
        with: {
          postedBy: true,
        },
      });
      return comment ?? null;
    }),
});

// export const commentsRouter = router({
//   archive: protectedProcedure
//     .input(
//       z.strictObject({
//         id: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const comment = await ctx.prisma.comment.findFirst({
//         where: {
//           id: input.id,
//           profileId: ctx.session.user.id,
//         },
//       });
//       if (comment) {
//         const updatedComment = await ctx.prisma.comment.update({
//           where: {
//             id: input.id,
//           },
//           data: {
//             visibility: Visibility.Archived,
//           },
//         });
//         await ctx.prisma.post.update({
//           where: {
//             id: updatedComment.postId,
//           },
//           data: {
//             commentCount: {
//               decrement: 1,
//             },
//           },
//         });
//         return updatedComment;
//       }
//       return null;
//     }),
//   create: protectedProcedure
//     .input(
//       z.strictObject({
//         postId: z.string(),
//         parentId: z.string().optional(),
//         text: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const post = await ctx.prisma.post.findFirst({
//         where: {
//           id: input.postId,
//         },
//       });
//       let parent: Comment | null = null;
//       if (input.parentId) {
//         parent = await ctx.prisma.comment.findFirst({
//           where: {
//             id: input.parentId,
//           },
//         });
//         if (!parent) return null;
//       }

//       if (post) {
//         const result = await ctx.db.insert(CommentSchema).values({
//           text: input.text,
//           postId: input.postId,
//           profileId: ctx.session.user.id,
//           commentId: input.parentId,
//         });
//         console.log(result);

//         const comment = await ctx.prisma.comment.create({
//           data: {
//             text: input.text,
//             postId: input.postId,
//             profileId: ctx.session.user.id,
//             commentId: input.parentId,
//           },
//         });

//         await ctx.prisma.post.update({
//           where: { id: input.postId },
//           data: {
//             commentCount: {
//               increment: 1,
//             },
//           },
//         });
//         fetch(`${env.MODERATION_URL}api/queue/add`, {
//           keepalive: false,
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify([
//             {
//               id: comment.id,
//               text: comment.text,
//               type: "COMMENT",
//             },
//           ]),
//         });
//         return comment;
//       }
//       return null;
//     }),
//   get: protectedProcedure
//     .input(
//       z.strictObject({
//         id: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const comment = await ctx.prisma.comment.findFirst({
//         where: {
//           id: input.id,
//         },
//         include: {
//           children: {
//             include: {
//               postedBy: true,
//             },
//           },
//           postedBy: true,
//         },
//       });
//       return comment;
//     }),
// });
