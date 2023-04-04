import classNames from 'classnames';
import { TJurisdictionTitleIndicatorProps } from 'Containers/props.types';
import React from 'react';

const JurisdictionTitleIndicator = ({ title_indicators }: TJurisdictionTitleIndicatorProps) => {
    if (title_indicators.type === 'displayText') {
        return (
            <div
                className={classNames(
                    'cfd-card-section-title-indicator',
                    `cfd-card-section-title-indicator__${title_indicators.displayTextSkinColor}`
                )}
            >
                {title_indicators.displayText}
            </div>
        );
    }
    return <React.Fragment />;
};
export default JurisdictionTitleIndicator;
