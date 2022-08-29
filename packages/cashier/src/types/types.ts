import { PingRequest, PingResponse, VerifyEmailRequest, VerifyEmailResponse } from '@deriv/api-types';

export type TSocketCallTypes = {
    ping: {
        request: PingRequest;
        response: PingResponse;
    };
    verify_email: {
        request: VerifyEmailRequest;
        response: VerifyEmailResponse;
    };
};

export type TEmailVerificationType = VerifyEmailRequest['type'];
