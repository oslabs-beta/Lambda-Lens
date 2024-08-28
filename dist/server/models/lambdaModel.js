"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logSchema = new mongoose_1.default.Schema({
    Date: String,
    Time: String,
    Duration: String,
    BilledDuration: String,
    InitDuration: String,
    MaxMemUsed: String,
}, { timestamps: true });
const Log = mongoose_1.default.model('Log', logSchema);
exports.default = Log;
