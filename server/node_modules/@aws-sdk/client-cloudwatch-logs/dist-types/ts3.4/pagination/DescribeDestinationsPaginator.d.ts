import { Paginator } from "@smithy/types";
import {
  DescribeDestinationsCommandInput,
  DescribeDestinationsCommandOutput,
} from "../commands/DescribeDestinationsCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeDestinations: (
  config: CloudWatchLogsPaginationConfiguration,
  input: DescribeDestinationsCommandInput,
  ...rest: any[]
) => Paginator<DescribeDestinationsCommandOutput>;
