import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TCompositeCalendarMobileFooterProps = {
    applyDateRange: () => void;
    is_ok_btn_disabled?: boolean;
    onCancel: () => void;
};
const CompositeCalendarMobileFooter = ({
    applyDateRange,
    is_ok_btn_disabled = false,
    onCancel,
}: TCompositeCalendarMobileFooterProps) => {
    return (
        <div className='composite-calendar-mobile__actions'>
            <Button onClick={onCancel} has_effect secondary large>
                <Localize i18n_default_text='Cancel' />
            </Button>
            <Button onClick={applyDateRange} has_effect primary large disabled={is_ok_btn_disabled}>
                <Localize i18n_default_text='OK' />
            </Button>
        </div>
    );
};

export default CompositeCalendarMobileFooter;
