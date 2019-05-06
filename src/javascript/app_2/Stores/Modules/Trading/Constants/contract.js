import { localize } from '_common/localize';

export const getLocalizedBasis = () => ({
    payout    : localize('Payout'),
    stake     : localize('Stake'),
    multiplier: localize('Multiplier'),
});

/**
 * components can be undef or an array containing any of: 'start_date', 'barrier', 'last_digit'
 *     ['duration', 'amount'] are omitted, as they're available in all contract types
 */
export const getContractTypesConfig = () => (
    {
        rise_fall      : { title: localize('Rise/Fall'),                  trade_types: ['CALL', 'PUT'],               basis: ['stake', 'payout'], components: ['start_date'], barrier_count: 0 },
        rise_fall_equal: { title: localize('Rise/Fall'),                  trade_types: ['CALLE', 'PUTE'],             basis: ['stake', 'payout'], components: ['start_date'], barrier_count: 0 },
        high_low       : { title: localize('Higher/Lower'),               trade_types: ['CALL', 'PUT'],               basis: ['stake', 'payout'], components: ['barrier'],    barrier_count: 1 },
        touch          : { title: localize('Touch/No Touch'),             trade_types: ['ONETOUCH', 'NOTOUCH'],       basis: ['stake', 'payout'], components: ['barrier'] },
        end            : { title: localize('Ends Between/Ends Outside'),  trade_types: ['EXPIRYMISS', 'EXPIRYRANGE'], basis: ['stake', 'payout'], components: ['barrier'] },
        stay           : { title: localize('Stays Between/Goes Outside'), trade_types: ['RANGE', 'UPORDOWN'],         basis: ['stake', 'payout'], components: ['barrier'] },
        asian          : { title: localize('Asians'),                     trade_types: ['ASIANU', 'ASIAND'],          basis: ['stake', 'payout'], components: [] },
        match_diff     : { title: localize('Matches/Differs'),            trade_types: ['DIGITMATCH', 'DIGITDIFF'],   basis: ['stake', 'payout'], components: ['last_digit'] },
        even_odd       : { title: localize('Even/Odd'),                   trade_types: ['DIGITODD', 'DIGITEVEN'],     basis: ['stake', 'payout'], components: [] },
        over_under     : { title: localize('Over/Under'),                 trade_types: ['DIGITOVER', 'DIGITUNDER'],   basis: ['stake', 'payout'], components: ['last_digit'] },
        lb_call        : { title: localize('Close-Low'),                  trade_types: ['LBFLOATCALL'],               basis: ['multiplier'],      components: [] },
        lb_put         : { title: localize('High-Close'),                 trade_types: ['LBFLOATPUT'],                basis: ['multiplier'],      components: [] },
        lb_high_low    : { title: localize('High-Low'),                   trade_types: ['LBHIGHLOW'],                 basis: ['multiplier'],      components: [] },
    }
);

export const getContractCategoriesConfig = () => (
    {
        [localize('Up/Down')]       : ['rise_fall', 'rise_fall_equal', 'high_low'],
        [localize('Touch/No Touch')]: ['touch'],
        [localize('In/Out')]        : ['end', 'stay'],
        [localize('Asians')]        : ['asian'],
        [localize('Digits')]        : ['match_diff', 'even_odd', 'over_under'],
        // [localize('Lookback')]      : ['lb_call', 'lb_put', 'lb_high_low'],
    }
);
