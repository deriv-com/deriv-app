import { observer } from 'mobx-react';
import React from 'react';
import { Money } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

type SellInfoProps = {
    contract_info: unknown;
    sell_info: unknown;
};

const SellInfo = ({ contract_info, sell_info }: SellInfoProps) => (
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
        <div>
            {localize('Your transaction reference number is {{transaction_id}}', {
                transaction_id: sell_info.transaction_id,
            })}
        </div>
    </div>
);

export default observer(SellInfo);
