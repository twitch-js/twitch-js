import pino, { LoggerOptions as PinoLoggerOptions } from 'pino';
/**
 * @see https://github.com/pinojs/pino/blob/v6.3.1/docs/api.md#options
 */
export declare type LoggerOptions = PinoLoggerOptions;
declare const createLogger: (options?: LoggerOptions) => pino.BaseLogger & {
    [key: string]: pino.LogFn;
} & {
    profile: (startMessage?: string | undefined) => {
        done: (endMessage: string, error?: any) => void;
    };
};
export declare type Logger = ReturnType<typeof createLogger>;
export default createLogger;
