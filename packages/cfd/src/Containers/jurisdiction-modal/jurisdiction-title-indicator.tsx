import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { TJurisdictionTitleIndicatorProps } from 'Containers/props.types';

const JurisdictionTitleIndicator = ({ title_indicators }: TJurisdictionTitleIndicatorProps) => {
    return title_indicators.type === 'displayText' ? (
        <Text
            as='span'
            color='colored-background'
            weight='bold'
            align='center'
            size='xxxs'
            className={classNames(
                'cfd-card-section-title-indicator',
                `cfd-card-section-title-indicator__${title_indicators.display_text_skin_color}`
            )}
        >
            {title_indicators.display_text}
        </Text>
    ) : (
        <div>{title_indicators.display_icons?.map(display_icon => display_icon)}</div>
    );
};
export default JurisdictionTitleIndicator;
