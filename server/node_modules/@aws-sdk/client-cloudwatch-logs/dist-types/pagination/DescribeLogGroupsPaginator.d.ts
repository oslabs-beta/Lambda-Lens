import { Paginator } from "@smithy/types";
import { DescribeLogGroupsCommandInput, DescribeLogGroupsCommandOutput } from "../commands/DescribeLogGroupsCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateDescribeLogGroups: (config: CloudWatchLogsPaginationConfiguration, input: DescribeLogGroupsCommandInput, ...rest: any[]) => Paginator<DescribeLogGroupsCommandOutput>;
