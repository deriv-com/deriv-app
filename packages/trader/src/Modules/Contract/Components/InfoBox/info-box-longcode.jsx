import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const generateMessage = (is_vanilla, contract_info) => {
    if (is_vanilla) {
        return (
            <Localize
                i18n_default_text='<0>For {{contract_type}}:</0> Earn payout if {{index_name}} is {{strike_status}} than the strike price at the expiry time. Your payout is zero if the market is {{market_status}} than the strike price at the expiry time'
                components={[<strong key={0} />]}
                values={{
                    contract_type:
                        contract_info.contract_type === 'VANILLALONGCALL' ? localize('Call') : localize('Put'),
                    index_name: contract_info.display_name,
                    strike_status:
                        contract_info.contract_type === 'VANILLALONGCALL' ? localize('higher') : localize('lower'),
                    market_status:
                        contract_info.contract_type === 'VANILLALONGCALL' ? localize('lower') : localize('higher'),
                }}
            />
        );
    }
    return contract_info.longcode;
};

const InfoBoxLongcode = ({ contract_info, is_vanilla }) => {
    return (
        <div className='info-box-longcode'>
            <Icon icon='IcContractFlag' className='info-box-longcode-icon' size={24} />
            <Text size='xs' className='info-box-longcode-text'>
                {is_vanilla ? generateMessage(is_vanilla, contract_info) : contract_info.longcode}
            </Text>
        </div>
    );
};

InfoBoxLongcode.propTypes = {
    contract_info: PropTypes.object,
    longcode: PropTypes.string,
};

export default observer(InfoBoxLongcode);
