import React from 'react';
import ReactDOM from 'react-dom';
import { MobileWrapper, Toast, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { findContractCategory } from 'Modules/Trading/Helpers/contract-type';
import { observer, useStore } from '@deriv/stores';

type TContractType = {
    text: string;
    value: string;
};

const BuyToastNotification = observer(() => {
    const portal = document.getElementById('popup_root');
    const { modules } = useStore();
    const { trade } = modules;
    const { contract_purchase_toast_box, clearContractPurchaseToastBox } = trade;

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            clearContractPurchaseToastBox();
        }, 4000);

        return () => {
            clearTimeout(timeout);
        };
    }, [clearContractPurchaseToastBox, contract_purchase_toast_box]);

    if (!portal || !contract_purchase_toast_box) return <React.Fragment />;

    const { buy_price, currency, contract_type, list } = contract_purchase_toast_box;
    const active_trade_type = { value: contract_type };

    const trade_type_name = findContractCategory(list, active_trade_type)?.contract_types?.find(
        (item: TContractType) => item.value === contract_type
    ).text;

    return ReactDOM.createPortal(
        <MobileWrapper>
            <Toast
                className='dc-toast-popup-mobile'
                is_open={!!contract_purchase_toast_box.key}
                timeout={0}
                type='notification'
            >
                <Text as='p' size='xxs' className='dc-toast__notification'>
                    <Localize
                        i18n_default_text='The purchase of <0>{{trade_type_name}} contract</0> has been completed successfully for the amount of <0> {{buy_price}} {{currency}}</0>'
                        components={[<strong key={0} />]}
                        values={{ trade_type_name, buy_price, currency }}
                        shouldUnescape
                    />
                </Text>
            </Toast>
        </MobileWrapper>,
        portal
    );
});

export default BuyToastNotification;
