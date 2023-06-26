import { Buy, BuyContractRequest } from '@deriv/api-types';
import { WS } from '@deriv/shared';

export const processPurchase = async (
    proposal_id: string,
    price: BuyContractRequest['price'],
    passthrough: BuyContractRequest['passthrough']
): Promise<Buy> =>
    WS.buy({
        proposal_id,
        price,
        ...(passthrough && { passthrough }),
    });
