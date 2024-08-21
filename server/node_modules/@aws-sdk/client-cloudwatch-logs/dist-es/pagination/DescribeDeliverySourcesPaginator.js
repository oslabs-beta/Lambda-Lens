import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { DescribeDeliverySourcesCommand, } from "../commands/DescribeDeliverySourcesCommand";
export const paginateDescribeDeliverySources = createPaginator(CloudWatchLogsClient, DescribeDeliverySourcesCommand, "nextToken", "nextToken", "limit");
