import { Paginator } from "@smithy/types";
import { ListAnomaliesCommandInput, ListAnomaliesCommandOutput } from "../commands/ListAnomaliesCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListAnomalies: (config: CloudWatchLogsPaginationConfiguration, input: ListAnomaliesCommandInput, ...rest: any[]) => Paginator<ListAnomaliesCommandOutput>;
