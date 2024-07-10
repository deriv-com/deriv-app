import React from 'react';
import { InlineMessage } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import { getInlineTextSize } from 'Utils/responsive';
import { useDevice } from '@deriv-com/ui';

const TemporarilyBarredHint = () => {
    const { general_store } = useStores();
    const { isMobile } = useDevice();

    if (general_store.is_barred) {
        return (
            <div className='temporarily-barred-hint' data-testid='dt_temporarily_barred_hint'>
                <InlineMessage
                    message={localize(
                        "You've been temporarily barred from using our services due to multiple cancellation attempts. Try again after {{date_time}} GMT.",
                        { date_time: general_store.blocked_until_date_time }
                    )}
                    size={getInlineTextSize('sm', 'xs', isMobile)}
                />
            </div>
        );
    }

    return null;
};

export default observer(TemporarilyBarredHint);
