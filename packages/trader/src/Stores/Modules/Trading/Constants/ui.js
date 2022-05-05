import Amount from 'Modules/Trading/Components/Form/TradeParams/amount.jsx';
import Barrier from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
import Duration from 'Modules/Trading/Components/Form/TradeParams/Duration';
import LastDigit from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';

export const form_components = [
    { name: 'duration', Component: Duration },
    { name: 'barrier', Component: Barrier },
    { name: 'last_digit', Component: LastDigit },
    { name: 'amount', Component: Amount },
];
