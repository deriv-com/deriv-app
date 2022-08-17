import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import { GetAccountStatus } from '@deriv/api-types';
import { getAuthenticationStatusInfo } from '@deriv/shared';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TVerificationStatusBannerProps = {
    type_of_card: string;
    account_status: GetAccountStatus;
    is_virtual: boolean;
    card_classname: string;
    account_type: string;
    disabled: boolean;
    is_fully_authenticated: boolean;
};

const VerificationStatusBanner = ({
    type_of_card,
    account_status,
    is_virtual,
    card_classname,
    account_type,
    disabled,
    is_fully_authenticated,
}: TVerificationStatusBannerProps) => {
    const {
        need_poi_for_vanuatu,
        need_poi_for_bvi_labuan_maltainvest,
        poi_or_poa_not_submitted,
        poi_acknowledged_for_bvi_labuan_maltainvest,
        poi_acknowledged_for_vanuatu,
        poa_acknowledged,
        need_poa_submission,
        poi_poa_verified_for_vanuatu,
        poi_poa_verified_for_bvi_labuan_maltainvest,
        need_poa_resubmission,
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
    if (is_virtual && type_of_card !== 'svg') {
        return (
            <div className={`${card_classname}__footer--none`}>
                <Text as='p' size='xxxs' align='center' color={'prominent'}>
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
    }
    if (!disabled && type_of_card) {
        // account not added
        if (type_of_card === 'svg') {
            if (!is_fully_authenticated)
                return (
                    <div className={`${card_classname}__footer`}>
                        <Text size={'xxxs'} color={'less-prominent'}>
                            <Localize i18n_default_text='You will need to submit proof of identity and address once you reach certain thresholds' />
                        </Text>
                    </div>
                );

            return null;
        }
        if (poi_or_poa_not_submitted) {
            // if poi or poa is not submitted
            return (
                <div className={`${card_classname}__footer--none`}>
                    <Text as='p' size='xxs' align='center' color={'prominent'}>
                        <Localize i18n_default_text='Proof of identity and address are required' />
                    </Text>
                </div>
            );
        } else if (type_of_card === 'vanuatu') {
            if (poi_poa_verified_for_vanuatu) {
                return null; //both verified-no banner
            } else if (poi_acknowledged_for_vanuatu && poa_acknowledged && !poi_poa_verified_for_vanuatu) {
                //one is pending and other is verified
                return (
                    <div className={`${card_classname}__verification-status`}>
                        <div className={`${card_classname}__verification-status--pending`}>
                            <Text size='xxxs' color={'prominent'}>
                                <Localize i18n_default_text='Pending verification' />
                            </Text>
                        </div>
                    </div>
                );
            } else if (poi_acknowledged_for_vanuatu && need_poa_resubmission) {
                // poa is rejected,suspected, failed-resubmit
                return (
                    <div className={`${card_classname}__verification-status`}>
                        <div className={`${card_classname}__verification-status--POA_POI`}>
                            <Text size='xxxs' color={'white'}>
                                <Localize i18n_default_text='Check your proof of address' />
                            </Text>
                        </div>
                    </div>
                );
            } else if (need_poi_for_vanuatu && poa_acknowledged) {
                return (
                    <div className={`${card_classname}__verification-status`}>
                        <div className={`${card_classname}__verification-status--POA_POI`}>
                            <Text size='xxxs' color={'white'}>
                                <Localize i18n_default_text='Check your proof of identity' />
                            </Text>
                        </div>
                    </div>
                );
            } else if (need_poi_for_vanuatu && need_poa_submission) {
                return (
                    <div className={`${card_classname}__verification-status`}>
                        <div className={`${card_classname}__verification-status--POA_POI`}>
                            <Text size='xxxs' color={'white'}>
                                <Localize i18n_default_text='Check your proof of identity and address' />
                            </Text>
                        </div>
                    </div>
                );
            }
        } else if (type_of_card === 'bvi' || type_of_card === 'labuan' || type_of_card === 'maltainvest') {
            if (poi_poa_verified_for_bvi_labuan_maltainvest) {
                return null; //both verified-no banner
            } else if (poi_acknowledged_for_bvi_labuan_maltainvest && poa_acknowledged) {
                return (
                    <div className={`${card_classname}__verification-status`}>
                        <div className={`${card_classname}__verification-status--pending`}>
                            <Text size='xxxs' color={'prominent'}>
                                <Localize i18n_default_text='Pending verification' />
                            </Text>
                        </div>
                    </div>
                );
            } else if (need_poa_resubmission && poi_acknowledged_for_bvi_labuan_maltainvest) {
                // poa is rejected,suspected, failed-resubmit
                return (
                    <div className={`${card_classname}__verification-status`}>
                        <div className={`${card_classname}__verification-status--POA_POI`}>
                            <Text size='xxxs' color={'white'}>
                                <Localize i18n_default_text='Check your proof of address' />
                            </Text>
                        </div>
                    </div>
                );
            } else if (need_poi_for_bvi_labuan_maltainvest && poa_acknowledged) {
                return (
                    <div className={`${card_classname}__verification-status`}>
                        <div className={`${card_classname}__verification-status--POA_POI`}>
                            <Text size='xxxs' color={'white'}>
                                <Localize i18n_default_text='Check your proof of identity' />
                            </Text>
                        </div>
                    </div>
                );
            } else if (need_poi_for_bvi_labuan_maltainvest && need_poa_submission) {
                return (
                    <div className={`${card_classname}__verification-status`}>
                        <div className={`${card_classname}__verification-status--POA_POI`}>
                            <Text size='xxxs' color={'white'}>
                                <Localize i18n_default_text='Check your proof of identity and address' />
                            </Text>
                        </div>
                    </div>
                );
            }
        }
        return null;
    }
    // account added
    return (
        <div className={`${card_classname}__verification-status`}>
            <div className={`${card_classname}__verification-status--verified`}>
                <Text size='xxxs' className={`${card_classname}__verification-status--verified-text`} weight='bold'>
                    <Localize i18n_default_text='Account added' />
                </Text>
            </div>
        </div>
    );
};

export default connect(({ client }: RootStore) => ({
    account_status: client.account_status,
    is_virtual: client.is_virtual,
    is_fully_authenticated: client.is_fully_authenticated,
}))(VerificationStatusBanner);
