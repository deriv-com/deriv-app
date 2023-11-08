import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { getAuthenticationStatusInfo } from '@deriv/shared';
import { jurisdictionVerificationContents } from '../../Constants/jurisdiction-contents/jurisdiction-verification-contents';
import { TJurisdictionTitleIndicatorProps } from 'Containers/props.types';
import { TJurisdictionCardItemVerificationItem, TJurisdictionCardVerificationStatus } from 'Components/props.types';
import { JURISDICTION } from '../../Helpers/cfd-config';

const JurisdictionTitleIndicator = ({
    account_status,
    title_indicators,
    type_of_card,
    verification_docs,
}: TJurisdictionTitleIndicatorProps) => {
    const {
        poi_pending_for_bvi_labuan_vanuatu,
        poi_resubmit_for_bvi_labuan_vanuatu,
        poi_verified_for_bvi_labuan_vanuatu,
        poi_pending_for_maltainvest,
        poi_resubmit_for_maltainvest,
        poi_verified_for_maltainvest,
        poa_pending,
        need_poa_resubmission,
        poa_verified,
    } = getAuthenticationStatusInfo(account_status);

    const getVerificationIconVariant = (verification_document: TJurisdictionCardItemVerificationItem): string => {
        let icon_variant: TJurisdictionCardVerificationStatus = 'Default';
        if (
            type_of_card === JURISDICTION.BVI ||
            type_of_card === JURISDICTION.LABUAN ||
            type_of_card === JURISDICTION.VANUATU
        ) {
            if (['document_number', 'selfie', 'identity_document'].includes(verification_document)) {
                if (poi_pending_for_bvi_labuan_vanuatu) {
                    icon_variant = 'Pending';
                } else if (poi_resubmit_for_bvi_labuan_vanuatu) {
                    icon_variant = 'Failed';
                } else if (poi_verified_for_bvi_labuan_vanuatu) {
                    icon_variant = 'Verified';
                }
            }
        } else if (type_of_card === JURISDICTION.MALTA_INVEST) {
            if (['document_number', 'selfie', 'identity_document'].includes(verification_document)) {
                if (poi_pending_for_maltainvest) {
                    icon_variant = 'Pending';
                } else if (poi_resubmit_for_maltainvest) {
                    icon_variant = 'Failed';
                } else if (poi_verified_for_maltainvest) {
                    icon_variant = 'Verified';
                }
            }
        }
        if (verification_document === 'name_and_address') {
            if (poa_pending) {
                icon_variant = 'Pending';
            } else if (need_poa_resubmission) {
                icon_variant = 'Failed';
            } else if (poa_verified) {
                icon_variant = 'Verified';
            }
        }
        return icon_variant;
    };

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
        <div
            data-testid='dt_jurisdiction_title_indicator_icon'
            className='cfd-card-section-title-indicator-icon-container'
        >
            {verification_docs?.map(verification_document => (
                <div
                    data-testid={`dt_jurisdiction_title_indicator_${getVerificationIconVariant(
                        verification_document
                    )}_icon`}
                    key={verification_document}
                >
                    <Icon
                        size={24}
                        icon={jurisdictionVerificationContents().required_verification_docs[
                            verification_document
                        ]?.icon.concat(getVerificationIconVariant(verification_document))}
                    />
                </div>
            ))}
        </div>
    );
};

export default JurisdictionTitleIndicator;
