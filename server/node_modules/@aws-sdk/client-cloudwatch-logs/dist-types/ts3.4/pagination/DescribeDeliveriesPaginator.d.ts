import { Paginator } from "@smithy/types";
import {
  DescribeDeliveriesCommandInput,
  DescribeDeliveriesCommandOutput,
} from "../commands/DescribeDeliveriesCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeDeliveries: (
  config: CloudWatchLogsPaginationConfiguration,
  input: DescribeDeliveriesCommandInput,
  ...rest: any[]
) => Paginator<DescribeDeliveriesCommandOutput>;
