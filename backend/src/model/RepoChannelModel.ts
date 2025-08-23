import mongoose, { Schema } from "mongoose";
import z from "zod";

const RepoChannelValidation = z.object({
  repos: z.object({
    id: z.string().min(2).max(100),
    name: z.string().min(2).max(100),
  }),
  slackChannels: z.object({
    id: z.string().min(2).max(100),
    name: z.string().min(2).max(100),
  }),
  userId: z.instanceof(mongoose.Types.ObjectId),
});
export type RepoModelInterface = z.infer<typeof RepoChannelValidation>;

const RepoChannelSchema: Schema<RepoModelInterface> = new Schema({
  repos: { type: Object, required: true },
  slackChannels: { type: Object, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
const RepoChannelModel = mongoose.model("RepoChannel", RepoChannelSchema);

export default RepoChannelModel;
