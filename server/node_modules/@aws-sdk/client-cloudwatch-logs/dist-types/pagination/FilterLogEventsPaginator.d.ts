import { Paginator } from "@smithy/types";
import { FilterLogEventsCommandInput, FilterLogEventsCommandOutput } from "../commands/FilterLogEventsCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateFilterLogEvents: (config: CloudWatchLogsPaginationConfiguration, input: FilterLogEventsCommandInput, ...rest: any[]) => Paginator<FilterLogEventsCommandOutput>;
