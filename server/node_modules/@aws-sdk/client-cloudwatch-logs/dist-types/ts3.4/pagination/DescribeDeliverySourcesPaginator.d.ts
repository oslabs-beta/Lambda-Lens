import { Paginator } from "@smithy/types";
import {
  DescribeDeliverySourcesCommandInput,
  DescribeDeliverySourcesCommandOutput,
} from "../commands/DescribeDeliverySourcesCommand";
import { CloudWatchLogsPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeDeliverySources: (
  config: CloudWatchLogsPaginationConfiguration,
  input: DescribeDeliverySourcesCommandInput,
  ...rest: any[]
) => Paginator<DescribeDeliverySourcesCommandOutput>;
