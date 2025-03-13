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

  public async listFunctions(_req?: Request, res?: Response, next?: NextFunction): Promise<string[] | void> {
    try {
      const functionNames = await this.lambdaService.listFunctions();
      
      if (res && next) {
        res.locals.functionNames = functionNames;
        next();
        return;
      }
      
      return functionNames;
    } catch (error) {
      if (next) {
        next({
          log: `Error in LambdaController.listFunctions: ${error instanceof Error ? error.message : 'Unknown error'}`,
          status: 500,
          message: { err: 'Error occurred when retrieving Lambda functions' }
        });
        return;
      }
      throw error;
    }
  }
}

const lambdaController = LambdaController.getInstance();
export { lambdaController };