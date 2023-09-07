import { Buy, BuyContractResponse, BuyContractRequest } from '@deriv/api-types';
import { WS } from '@deriv/shared';

type TResponse = BuyContractResponse & {
    echo_req: Buy;
    error?: {
        code: string;
        message: string;
        details?: BuyContractResponse['buy'] & { field: string };
    };
};

export const processPurchase = async (
    proposal_id: string,
    price: string | number,
    passthrough?: BuyContractRequest['passthrough']
): Promise<TResponse> =>
    WS.buy({
        proposal_id,
        price,
        ...(passthrough && { passthrough }),
    });
