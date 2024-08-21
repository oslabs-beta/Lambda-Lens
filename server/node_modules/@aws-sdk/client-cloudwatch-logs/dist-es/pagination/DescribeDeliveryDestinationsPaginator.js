import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { DescribeDeliveryDestinationsCommand, } from "../commands/DescribeDeliveryDestinationsCommand";
export const paginateDescribeDeliveryDestinations = createPaginator(CloudWatchLogsClient, DescribeDeliveryDestinationsCommand, "nextToken", "nextToken", "limit");
