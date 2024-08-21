import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { ListAnomaliesCommand, } from "../commands/ListAnomaliesCommand";
export const paginateListAnomalies = createPaginator(CloudWatchLogsClient, ListAnomaliesCommand, "nextToken", "nextToken", "limit");
