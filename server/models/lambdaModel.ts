import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    Date:String,
    Time:String,
    FunctionName: String,
    Duration:String,
    BilledDuration:String,
    InitDuration:String,
    MaxMemUsed:String,
}, {timestamps: true});

const Log = mongoose.model('Log', logSchema);
export default Log;

