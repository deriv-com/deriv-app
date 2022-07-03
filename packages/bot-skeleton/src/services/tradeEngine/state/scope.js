export const initial_scope = {
    balance: 0,
    contract_flags: {
        is_sold: false,
        is_sell_available: false,
        is_expired: false,
    },
    contract_id: '',
    session: {
        runs: 0,
        profit: 0,
    },
    stopped: false,
    symbol: '',
    token: '',
    open_contract_id: '',
    options: {},
    trade_option: {},
    proposal_templates: [],
    data: {
        contract: {},
        proposals: [],
        forget_proposal_ids: [],
    },
    purchase_reference: '',
    transaction_recovery_timeout: '',
    initArgs: {},
};

const createScope = () => {
    return initial_scope;
};

export const $scope = createScope();
