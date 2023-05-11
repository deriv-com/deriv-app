import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isVanillaContract } from '@deriv/shared';
import { vanilla_financials } from 'Constants/trade-categories';

const generateMessageForVanillaTrade = contract_info => (
    <Localize
        i18n_default_text='<0>For {{contract_type}}:</0> Your payout will grow by {{number_of_contracts}} for every {{payout_unit}} {{strike_status}} your strike price at the expiry time. You will start making a profit when the payout is higher than your stake.'
        components={[<strong key={0} />]}
        values={{
            contract_type: contract_info.contract_type === 'VANILLALONGCALL' ? localize('Call') : localize('Put'),
            strike_status: contract_info.contract_type === 'VANILLALONGCALL' ? localize('above') : localize('below'),
            payout_unit: vanilla_financials.includes(contract_info.underlying) ? localize('pip') : localize('point'),
            number_of_contracts: contract_info.number_of_contracts,
        }}
    />
);

const InfoBoxLongcode = ({ contract_info }) => {
    const is_vanilla = isVanillaContract(contract_info.contract_type);
    return (
        <div className='info-box-longcode'>
            <Icon icon='IcContractFlag' className='info-box-longcode-icon' size={24} />
            <Text size='xs' className='info-box-longcode-text'>
                {is_vanilla ? generateMessageForVanillaTrade(contract_info) : contract_info.longcode}
            </Text>
        </div>
    );
};

InfoBoxLongcode.propTypes = {
    contract_info: PropTypes.object,
    longcode: PropTypes.string,
    is_vanilla: PropTypes.bool,
};

export default observer(InfoBoxLongcode);
