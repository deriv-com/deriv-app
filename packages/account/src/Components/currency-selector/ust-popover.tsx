import React from 'react';
import { Popover } from '@deriv/components';
import { Localize } from '@deriv/translations';

export type TUSTPopover = {
    id: string;
};

const USTPopover = ({ id }: TUSTPopover) => {
    let popover_message: React.ReactElement;
    if (/^UST$/i.test(id)) {
        popover_message = (
            <Localize
                i18n_default_text={
                    'Tether as an Omni token (USDT) is a version of Tether that is hosted on the Omni layer on the Bitcoin blockchain.'
                }
                components={[<br key={0} />]}
            />
        );
    } else if (/^tUSDT$/i.test(id)) {
        popover_message = (
            <Localize
                i18n_default_text={'Tether as a TRC20 token (tUSDT) is a version of Tether that is hosted on Tron.'}
            />
        );
    } else {
        popover_message = (
            <Localize
                i18n_default_text={
                    'Tether as an ERC20 token (eUSDT) is a version of Tether that is hosted on Ethereum.'
                }
            />
        );
    }

    return (
        <Popover
            alignment='top'
            className='currency-list__popover'
            disable_message_icon
            icon='info'
            is_bubble_hover_enabled
            message={popover_message}
            zIndex='9999'
        />
    );
};

export default USTPopover;
