import { createPaginator } from "@smithy/core";
import { CloudWatchLogsClient } from "../CloudWatchLogsClient";
import { ListLogAnomalyDetectorsCommand, } from "../commands/ListLogAnomalyDetectorsCommand";
export const paginateListLogAnomalyDetectors = createPaginator(CloudWatchLogsClient, ListLogAnomalyDetectorsCommand, "nextToken", "nextToken", "limit");
