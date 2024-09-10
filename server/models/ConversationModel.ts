import mongoose, { Schema, Document } from 'mongoose';

interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationDocument extends Document {
  id: string;
  conversation: ConversationEntry[];
  lastUpdated: Date;
}

const ConversationSchema = new Schema<ConversationDocument>({
  id: { type: String, required: true, unique: true },
  conversation: [{ role: { type: String, enum: ['user', 'assistant'], required: true }, content: { type: String, required: true } }],
  lastUpdated: { type: Date, default: Date.now }
});

const ConversationModel = mongoose.model<ConversationDocument>('Conversation', ConversationSchema);

export default ConversationModel;