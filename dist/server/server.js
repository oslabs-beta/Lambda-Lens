"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const getFunctionsController_1 = require("./controllers/getFunctionsController");
const lambdaController_1 = require("./controllers/lambdaController");
const dbConnection_1 = __importDefault(require("./models/dbConnection"));
const lambdaModel_1 = __importDefault(require("./models/lambdaModel"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Connect to the database
(0, dbConnection_1.default)().then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});
// app.get('/logs', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const logGroupNames = req.query.logGroupNames as string;
//     if (logGroupNames === 'all') {
//       // Fetch all Lambda functions
//       const functionNames = await getFunctions();
//       if (functionNames.length === 0) {
//         return res.status(404).json({ error: 'No Lambda functions found' });
//       }
//       // Extract log group names from Lambda function names
//       const logGroupNames = functionNames.map(name => `/aws/lambda/${name}`);
//       // Fetch logs for all log groups
//       await getLogs(logGroupNames);
//     } else if (!logGroupNames) {
//       return res.status(400).json({ error: 'Invalid or missing logGroupNames parameter' });
//     } else {
//       // Fetch logs for the specified log group
//       await getLogs([logGroupNames]);
//     }
//     // Fetch logs from MongoDB and respond
//     const logs = await Log.find();
//     res.json(logs);
//   } catch (err) {
//     next(err); // Pass errors to the error handling middleware
//   }
// });
app.get('/logs', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all Lambda functions
        const functionNames = yield (0, getFunctionsController_1.getFunctions)();
        if (functionNames.length === 0) {
            return res.status(404).json({ error: 'No Lambda functions found' });
        }
        // Construct log group names from Lambda function names
        const logGroupNames = functionNames.map(name => `/aws/lambda/${name}`);
        // Fetch logs
        yield (0, lambdaController_1.getLogs)(logGroupNames);
        // Fetch logs from MongoDB and respond
        const logs = yield lambdaModel_1.default.find();
        res.json(logs);
    }
    catch (err) {
        next(err); // Pass errors to the error handling middleware
    }
}));
// Route for health check or simple response
app.get('/', (req, res) => {
    res.send('Hello');
});
// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
