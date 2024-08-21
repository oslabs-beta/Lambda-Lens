import { AwsSdkSigV4AuthInputConfig, AwsSdkSigV4AuthResolvedConfig, AwsSdkSigV4PreviouslyResolved } from "@aws-sdk/core";
import { HandlerExecutionContext, HttpAuthScheme, HttpAuthSchemeParameters, HttpAuthSchemeParametersProvider, HttpAuthSchemeProvider } from "@smithy/types";
import { CloudWatchLogsClientResolvedConfig } from "../CloudWatchLogsClient";
/**
 * @internal
 */
export interface CloudWatchLogsHttpAuthSchemeParameters extends HttpAuthSchemeParameters {
    region?: string;
}
/**
 * @internal
 */
export interface CloudWatchLogsHttpAuthSchemeParametersProvider extends HttpAuthSchemeParametersProvider<CloudWatchLogsClientResolvedConfig, HandlerExecutionContext, CloudWatchLogsHttpAuthSchemeParameters, object> {
}
/**
 * @internal
 */
export declare const defaultCloudWatchLogsHttpAuthSchemeParametersProvider: (config: CloudWatchLogsClientResolvedConfig, context: HandlerExecutionContext, input: object) => Promise<CloudWatchLogsHttpAuthSchemeParameters>;
/**
 * @internal
 */
export interface CloudWatchLogsHttpAuthSchemeProvider extends HttpAuthSchemeProvider<CloudWatchLogsHttpAuthSchemeParameters> {
}
/**
 * @internal
 */
export declare const defaultCloudWatchLogsHttpAuthSchemeProvider: CloudWatchLogsHttpAuthSchemeProvider;
/**
 * @internal
 */
export interface HttpAuthSchemeInputConfig extends AwsSdkSigV4AuthInputConfig {
    /**
     * Configuration of HttpAuthSchemes for a client which provides default identity providers and signers per auth scheme.
     * @internal
     */
    httpAuthSchemes?: HttpAuthScheme[];
    /**
     * Configuration of an HttpAuthSchemeProvider for a client which resolves which HttpAuthScheme to use.
     * @internal
     */
    httpAuthSchemeProvider?: CloudWatchLogsHttpAuthSchemeProvider;
}
/**
 * @internal
 */
export interface HttpAuthSchemeResolvedConfig extends AwsSdkSigV4AuthResolvedConfig {
    /**
     * Configuration of HttpAuthSchemes for a client which provides default identity providers and signers per auth scheme.
     * @internal
     */
    readonly httpAuthSchemes: HttpAuthScheme[];
    /**
     * Configuration of an HttpAuthSchemeProvider for a client which resolves which HttpAuthScheme to use.
     * @internal
     */
    readonly httpAuthSchemeProvider: CloudWatchLogsHttpAuthSchemeProvider;
}
/**
 * @internal
 */
export declare const resolveHttpAuthSchemeConfig: <T>(config: T & HttpAuthSchemeInputConfig & AwsSdkSigV4PreviouslyResolved) => T & HttpAuthSchemeResolvedConfig;
