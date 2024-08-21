import { Paginator } from "@smithy/types";
import {
  DescribeSubscriptionFiltersCommandInput,
  DescribeSubscriptionFiltersCommandOutput,
} from "../commands/DescribeSubscriptionFiltersCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeSubscriptionFilters: (
  config: CloudWatchLogsPaginationConfiguration,
  input: DescribeSubscriptionFiltersCommandInput,
  ...rest: any[]
) => Paginator<DescribeSubscriptionFiltersCommandOutput>;
