import { Schema, model } from 'mongoose';
import { MetricsDocument } from '../types/metrics';

const visDataSchema = new Schema<MetricsDocument>(
  {
    region: { type: String, required: true },
    functionName: { type: String, required: true },
    avgBilledDur: { type: Number, required: true },
    numColdStarts: { type: Number, required: true },
    percentColdStarts: { type: Number, required: true },
  },
  { timestamps: true }
);

const visData = model<MetricsDocument>('visData', visDataSchema);

export default visData;
