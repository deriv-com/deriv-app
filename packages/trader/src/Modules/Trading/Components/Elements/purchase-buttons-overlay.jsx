import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

const PurchaseButtonsOverlay = ({ is_to_cover_one_button = false, message }) => {
    const desktop_text_size = is_to_cover_one_button ? 'xxs' : 'xs';
    return (
        <div
            data-testid='dt_purchase_button_overlay'
            className={classNames('purchase-buttons-overlay', {
                'purchase-buttons-overlay__one-button': !isMobile() && is_to_cover_one_button,
            })}
        >
            <Text
                weight='bold'
                size={isMobile() ? 'xxs' : desktop_text_size}
                className='purchase-buttons-overlay__caption'
            >
                {message}
            </Text>
        </div>
    );
};

export default React.memo(PurchaseButtonsOverlay);
