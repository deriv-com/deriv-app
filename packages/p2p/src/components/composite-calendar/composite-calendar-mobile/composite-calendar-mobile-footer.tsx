import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';

type TCompositeCalendarMobileFooterProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    applyDateRange: () => void;
};
const CompositeCalendarMobileFooter = ({ applyDateRange, setIsOpen }: TCompositeCalendarMobileFooterProps) => {
    return (
        <div className='composite-calendar-mobile__actions'>
            <Button onClick={() => setIsOpen(false)} has_effect secondary large>
                <Localize i18n_default_text='Cancel' />
            </Button>
            <Button onClick={applyDateRange} has_effect primary large>
                <Localize i18n_default_text='OK' />
            </Button>
        </div>
    );
};

export default CompositeCalendarMobileFooter;
