import { GetMetricDataCommandOutput } from '@aws-sdk/client-cloudwatch';

export class MetricsValidator {
  static validateMetricResponse(response: GetMetricDataCommandOutput): void {
    if (!response.MetricDataResults) {
      throw new Error('Invalid metric response: Missing MetricDataResults');
    }

    for (const result of response.MetricDataResults) {
      if (!result.Id) {
        throw new Error('Invalid metric result: Missing Id');
      }

      if (!result.Values) {
        result.Values = [];
      }

      if (!result.Timestamps) {
        result.Timestamps = [];
      }

      // Ensure Values and Timestamps arrays are of equal length
      if (result.Values.length !== result.Timestamps.length) {
        throw new Error(`Mismatched array lengths for metric ${result.Id}: Values (${result.Values.length}) vs Timestamps (${result.Timestamps.length})`);
      }

      // Validate individual values
      result.Values = result.Values.map(value => {
        if (typeof value !== 'number' || isNaN(value)) {
          return 0;
        }
        return value;
      });
    }
  }

  static validateFunctionNames(functionNames: string[]): void {
    if (!Array.isArray(functionNames)) {
      throw new Error('Function names must be an array');
    }

    if (functionNames.length === 0) {
      throw new Error('No Lambda functions found. Please check your AWS credentials and region configuration.');
    }

    if (functionNames.some(name => typeof name !== 'string' || name.trim() === '')) {
      throw new Error('Invalid function names found. All function names must be non-empty strings.');
    }
  }
}