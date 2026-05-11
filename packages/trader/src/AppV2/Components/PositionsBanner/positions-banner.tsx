import React from 'react';
import { useHistory } from 'react-router-dom';

import { LabelPairedChevronRightSmBoldIcon, LabelPairedCircleInfoSmRegularIcon } from '@deriv/quill-icons';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { CaptionText } from '@deriv-com/quill-ui';

const PositionsBanner = () => {
    const history = useHistory();

    const handleClick = () => {
        history.push(routes.trader_positions);
    };

    return (
        <button
            type='button'
            className='positions-banner'
            onClick={handleClick}
            aria-label='Review open positions before upgrade'
        >
            <LabelPairedCircleInfoSmRegularIcon
                className='positions-banner__info-icon'
                fill='var(--component-textIcon-normal-prominent)'
            />
            <CaptionText className='positions-banner__text'>
                <Localize i18n_default_text='System is upgrading. Close positions by 13 June.' />
            </CaptionText>
            <LabelPairedChevronRightSmBoldIcon
                className='positions-banner__chevron'
                fill='var(--component-textIcon-normal-prominent)'
            />
        </button>
    );
};

export default PositionsBanner;
