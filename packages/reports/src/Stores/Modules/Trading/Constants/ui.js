import Amount from '../Components/amount.jsx';
import Barrier from '../Components/barrier.jsx';
import Duration from '../Components/Duration';
import LastDigit from '../Components/last-digit.jsx';

export const form_components = [
    { name: 'duration', Component: Duration },
    { name: 'barrier', Component: Barrier },
    { name: 'last_digit', Component: LastDigit },
    { name: 'amount', Component: Amount },
];
