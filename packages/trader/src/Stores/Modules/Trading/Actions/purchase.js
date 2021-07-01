import { WS } from '@deriv/shared';

export const processPurchase = async (proposal_id, price, passthrough) =>
    WS.buy({
        proposal_id,
        price,
        ...(passthrough && { passthrough }),
    });
