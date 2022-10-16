const containers = {
    account_transfer: 'account_transfer',
    deposit: 'deposit',
    payment_agent: 'payment_agent',
    payment_agent_transfer: 'payment_agent_transfer',
    withdraw: 'withdraw',
};

const map_action = {
    withdraw: 'payment_withdraw',
    payment_agent: 'payment_agent_withdraw',
};

export default { containers, map_action };
