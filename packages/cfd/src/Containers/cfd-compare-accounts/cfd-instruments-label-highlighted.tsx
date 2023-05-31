import React from 'react';
import InstumentsIconWithLabel from './instruments-icon-with-label';
import { TTradingPlatformAvailableAccount, TIconData } from '../../Components/props.types';
import { getHighlightedIconLabel } from '../../Helpers/config';

type TCFDInstrumentsLabelHighlightedProps = {
    trading_platforms: TTradingPlatformAvailableAccount;
};

const CFDInstrumentsLabelHighlighted: React.FC<TCFDInstrumentsLabelHighlightedProps> = ({ trading_platforms }) => {
    const iconData: TIconData[] = [...getHighlightedIconLabel(trading_platforms)];

    return (
        <div className={'compare-cfd-account-outline'}>
            {iconData.map(item => (
                <InstumentsIconWithLabel
                    key={item.text}
                    icon={item.icon}
                    text={item.text}
                    highlighted={item.highlighted}
                />
            ))}
        </div>
    );
};

export default CFDInstrumentsLabelHighlighted;
