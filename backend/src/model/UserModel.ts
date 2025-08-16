import mongoose, { Schema } from "mongoose";
import z, { boolean } from "zod";
import { GithubAuth } from "../utiles/oauth/OAuthClientConfig";

const ValidateUserModel = z.object({
  name: z.string().min(2).max(100).optional(),
  username: z.string().min(2).max(100).optional(),
  github: z
    .object({
      access_token: z.string(),
      refresh_token: z.string(),
      expires_in: z.number(),
      updatedAt: z.date(),
    })
    .optional(),
  slack: z
    .object({
      access_token: z.string(),
      token_type: z.string(),
      scope: z.string(),
      bot_user_id: z.string(),
      team: {
        id: z.string(),
        name: z.string(),
      },
      authed_user: {
        id: z.string(),
        access_token: z.string(),
      },
      enterprise: {},
      is_enterprise_install: boolean,
    })
    .optional(),
});
export type IUserModel = z.infer<typeof ValidateUserModel>;
export interface IUserDocument extends IUserModel, Document {}

const UserSchema = new Schema<IUserModel>({
  name: { type: String, required: false, minlength: 2, maxlength: 100 },
  username: {
    type: String,
    required: false,
    unique: true,
    validate: {
      validator: (v) => z.string().min(2).max(100).safeParse(v).success,
    },
  },
  github: {
    access_token: { type: String, required: false },
    refresh_token: { type: String, required: false },
    expires_in: { type: Number, required: false },
    updatedAt: { type: Date, required: false },
    connected: { type: Boolean, required: false },
  },
  slack: {
    access_token: { type: String, required: false },
    token_type: { type: String, required: false },
    scope: { type: String, required: false },
    bot_user_id: { type: String, required: false },
    team: {
      id: { type: String, required: false },
      name: { type: String, required: false },
    },
    authed_user: {
      id: { type: String, required: false },
      access_token: { type: String, required: false },
    },
    enterprise: { type: Object, required: false },
    is_enterprise_install: { type: Boolean, required: false },
    connected: { type: Boolean, required: false },
  },
});

const UserModel = mongoose.model<IUserModel>("User", UserSchema);

export default UserModel;
