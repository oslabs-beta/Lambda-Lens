import { Schema, model } from 'mongoose';

const visDataSchema = new Schema(
  {
    region: { type: String, required: true },
    functionName: { type: String, required: true },
    avgBilledDur: { type: Number, required: true },
    numColdStarts: { type: Number, required: true },
    percentColdStarts: { type: Number, required: true },
  },
  { timestamps: true }
);

const visData = model('visData', visDataSchema);

export default visData;
