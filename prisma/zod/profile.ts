// import * as imports from "../null";
import * as z from "zod";

import type { CompleteAccount, CompleteUser } from "./index";
import { RelatedAccountModel, RelatedUserModel } from "./index";

import { ProfileStatus } from "@prisma/client";

export const ProfileModel = z.object({
  id: z.string(),
  avatarUrl: z.string().nullish(),
  firstName: z.string(),
  lastName: z.string(),
  handle: z.string(),
  biograpy: z.string(),
  birthday: z.date().nullish(),
  location: z.string().nullish(),
  website: z.string().nullish(),
  status: z.nativeEnum(ProfileStatus),
  canChangeHandle: z.boolean(),
  relationshipCount: z.number().int(),
  postCount: z.number().int(),
  mediaCount: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  accountId: z.string(),
  userId: z.string(),
});

export interface CompleteProfile extends z.infer<typeof ProfileModel> {
  account: CompleteAccount;
  user: CompleteUser;
}

/**
 * RelatedProfileModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProfileModel: z.ZodSchema<CompleteProfile> = z.lazy(() =>
  ProfileModel.extend({
    account: RelatedAccountModel,
    user: RelatedUserModel,
  })
);
