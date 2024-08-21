import { Paginator } from "@smithy/types";
import {
  DescribeDeliveryDestinationsCommandInput,
  DescribeDeliveryDestinationsCommandOutput,
} from "../commands/DescribeDeliveryDestinationsCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeDeliveryDestinations: (
  config: CloudWatchLogsPaginationConfiguration,
  input: DescribeDeliveryDestinationsCommandInput,
  ...rest: any[]
) => Paginator<DescribeDeliveryDestinationsCommandOutput>;
