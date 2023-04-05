import classNames from 'classnames';
import { TJurisdictionTitleIndicatorProps } from 'Containers/props.types';
import React from 'react';

const JurisdictionTitleIndicator = ({ title_indicators }: TJurisdictionTitleIndicatorProps) => {
    return title_indicators.type === 'displayText' ? (
        <div
            className={classNames(
                'cfd-card-section-title-indicator',
                `cfd-card-section-title-indicator__${title_indicators.display_text_skin_color}`
            )}
        >
            {title_indicators.display_text}
        </div>
    ) : (
        <div>{title_indicators.display_icons?.map(display_icon => display_icon)}</div>
    );
};
export default JurisdictionTitleIndicator;
