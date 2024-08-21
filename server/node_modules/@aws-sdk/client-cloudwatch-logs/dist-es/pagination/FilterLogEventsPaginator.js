import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { FilterLogEventsCommand, } from "../commands/FilterLogEventsCommand";
export const paginateFilterLogEvents = createPaginator(CloudWatchLogsClient, FilterLogEventsCommand, "nextToken", "nextToken", "limit");
