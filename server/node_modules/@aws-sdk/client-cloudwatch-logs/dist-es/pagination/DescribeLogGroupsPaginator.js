import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { DescribeLogGroupsCommand, } from "../commands/DescribeLogGroupsCommand";
export const paginateDescribeLogGroups = createPaginator(CloudWatchLogsClient, DescribeLogGroupsCommand, "nextToken", "nextToken", "limit");
