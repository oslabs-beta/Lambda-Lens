import { Paginator } from "@smithy/types";
import { ListLogAnomalyDetectorsCommandInput, ListLogAnomalyDetectorsCommandOutput } from "../commands/ListLogAnomalyDetectorsCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListLogAnomalyDetectors: (config: CloudWatchLogsPaginationConfiguration, input: ListLogAnomalyDetectorsCommandInput, ...rest: any[]) => Paginator<ListLogAnomalyDetectorsCommandOutput>;
