import mongoose, { Schema } from "mongoose";
import z from "zod";
const ValidateUserModel = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  github: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number(),
  }),
  slack: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number(),
  }),
});

export type IUserModel = z.infer<typeof ValidateUserModel>;
export interface IUserDocument extends IUserModel, Document {}

const UserSchema = new Schema<IUserModel>({
  name: { type: String, required: true, minlength: 2, maxlength: 100 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: (v) => z.string().email().safeParse(v).success },
  },
  github: {
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    expires_in: { type: Number, required: true },
  },
  slack: {
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    expires_in: { type: Number, required: true },
  },
});

const UserModel = mongoose.model<IUserModel>("User", UserSchema);

export default UserModel;
