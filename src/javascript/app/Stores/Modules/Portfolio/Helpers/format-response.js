import { getUnsupportedContracts } from 'Constants';

export const formatPortfolioPosition = (portfolio_pos) => {
    const purchase = parseFloat(portfolio_pos.buy_price);
    const payout   = parseFloat(portfolio_pos.payout);

    return {
        contract_info : portfolio_pos,
        details       : portfolio_pos.longcode.replace(/\n/g, '<br />'),
        id            : portfolio_pos.contract_id,
        indicative    : 0,
        payout,
        purchase,
        reference     : +portfolio_pos.transaction_id,
        type          : portfolio_pos.contract_type,
        is_unsupported: !!getUnsupportedContracts()[portfolio_pos.contract_type],
    };
};
