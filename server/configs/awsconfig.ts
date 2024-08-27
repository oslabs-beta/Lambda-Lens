import { Config } from '../types.js' 
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env')});

//typescript recognizes process.env as undefined
//use ! to signify that it's NOT null even though it looks like it 
export const awsconfig: Config = {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_REGION!,
};