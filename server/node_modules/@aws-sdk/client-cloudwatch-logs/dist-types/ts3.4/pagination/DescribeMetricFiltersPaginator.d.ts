import { Paginator } from "@smithy/types";
import {
  DescribeMetricFiltersCommandInput,
  DescribeMetricFiltersCommandOutput,
} from "../commands/DescribeMetricFiltersCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeMetricFilters: (
  config: CloudWatchLogsPaginationConfiguration,
  input: DescribeMetricFiltersCommandInput,
  ...rest: any[]
) => Paginator<DescribeMetricFiltersCommandOutput>;
