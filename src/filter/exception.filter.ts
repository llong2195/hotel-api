import { isString } from 'class-validator';
import { FastifyReply as Response, FastifyRequest as Request } from 'fastify';
import { ErrorCodes } from 'src/constants/error-code.const';
import { BaseError } from 'src/exceptions/errors/base.error';
import { DatabaseError } from 'src/exceptions/errors/database.error';
import { isDebug } from 'src/utils/general.util';
import { QueryFailedError } from 'typeorm';

import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';

@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(
        // private readonly sentryService: SentryService,
        private readonly configService: ConfigService,
    ) {}

    private static handleResponse(
        response: Response,
        exception: HttpException | DatabaseError | QueryFailedError | Error | BaseError,
    ): [number, number] {
        let responseBody: unknown = { message: 'Internal server error' };
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorCode: number;

        if (exception instanceof ForbiddenException) {
            statusCode = exception.getStatus();
            errorCode = ErrorCodes.INVALID_HEADERS;
            if (isDebug()) {
                responseBody = {
                    message: 'Invalid Header',
                    errorCode: errorCode,
                    cause: exception.message + ': Invalid Header',
                };
            } else {
                responseBody = {
                    message: 'Invalid Header',
                    errorCode: errorCode,
                };
            }
        } else if (exception instanceof HttpException) {
            const response = exception.getResponse();
            // const i18n = new MessageComponent()

            let message: unknown;
            let cause: unknown;

            if (isString(response)) {
                message = response;
                errorCode = ErrorCodes.UNKNOWN;
                cause = '';
            } else {
                const res = response as Record<string, unknown>;

                message = res.message || 'Unknown error';
                errorCode = (res.errorCode as number) || ErrorCodes.UNKNOWN;
                cause = res.cause || '';
            }

            if (isDebug()) {
                responseBody = {
                    message: message.toString(),
                    errorCode: errorCode,
                    cause,
                };
            } else {
                responseBody = {
                    message: message.toString(),
                    errorCode: errorCode,
                };
            }

            statusCode = exception.getStatus();
        } else if (exception instanceof DatabaseError) {
            statusCode = HttpStatus.BAD_REQUEST;
            errorCode = exception.getErrorCode();
            if (isDebug()) {
                responseBody = {
                    errorCode: errorCode,
                    message: exception.message,
                    cause: exception.getCause(),
                };
            } else {
                responseBody = {
                    errorCode: errorCode,
                    message: exception.message,
                };
            }
        } else if (exception instanceof BaseError) {
            statusCode = HttpStatus.BAD_REQUEST;
            errorCode = exception.getErrorCode();
            if (isDebug()) {
                responseBody = {
                    errorCode,
                    message: exception.message,
                    cause: exception.getCause(),
                };
            } else {
                responseBody = {
                    errorCode,
                    message: exception.message,
                };
            }
        } else if (exception instanceof QueryFailedError) {
            statusCode = HttpStatus.BAD_REQUEST;
            errorCode = ErrorCodes.UNKNOWN;
            responseBody = {
                errorCode,
                message: exception.message,
            };

            if (isDebug()) {
                responseBody = {
                    errorCode,
                    message: 'Query database error.',
                    cause: exception,
                };
            } else {
                responseBody = {
                    errorCode,
                    message: 'Query database error.',
                };
            }
        } else if (exception instanceof Error) {
            errorCode = ErrorCodes.UNKNOWN;
            if (isDebug()) {
                responseBody = {
                    errorCode,
                    message: 'An error occurred, please try again.',
                    cause: exception.message,
                };
            } else {
                responseBody = {
                    errorCode,
                    message: 'An error occurred, please try again',
                };
            }
        }

        void response.status(statusCode).send(responseBody);
        return [statusCode, errorCode];
    }

    catch(exception: HttpException | Error, host: ArgumentsHost): void {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response = ctx.getResponse();

        const [statusCode, errorCode] = AllExceptionFilter.handleResponse(response, exception);

        if (errorCode !== 9104 && errorCode !== 1011 && errorCode !== 7200 && errorCode !== 7201) {
        }
    }

    /**
     * @param exception
     */
    private handleMessage(exception: HttpException | DatabaseError | QueryFailedError | Error): string {
        let message = 'Internal Server Error';

        if (exception instanceof HttpException) {
            message = JSON.stringify(exception.getResponse());
        } else if (exception instanceof DatabaseError) {
            message = exception.message;
        } else if (exception instanceof QueryFailedError) {
            message = exception.stack.toString();
        } else if (exception instanceof Error) {
            message = exception.stack.toString();
        }

        return message;
    }
}
