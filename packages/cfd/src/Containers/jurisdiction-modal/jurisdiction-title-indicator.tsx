import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { getAuthenticationStatusInfo } from '@deriv/shared';
import { jurisdictionVerificationContents } from 'Constants/jurisdiction-contents/jurisdiction-verification-contents';
import { TJurisdictionTitleIndicatorProps } from 'Containers/props.types';

const JurisdictionTitleIndicator = ({
    account_status,
    title_indicators,
    type_of_card,
    verification_docs,
}: TJurisdictionTitleIndicatorProps) => {
    const verification_icon_variant = 'Default';
    const {
        poi_resubmit_for_bvi_labuan,
        poi_resubmit_for_vanuatu_maltainvest,
        poi_pending_for_bvi_labuan,
        poi_pending_for_vanuatu_maltainvest,
        poi_verified_for_bvi_labuan,
        poi_verified_for_vanuatu_maltainvest,
        poi_poa_verified_for_bvi_labuan,
        poi_poa_verified_for_vanuatu_maltainvest,
    } = getAuthenticationStatusInfo(account_status);

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
                        size={24}
                        icon={jurisdictionVerificationContents().required_verification_docs[
                            verification_doc
                        ]?.icon.concat(verification_icon_variant)}
                    />
                </div>
            ))}
        </div>
    );
};

export default JurisdictionTitleIndicator;
