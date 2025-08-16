import mongoose, { Schema } from "mongoose";
import UserModel from "./UserModel";

const RepoChannelSchema = new Schema({
  repoName: { type: String, required: true },
  slackChannelId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
const RepoChannelModel = mongoose.model("RepoChannel", RepoChannelSchema);

export default RepoChannelModel;
