import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { DescribeMetricFiltersCommand, } from "../commands/DescribeMetricFiltersCommand";
export const paginateDescribeMetricFilters = createPaginator(CloudWatchLogsClient, DescribeMetricFiltersCommand, "nextToken", "nextToken", "limit");
