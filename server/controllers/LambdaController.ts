import { Request, Response, NextFunction } from 'express';
import { AwsLambdaService } from '../services/AwsLambdaService';

class LambdaController {
  private static instance: LambdaController;
  private readonly lambdaService: AwsLambdaService;

  private constructor() {
    this.lambdaService = AwsLambdaService.getInstance();
    this.listFunctions = this.listFunctions.bind(this);
  }

  public static getInstance(): LambdaController {
    if (!LambdaController.instance) {
      LambdaController.instance = new LambdaController();
    }
    return LambdaController.instance;
  }

  public async listFunctions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.uid) {
         return next({
           log: 'Error in LambdaController.listFunctions: User ID not found on request.',
           status: 401, 
           message: { err: 'Authentication required.' },
         });
      }
      const userId = req.user.uid;

      const functionNames = await this.lambdaService.listFunctions(userId);

      res.locals.functionNames = functionNames;
      return next(); 

    } catch (error) {
      return next({
        log: `Error in LambdaController.listFunctions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: (error instanceof Error && (error.message.includes('AWS configuration not found') || error.message.includes('Invalid AWS credentials'))) ? 400 : 500,
        message: { err: error instanceof Error ? error.message : 'Error occurred when retrieving Lambda functions' }
      });
    }
  }
}

export const lambdaController = LambdaController.getInstance();