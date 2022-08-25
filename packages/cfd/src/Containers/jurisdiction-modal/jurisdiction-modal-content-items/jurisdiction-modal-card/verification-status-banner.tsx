import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import { TVerificationStatusBannerProps } from 'Containers/props.types';
import { getAuthenticationStatusInfo } from '@deriv/shared';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const VerificationStatusBanner = ({
    account_status,
    account_type,
    card_classname,
    disabled,
    is_fully_authenticated,
    is_virtual,
    type_of_card,
}: TVerificationStatusBannerProps) => {
    const {
        poi_not_submitted_for_vanuatu,
        poi_or_poa_not_submitted,
        poi_verified_for_vanuatu,
        poi_verified_for_bvi_labuan_maltainvest,
        poi_pending_for_bvi_labuan_maltainvest,
        poi_pending_for_vanuatu,
        poi_resubmit_for_vanuatu,
        poi_resubmit_for_bvi_labuan_maltainvest,
    } = getAuthenticationStatusInfo(account_status);

    const getAccountTitle = () => {
        switch (account_type) {
            case 'synthetic':
                return 'Synthetic';
            case 'financial':
                return 'Financial';
            default:
                return '';
        }
    };

    const is_svg = type_of_card && type_of_card === 'svg';
    const is_vanuatu = type_of_card && type_of_card === 'vanuatu';
    const is_regulated_except_vanuatu =
        type_of_card && (type_of_card === 'bvi' || type_of_card === 'labuan' || type_of_card === 'maltainvest');

    const getTypeTitle = () => {
        switch (type_of_card) {
            case 'bvi':
                return 'BVI';
            case 'vanuatu':
                return 'Vanuatu';
            case 'labuan':
                return 'STP';
            default:
                return '';
        }
    };
    if (is_virtual && is_svg) {
        return (
            <div className={`${card_classname}__footer--none`}>
                <Text as='p' size='xxxs' align='center' color='prominent'>
                    <Localize
                        i18n_default_text='Switch to your real account to create a DMT5 {{account_title}} {{type_title}} account.'
                        values={{
                            account_title: getAccountTitle(),
                            type_title: getTypeTitle(),
                        }}
                    />
                </Text>
            </div>
        );
    } else if (disabled) {
        // account not added
        return (
            <div className={`${card_classname}__verification-status`}>
                <div className={`${card_classname}__verification-status--account_added`}>
                    <Text size='xxxs' weight='bold' color='colored-background'>
                        <Localize i18n_default_text='Account added' />
                    </Text>
                </div>
            </div>
        );
    } else if (is_svg) {
        if (!is_fully_authenticated)
            return (
                <div className={`${card_classname}__footer`}>
                    <Text size={'xxxs'} color='less-prominent'>
                        <Localize i18n_default_text='You will need to submit proof of identity and address once you reach certain thresholds' />
                    </Text>
                </div>
            );

        return null;
    } else if (poi_or_poa_not_submitted) {
        // if poi or poa is not submitted
        return (
            <div className={`${card_classname}__footer--none`}>
                <Text as='p' size='xxs' align='center' color='prominent'>
                    <Localize i18n_default_text='Proof of identity and address are required' />
                </Text>
            </div>
        );
    } else if (
        (is_vanuatu && poi_verified_for_vanuatu) ||
        (is_regulated_except_vanuatu && poi_verified_for_bvi_labuan_maltainvest)
    ) {
        return (
            <div className={`${card_classname}__verification-status`}>
                <div className={`${card_classname}__verification-status--poi_verified`}>
                    <Text size='xxxs' color='colored-background'>
                        <Localize i18n_default_text='You are verified to add this account' />
                    </Text>
                </div>
            </div>
        );
    } else if (is_vanuatu && poi_not_submitted_for_vanuatu) {
        return (
            <div className={`${card_classname}__footer--none`}>
                <Text as='p' size='xxs' align='center' color='prominent'>
                    <Localize i18n_default_text='You will need to submit proof of identity' />
                </Text>
            </div>
        );
    } else if (
        (is_vanuatu && poi_pending_for_vanuatu) ||
        (is_regulated_except_vanuatu && poi_pending_for_bvi_labuan_maltainvest)
    ) {
        return (
            <div className={`${card_classname}__verification-status`}>
                <div className={`${card_classname}__verification-status--pending`}>
                    <Text size='xxxs' color='prominent'>
                        <Localize i18n_default_text='Pending proof of identity review' />
                    </Text>
                </div>
            </div>
        );
    } else if (
        (is_vanuatu && poi_resubmit_for_vanuatu) ||
        (is_regulated_except_vanuatu && poi_resubmit_for_bvi_labuan_maltainvest)
    ) {
        return (
            <div className={`${card_classname}__verification-status`}>
                <div className={`${card_classname}__verification-status--failed`}>
                    <Text size='xxxs' color='colored-background'>
                        <Localize i18n_default_text='Resubmit proof of identity' />
                    </Text>
                </div>
            </div>
        );
    }
    return null;
};

export default connect(({ client }: RootStore) => ({
    account_status: client.account_status,
    is_virtual: client.is_virtual,
    is_fully_authenticated: client.is_fully_authenticated,
}))(VerificationStatusBanner);
