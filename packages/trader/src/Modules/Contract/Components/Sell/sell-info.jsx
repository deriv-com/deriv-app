import { Money }              from 'deriv-components';
import { observer }           from 'mobx-react';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { localize, Localize } from 'deriv-translations';

const SellInfo = ({
    contract_info,
    sell_info,
}) => (
    <div className='sell-info'>
        <div>
            <Localize
                i18n_default_text='You have sold this contract at <0 />'
                components={[
                    <Money
                        key={sell_info.transaction_id}
                        currency={contract_info.currency}
                        amount={sell_info.sell_price}
                    />,
                ]}
            />
        </div>
        <div>{localize('Your transaction reference number is {{transaction_id}}', { transaction_id: sell_info.transaction_id })}</div>
    </div>
);

SellInfo.propTypes = {
    contract_info: PropTypes.object,
    sell_info    : PropTypes.object,
};

export default observer(SellInfo);
