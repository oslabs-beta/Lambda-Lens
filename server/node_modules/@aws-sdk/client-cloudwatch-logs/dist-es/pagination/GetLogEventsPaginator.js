import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { GetLogEventsCommand, } from "../commands/GetLogEventsCommand";
export const paginateGetLogEvents = createPaginator(CloudWatchLogsClient, GetLogEventsCommand, "nextToken", "nextForwardToken", "limit");
