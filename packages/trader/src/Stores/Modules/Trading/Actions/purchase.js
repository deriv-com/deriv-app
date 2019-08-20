import { WS } from 'Services';

export const processPurchase = async(proposal_id, price) =>
    WS.buyAndSubscribe(proposal_id, price);
