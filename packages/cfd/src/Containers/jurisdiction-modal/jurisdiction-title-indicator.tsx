import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { jurisdictionVerificationContents } from 'Constants/jurisdiction-contents/jurisdiction-verification-contents';
import { TJurisdictionTitleIndicatorProps } from 'Containers/props.types';

const JurisdictionTitleIndicator = ({ title_indicators, verification_docs }: TJurisdictionTitleIndicatorProps) => {
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
        <div className='cfd-card-section-title-indicator-icon-container'>
            {verification_docs?.map(verification_doc => (
                <div key={verification_doc}>
                    <Icon
                        icon={jurisdictionVerificationContents().required_verification_docs[verification_doc]?.icon}
                    />
                </div>
            ))}
        </div>
    );
};

export default JurisdictionTitleIndicator;
