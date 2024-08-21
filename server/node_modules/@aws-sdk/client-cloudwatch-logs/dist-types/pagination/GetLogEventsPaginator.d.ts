import { Paginator } from "@smithy/types";
import { GetLogEventsCommandInput, GetLogEventsCommandOutput } from "../commands/GetLogEventsCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateGetLogEvents: (config: CloudWatchLogsPaginationConfiguration, input: GetLogEventsCommandInput, ...rest: any[]) => Paginator<GetLogEventsCommandOutput>;
