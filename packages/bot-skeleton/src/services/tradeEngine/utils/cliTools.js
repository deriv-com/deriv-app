import ws from '../../api/ws';

export const initial_scope = {
    api: ws,
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

export const createScope = () => {
    return initial_scope;
};

const $scope = createScope();

export default $scope;
