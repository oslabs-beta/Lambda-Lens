import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { DescribeSubscriptionFiltersCommand, } from "../commands/DescribeSubscriptionFiltersCommand";
export const paginateDescribeSubscriptionFilters = createPaginator(CloudWatchLogsClient, DescribeSubscriptionFiltersCommand, "nextToken", "nextToken", "limit");
