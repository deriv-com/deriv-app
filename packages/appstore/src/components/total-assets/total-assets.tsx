import React from 'react';
import { Popover, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { formatMoney } from '@deriv/shared';
import { TAccountCategory } from 'Types';

type TTotalAssets = {
    amount: string;
    currency: string;
    category: TAccountCategory;
    className?: string;
};

const TotalAssets = ({ amount, currency, category, className }: TTotalAssets) => {
    return (
        <div className={`total-assets ${className}`}>
            <Text weight='bold' className='total-assets-amount'>
                {formatMoney(currency, amount, true)}
            </Text>
            <Text weight='bold' className='total-assets-currency'>
                {currency}
            </Text>
            <div>
                <Popover
                    alignment='left'
                    className='total-assets-tooltip'
                    classNameBubble='total-assets-tooltip--msg'
                    icon='info'
                    disable_message_icon
                    is_bubble_hover_enabled
                    message={localize(`Total assets in your Options, DMT5 and Deriv X ${category} accounts`)}
                    zIndex={9999}
                />
            </div>
        </div>
    );
};

export default TotalAssets;
