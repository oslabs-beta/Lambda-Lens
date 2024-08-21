import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { DescribeLogStreamsCommand, } from "../commands/DescribeLogStreamsCommand";
export const paginateDescribeLogStreams = createPaginator(CloudWatchLogsClient, DescribeLogStreamsCommand, "nextToken", "nextToken", "limit");
