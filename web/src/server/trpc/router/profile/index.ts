import { eq, like, or } from "drizzle-orm";
import { profileSettings, profiles } from "~/server/db/schema/app";
import { protectedProcedure, publicProcedure, router } from "../../trpc";

import { HANDLE_REGEX_CLEAN } from "../../../../utils/profiles";
import { nameConfig } from "~/utils/demo";
import { uniqueNamesGenerator } from "unique-names-generator";
import { z } from "zod";

export const profileRouter = router({
  checkProfileHandle: protectedProcedure
    .input(
      z.object({
        handle: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const handleProfile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.normalizedHandle, input.handle.toLowerCase()),
      });
      return (
        (!!!handleProfile || handleProfile.id === ctx.session.user.id) &&
        HANDLE_REGEX_CLEAN.test(input.handle)
      );
    }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.query.profiles.findFirst({
      where: eq(profiles.id, ctx.session.user.id),
    });
    if (profile) {
      let settings = await ctx.db.query.profileSettings.findFirst({
        where: eq(profileSettings.id, ctx.session.user.id),
      });
      if (!settings)
        settings = await ctx.db
          .insert(profileSettings)
          .values({
            id: ctx.session.user.id,
          })
          .returning()
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .then((prfSttngs) => prfSttngs[0]!);
      return {
        profile,
        settings,
      };
    } else {
      const handle = uniqueNamesGenerator(nameConfig).toLowerCase();
      const profile = await ctx.db
        .insert(profiles)
        .values({
          id: ctx.session.user.id,
          name: "",
          handle,
          normalizedHandle: handle,
        })
        .returning()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .then((prfs) => prfs[0]!);
      const settings = await ctx.db
        .insert(profileSettings)
        .values({
          id: ctx.session.user.id,
        })
        .returning()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .then((prfs) => prfs[0]!);
      return { profile, settings };
    }
  }),
  searchProfiles: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.query.profiles.findMany({
        where: or(
          like(profiles.handle, input.trim().replace(/[\s\n\t]/g, ":*&")),
          like(profiles.name, input.trim().replace(/[\s\n\t]/g, ":*&"))
        ),
      });
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50),
        handle: z.string().max(24).regex(HANDLE_REGEX_CLEAN),
        biography: z.string().max(300).nullable(),
        birthdate: z.string().max(10).nullable(),
        location: z.string().max(50).nullable(),
        website: z.string().nullable(),
        avatarUrl: z.string().optional(),
        headerUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let profile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.id, ctx.session.user.id),
      });
      if (profile) {
        profile = await ctx.db
          .update(profiles)
          .set({
            ...input,
            canChangeHandle:
              input.handle === profile.handle && profile.canChangeHandle,
            handle:
              profile.canChangeHandle && input.handle
                ? input.handle.trim()
                : profile.handle,
            normalizedHandle:
              profile.canChangeHandle && input.handle
                ? input.handle.trim().toLowerCase()
                : profile.normalizedHandle,
          })
          .returning()
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .then((prfs) => prfs[0]!);
        return profile;
      }
      return null;
    }),
});

// export const profileRouterOld = router({
//   checkProfileHandle: protectedProcedure
//     .input(z.string())
//     .mutation(async ({ ctx, input }) => {
//       const handleProfile = await ctx.prisma.profile.findFirst({
//         where: {
//           normalizedHandle: input.toLowerCase(),
//         },
//       });
//       return (
//         (!!!handleProfile || handleProfile.id === ctx.session.user.id) &&
//         HANDLE_REGEX_CLEAN.test(input)
//       );
//     }),
//   getProfile: protectedProcedure.query(async ({ ctx }) => {
//     const profile = await ctx.prisma.profile.findFirst({
//       where: {
//         id: ctx.session.user.id,
//       },
//     });

//     if (profile) {
//       let settings = await ctx.prisma.profileSettings.findFirst({
//         where: {
//           id: profile.id,
//         },
//       });
//       if (!settings) {
//         settings = await ctx.prisma.profileSettings.create({
//           data: {
//             id: profile.id,
//           },
//         });
//       }
//       return { profile, settings };
//     } else {
//       const handle = uniqueNamesGenerator(nameConfig).toLowerCase();
//       const profile = await ctx.prisma.profile.create({
//         data: {
//           id: ctx.session.user.id,
//           name: "",
//           handle,
//           normalizedHandle: handle,
//         },
//       });
//       const settings = await ctx.prisma.profileSettings.create({
//         data: {
//           id: profile.id,
//         },
//       });
//       return { profile, settings };
//     }
//   }),
//   searchProfiles: publicProcedure
//     .input(z.string())
//     .mutation(async ({ ctx, input }) => {
//       try {
//         const result = await ctx.prisma.profile.findMany({
//           take: 10,
//           where: {
//             handle: {
//               search: input.trim().replace(/[\s\n\t]/g, ":*&") + ":*",
//             },
//             name: {
//               search: input.trim().replace(/[\s\n\t]/g, ":*&") + ":*",
//             },
//           },
//         });
//         return result;
//       } catch (err) {
//         console.log(err);
//         return [];
//       }
//     }),
//   updateProfile: protectedProcedure
//     .input(
//       z.object({
//         name: z.string().max(50),
//         handle: z.string().max(24).regex(HANDLE_REGEX_CLEAN),
//         biography: z.string().max(300).nullable(),
//         birthdate: z.string().max(10).nullable(),
//         location: z.string().max(50).nullable(),
//         website: z.string().nullable(),
//         avatarUrl: z
//           .string()
//           .default("https://source.unsplash.com/random/600×600/?cat"),
//         headerUrl: z
//           .string()
//           .default("https://source.unsplash.com/random/1920×1080/?cat"),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const oldProfile = await ctx.prisma.profile.findFirst({
//         where: { id: ctx.session.user.id },
//       });
//       if (oldProfile) {
//         const profile = await ctx.prisma.profile.update({
//           where: {
//             id: ctx.session.user.id,
//           },
//           data: {
//             ...input,
//             canChangeHandle:
//               input.handle === oldProfile.handle && oldProfile.canChangeHandle,
//             handle:
//               oldProfile.canChangeHandle && input.handle
//                 ? input.handle.trim()
//                 : oldProfile.handle,
//             normalizedHandle:
//               oldProfile.canChangeHandle && input.handle
//                 ? input.handle.trim().toLowerCase()
//                 : oldProfile.normalizedHandle,
//           },
//         });
//         return profile;
//       }
//       return oldProfile;
//     }),
// });
