import { WS } from 'Services/ws-methods';

export const processPurchase = async (proposal_id, price, passthrough) =>
    WS.buy({
        proposal_id,
        price,
        ...(passthrough && { passthrough }),
    });
