const Contract = require('./contract');
const Defaults = require('./defaults');
const localize = require('../../../_common/localize').localize;

/**
 * Handles lookback option form
 */
const Lookback = (() => {
    const displayLookback = () => {
        const multiplier_element    = document.getElementById('multiplier_row');
        const multiplier_input      = document.getElementById('multiplier');
        const payout_element        = document.getElementById('payout_row');

        if (Contract.form() === 'lookback') {
            multiplier_element.show();
            payout_element.hide(); // Hide payout
            if (Defaults.get('multiplier')) {
                multiplier_input.value = Defaults.get('multiplier');
            } else {
                Defaults.set('multiplier', multiplier_input.value);
            }
        } else {
            multiplier_element.hide();
            payout_element.show(); // Show payout
        }
    };

    const getFormula = (type = '', mul) => {
        const formulaMapping = {
            LBFLOATPUT : `${mul} x (${localize('High')} - ${localize('Close')})`,
            LBFLOATCALL: `${mul} x (${localize('Close')} - ${localize('Low')})`,
            LBHIGHLOW  : `${mul} x (${localize('High')} - ${localize('Low')})`,
        };

        return formulaMapping[type.toUpperCase()];
    };

    const isLookback = (type) => /^(LBFLOATCALL|LBFLOATPUT|LBHIGHLOW)$/.test(type);

    const getBarrierLabel = (type) => {
        const barrier_map = {
            LBFLOATCALL: localize(['Low']),
            LBFLOATPUT : localize(['High']),
            LBHIGHLOW  : localize(['High', 'Low']),
        };
        return barrier_map[type] || localize(['Barrier']);
    };

    return {
        display: displayLookback,
        getFormula,
        isLookback,
        getBarrierLabel,
    };
})();

module.exports = Lookback;
