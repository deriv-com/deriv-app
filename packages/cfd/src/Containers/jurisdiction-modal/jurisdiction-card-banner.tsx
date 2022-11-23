import React from 'react';
import RootStore from '../../Stores/index';
import { connect } from '../../Stores/connect';
import { TVerificationStatusBannerProps } from '../props.types';
import { getAuthenticationStatusInfo } from '@deriv/shared';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const VerificationStatusBanner = ({
    account_status,
    account_type,
    card_classname,
    disabled,
    context,
    is_virtual,
    type_of_card,
    should_restrict_bvi_account_creation,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
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
        poi_poa_verified_for_bvi_labuan_maltainvest,
        poi_acknowledged_for_bvi_labuan_maltainvest,
        poa_acknowledged,
        need_poa_resubmission,
        need_poi_for_bvi_labuan_maltainvest,
        poa_pending,
    } = getAuthenticationStatusInfo(account_status);

    const getAccountTitle = () => {
        switch (account_type) {
            case 'synthetic':
                return 'Derived';
            case 'financial':
                return 'Financial';
            default:
                return '';
        }
    };

    const is_svg = type_of_card === 'svg';
    const is_vanuatu = type_of_card === 'vanuatu';
    const is_bvi = type_of_card === 'bvi';
    const is_labuan_or_maltainvest = ['labuan', 'maltainvest'].includes(type_of_card);

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

    const isAccountCreated = () =>
        account_type === 'synthetic'
            ? real_synthetic_accounts_existing_data?.some(account => account.landing_company_short === type_of_card)
            : real_financial_accounts_existing_data?.some(account => account.landing_company_short === type_of_card);

    if (disabled && isAccountCreated()) {
        // account added
        return (
            <div className={`${card_classname}__verification-status--account_added`}>
                <Text size='xxs' weight='bold' color='colored-background'>
                    <Localize i18n_default_text='Account added' />
                </Text>
            </div>
        );
    } else if (is_virtual && !is_svg) {
        return (
            <div className={`${card_classname}__verification-status--not_submitted`}>
                <Text as='p' size='xxxs' align='center' color='prominent'>
                    <Localize
                        i18n_default_text='Switch to your real account to create a Deriv MT5 {{account_title}} {{type_title}} account.'
                        values={{
                            account_title: getAccountTitle(),
                            type_title: getTypeTitle(),
                        }}
                    />
                </Text>
            </div>
        );
    } else if (is_svg) {
        return (
            <div className={`${card_classname}__verification-status--hint`}>
                <Text size='xxxs' align='center' line-height='s' color='less-prominent'>
                    <Localize i18n_default_text='You will need to submit proof of identity and address once you reach certain thresholds' />
                </Text>
            </div>
        );
    } else if (poi_or_poa_not_submitted) {
        // if poi or poa is not submitted
        return (
            <div className={`${card_classname}__verification-status--not_submitted`}>
                <Text as='p' size='xxs' align='center' color='prominent'>
                    <Localize i18n_default_text='Proof of identity and address are required' />
                </Text>
            </div>
        );
    } else if (is_bvi && should_restrict_bvi_account_creation) {
        if (poa_pending) {
            return (
                <div className={`${card_classname}__verification-status--pending`}>
                    <Text size='xxs' color='prominent'>
                        <Localize i18n_default_text='Pending proof of address review' />
                    </Text>
                </div>
            );
        }
        return (
            <div className={`${card_classname}__verification-status--failed`}>
                <Text size='xxs' color='colored-background'>
                    <Localize i18n_default_text='Resubmit proof of address' />
                </Text>
            </div>
        );
    } else if (
        (is_vanuatu && poi_verified_for_vanuatu) ||
        (is_bvi && poi_verified_for_bvi_labuan_maltainvest) ||
        (is_labuan_or_maltainvest && poi_poa_verified_for_bvi_labuan_maltainvest)
    ) {
        return (
            <div className={`${card_classname}__verification-status--poi_verified`}>
                <Text as='p' size='xxs' align='center' color='colored-background'>
                    <Localize i18n_default_text='You are verified to add this account' />
                </Text>
            </div>
        );
    } else if (is_vanuatu && poi_not_submitted_for_vanuatu) {
        return (
            <div className={`${card_classname}__verification-status--not_submitted`}>
                <Text as='p' size='xxs' align='center' color='prominent'>
                    <Localize i18n_default_text='You will need to submit proof of identity' />
                </Text>
            </div>
        );
    } else if ((is_vanuatu && poi_pending_for_vanuatu) || (is_bvi && poi_pending_for_bvi_labuan_maltainvest)) {
        return (
            <div className={`${card_classname}__verification-status--pending`}>
                <Text size='xxs' color='prominent'>
                    <Localize i18n_default_text='Pending proof of identity review' />
                </Text>
            </div>
        );
    } else if (
        is_labuan_or_maltainvest &&
        poi_acknowledged_for_bvi_labuan_maltainvest &&
        poa_acknowledged &&
        !poi_poa_verified_for_bvi_labuan_maltainvest
    ) {
        return (
            <div className={`${card_classname}__verification-status--pending`}>
                <Text size='xxs' color='prominent'>
                    <Localize i18n_default_text='Pending verification' />
                </Text>
            </div>
        );
    } else if (is_labuan_or_maltainvest && need_poa_resubmission && need_poi_for_bvi_labuan_maltainvest) {
        return (
            <div className={`${card_classname}__verification-status--failed`}>
                <Text size='xxs' color='colored-background'>
                    <Localize i18n_default_text='Resubmit proof of identity and address' />
                </Text>
            </div>
        );
    } else if (
        (is_vanuatu && poi_resubmit_for_vanuatu) ||
        ((is_bvi || is_labuan_or_maltainvest) && poi_resubmit_for_bvi_labuan_maltainvest)
    ) {
        return (
            <div className={`${card_classname}__verification-status--failed`}>
                <Text size='xxs' color='colored-background'>
                    <Localize i18n_default_text='Resubmit proof of identity' />
                </Text>
            </div>
        );
    } else if (is_labuan_or_maltainvest && need_poa_resubmission) {
        return (
            <div className={`${card_classname}__verification-status--failed`}>
                <Text size='xxs' color='colored-background'>
                    <Localize i18n_default_text='Resubmit proof of address' />
                </Text>
            </div>
        );
    }
    return null;
};

const JurisdictionCardBanner = (props: TVerificationStatusBannerProps) => {
    return (
        <div className={`${props.card_classname}__verification-status`}>
            <VerificationStatusBanner {...props} />
        </div>
    );
};

export default connect(({ modules: { cfd }, client }: RootStore) => ({
    account_status: client.account_status,
    is_virtual: client.is_virtual,
    should_restrict_bvi_account_creation: client.should_restrict_bvi_account_creation,
    real_financial_accounts_existing_data: cfd.real_financial_accounts_existing_data,
    real_synthetic_accounts_existing_data: cfd.real_synthetic_accounts_existing_data,
}))(JurisdictionCardBanner);
