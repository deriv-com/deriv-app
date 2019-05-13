import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '_common/localize';
import Localize     from 'App/Components/Elements/localize.jsx';
import Money        from 'App/Components/Elements/money.jsx';

const SellInfo = ({
    contract_info,
    sell_info,
}) => (
    <div className='sell-info'>
        <div>
            <Localize
                str='You have sold this contract at [_1]'
                replacers={{
                    '1': <Money
                        key={sell_info.transaction_id}
                        currency={contract_info.currency}
                        amount={sell_info.sell_price}
                    />,
                }}
            />
        </div>
        <div>{localize('Your transaction reference number is [_1]', [sell_info.transaction_id])}</div>
    </div>
);

SellInfo.propTypes = {
    contract_info: PropTypes.object,
    sell_info    : PropTypes.object,
};

export default observer(SellInfo);
