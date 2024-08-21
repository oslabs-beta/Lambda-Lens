import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { DescribeDestinationsCommand, } from "../commands/DescribeDestinationsCommand";
export const paginateDescribeDestinations = createPaginator(CloudWatchLogsClient, DescribeDestinationsCommand, "nextToken", "nextToken", "limit");
