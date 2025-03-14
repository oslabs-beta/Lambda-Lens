import mongoose, { Schema, Document } from 'mongoose';

interface LogEntry {
  dateTime: Date;
  functionName: string;
  duration: number;
  billedDuration: number;
  initDuration?: number;
  maxMemoryUsed: number;
}

interface LogDocument extends Document, LogEntry {
  createdAt: Date;
  updatedAt: Date;
}

const logSchema = new Schema<LogDocument>(
  {
    dateTime: { type: Date, required: true },
    functionName: { type: String, required: true },
    duration: { type: Number, required: true },
    billedDuration: { type: Number, required: true },
    initDuration: { type: Number, required: false },
    maxMemoryUsed: { type: Number, required: true },
  },
  { timestamps: true }
);

// Add validation to ensure numeric fields are positive
logSchema.pre('save', function(next) {
  const log = this as LogDocument;
  
  if (log.duration < 0) throw new Error('Duration must be positive');
  if (log.billedDuration < 0) throw new Error('Billed duration must be positive');
  if (log.initDuration !== undefined && log.initDuration < 0) throw new Error('Init duration must be positive');
  if (log.maxMemoryUsed < 0) throw new Error('Max memory used must be positive');
  
  next();
});

// Convert memory to number and strip 'MB' unit if present
logSchema.pre('save', function(next) {
  const log = this as LogDocument;
  const memValue = log.maxMemoryUsed;
  if (typeof memValue === 'string') {
    const stringValue = String(memValue);
    log.maxMemoryUsed = parseFloat(stringValue.replace('MB', ''));
  }
  next();
});

const Log = mongoose.model<LogDocument>('Log', logSchema);

export type { LogEntry, LogDocument };
export default Log;
