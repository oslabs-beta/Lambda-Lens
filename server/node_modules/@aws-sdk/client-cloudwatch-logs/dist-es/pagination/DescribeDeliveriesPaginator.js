import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { DescribeDeliveriesCommand, } from "../commands/DescribeDeliveriesCommand";
export const paginateDescribeDeliveries = createPaginator(CloudWatchLogsClient, DescribeDeliveriesCommand, "nextToken", "nextToken", "limit");
