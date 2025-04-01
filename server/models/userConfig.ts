import mongoose, { Schema, Document } from 'mongoose';

// Interface defining the structure of a UserConfig document
export interface IUserConfig extends Document {
  userId: string; 
  awsAccessKeyId: string;
  awsSecretAccessKey: string; 
  awsRegion: string;
}

const UserConfigSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, 
      index: true, 
    },
    awsAccessKeyId: {
      type: String,
      required: true,
    },
    awsSecretAccessKey: {
      type: String,
      required: true, 
    },
    awsRegion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const UserConfig = mongoose.model<IUserConfig>('UserConfig', UserConfigSchema);

export default UserConfig;