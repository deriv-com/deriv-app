import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import CfdCheckBoxForAccounts from './jurisdiction-modal-content/cfd-checkbox-for-accounts';
import { TExistingData, TAvailableAccountAPI } from 'Components/props.types';
import JurisdictionCard from './jurisdiction-modal-content/jurisdiction-card';

type TJurisdictionModalContent = {
    account_type: string;
    jurisdiction_selected_shortcode: string;
    setJurisdictionSelectedShortcode: (card_type: string) => void;
    synthetic_available_accounts: TAvailableAccountAPI;
    financial_available_accounts: TAvailableAccountAPI;
    poa_status: string;
    poi_status: string;
    is_fully_authenticated: boolean;
    poi_poa_pending: boolean;
    checked: boolean;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
    real_synthetic_accounts_existing_data: TExistingData;
    real_financial_accounts_existing_data: TExistingData;
    poa_failed: boolean;
    poi_failed: boolean;
    is_virtual: boolean;
    poi_verified_for_vanuatu: boolean;
    poi_verified_for_bvi_labuan_maltainvest: boolean;
    poa_verified: boolean;
    poi_acknowledged_for_bvi_labuan_maltainvest: boolean;
    need_poi_for_vanuatu: boolean;
    need_poi_for_bvi_labuan_maltainvest: boolean;
    poi_acknowledged_for_vanuatu: boolean;
};

const StatusCodes = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
};

const JurisdictionModalContent = ({
    jurisdiction_selected_shortcode,
    account_type,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    poa_status,
    poi_status,

    is_fully_authenticated,
    checked,
    setChecked,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    poa_failed,
    poi_failed,
    is_virtual,
    poi_verified_for_vanuatu,
    poi_verified_for_bvi_labuan_maltainvest,
    poa_verified,
    poi_acknowledged_for_bvi_labuan_maltainvest,
    need_poi_for_vanuatu,
    need_poi_for_bvi_labuan_maltainvest,
    poi_acknowledged_for_vanuatu,
}: TJurisdictionModalContent) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;

    const poa_none = poa_status === StatusCodes.none;
    const poi_none = poi_status === StatusCodes.none;
    const poi_poa_none = poi_none || poa_none;

    const poa_acknowledged = poa_status === StatusCodes.pending || poa_status === StatusCodes.verified;
    const poi_acknowledged = poi_status === StatusCodes.pending || poi_status === StatusCodes.verified;

    const poi_poa_verified = poi_status === StatusCodes.verified && poa_status === StatusCodes.verified;

    const cardsToBeShown = (type_of_card: string) => {
        const is_available =
            account_type === 'synthetic'
                ? synthetic_available_accounts?.some(account => account.shortcode === type_of_card)
                : financial_available_accounts?.some(account => account.shortcode === type_of_card);
        return is_available;
    };

    const disableCard = (type_of_card: string) => {
        if (is_virtual && type_of_card !== 'svg') {
            return true;
        }
        const is_available =
            account_type === 'synthetic'
                ? real_synthetic_accounts_existing_data?.some(account => account.landing_company_short === type_of_card)
                : real_financial_accounts_existing_data?.some(
                      account => account.landing_company_short === type_of_card
                  );

        return is_available;
    };

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

    const getTypeTitle = (type_of_card: string) => {
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

    const VerificationStatuses = (type_of_card: string) => {
        if (is_virtual && type_of_card !== 'svg') {
            return (
                <div className={`${card_classname}__footer--none`}>
                    <Text as='p' size='xxxs' align='center' color={'prominent'}>
                        <Localize
                            i18n_default_text='Switch to your real account to create a DMT5 {{account_title}} {{type_title}} account.'
                            values={{
                                account_title: getAccountTitle(),
                                type_title: getTypeTitle(type_of_card),
                            }}
                        />
                    </Text>
                </div>
            );
        }
        if (!disableCard(type_of_card) && type_of_card) {
            // account not added
            if (type_of_card === 'svg') {
                if (!is_fully_authenticated)
                    return (
                        <div className={`${card_classname}__footer`}>
                            <Text size={'xxxxs'} color={'less-prominent'}>
                                <Localize i18n_default_text='You will need to submit proof of identity and address once you reach certain thresholds' />
                            </Text>
                        </div>
                    );

                return null;
            }
            if (poi_poa_none) {
                // if poi or poa is not submitted
                return (
                    <div className={`${card_classname}__footer--none`}>
                        <Text as='p' size='xxs' align='center' color={'prominent'}>
                            <Localize i18n_default_text='Proof of identity and address are required' />
                        </Text>
                    </div>
                );
            } else if (type_of_card === 'vanuatu' && poa_verified && poi_verified_for_vanuatu) {
                //if both verified for vanuatu
                return null;
            } else if (
                (type_of_card === 'bvi' || type_of_card === 'labuan' || type_of_card === 'maltainvest') &&
                poa_verified &&
                poi_verified_for_bvi_labuan_maltainvest
            ) {
                //if both verified for bvi and labuan
                return null;
            } else if (!poi_poa_none && poa_failed && poi_acknowledged) {
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
            } else if (type_of_card === 'vanuatu') {
                if (poi_acknowledged_for_vanuatu && poa_acknowledged) {
                    return (
                        <div className={`${card_classname}__verification-status`}>
                            <div className={`${card_classname}__verification-status--pending`}>
                                <Text size='xxxs' color={'prominent'}>
                                    <Localize i18n_default_text='Pending verification' />
                                </Text>
                            </div>
                        </div>
                    );
                } else if (need_poi_for_vanuatu && poa_acknowledged) {
                    return (
                        <div className={`${card_classname}__footer--none`}>
                            <Text as='p' size='xxs' align='center' color={'prominent'}>
                                <Localize i18n_default_text='Proof of identity required' />
                            </Text>
                        </div>
                    );
                } else if (need_poi_for_vanuatu && !poa_acknowledged) {
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
                if (poi_acknowledged_for_bvi_labuan_maltainvest && poa_acknowledged) {
                    return (
                        <div className={`${card_classname}__verification-status`}>
                            <div className={`${card_classname}__verification-status--pending`}>
                                <Text size='xxxs' color={'prominent'}>
                                    <Localize i18n_default_text='Pending verification' />
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
                } else if (need_poi_for_bvi_labuan_maltainvest && !poa_acknowledged) {
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

    const ModalFootNote = () => {
        const account_type_name = account_type === 'synthetic' ? 'Synthetics' : 'Financial';

        return (
            <>
                {jurisdiction_selected_shortcode === 'svg' && (
                    <div className={`${card_classname}__footnote`}>
                        <Text as='p' color='prominent' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize
                                i18n_default_text='Add your DMT5 {{account_type}} account under Deriv (SVG) LLC (company no. 273 LLC 2020).'
                                values={{ account_type: account_type_name }}
                            />
                        </Text>
                    </div>
                )}

                {poi_verified_for_bvi_labuan_maltainvest && poa_verified && jurisdiction_selected_shortcode === 'bvi' && (
                    <div className={`${card_classname}__footnote`}>
                        <Text as='p' color='prominent' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize
                                i18n_default_text='Add your DMT5 {{account_type}} account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/{{line_break}}L/18/1114).'
                                values={{ account_type: account_type_name, line_break: '\n' }}
                            />
                        </Text>
                    </div>
                )}
                {poi_verified_for_vanuatu && poa_verified && jurisdiction_selected_shortcode === 'vanuatu' && (
                    <div className={`${card_classname}__footnote`}>
                        <Text as='p' color='prominent' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize
                                i18n_default_text='Add Your DMT5 {{account_type}} account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.'
                                values={{ account_type: account_type_name }}
                            />
                        </Text>
                    </div>
                )}
                {poi_verified_for_bvi_labuan_maltainvest &&
                    poa_verified &&
                    jurisdiction_selected_shortcode === 'labuan' && (
                        <div className={`${card_classname}__footnote`}>
                            <Text as='p' color='prominent' weight='bold' align='center' size='xs' line_height='xs'>
                                <Localize
                                    i18n_default_text='Add your DMT5 {{account_type}} STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (Licence no. MB/18/0024).'
                                    values={{ account_type: account_type_name }}
                                />
                            </Text>
                        </div>
                    )}
                {is_fully_authenticated && jurisdiction_selected_shortcode === 'maltainvest' && (
                    <div className={`${card_classname}__footnote`}>
                        <Text as='p' color='prominent' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize
                                i18n_default_text='Add your DMT5 CFDs account under Deriv Investments (Europe) Limited regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156).'
                                values={{ account_type: account_type_name }}
                            />
                        </Text>
                    </div>
                )}
                {poi_poa_none && jurisdiction_selected_shortcode && jurisdiction_selected_shortcode !== 'svg' && (
                    <Text
                        as='p'
                        color='prominent'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className={`${card_classname}__footnote`}
                    >
                        <Localize i18n_default_text='To create this account first we need your proof of identity and address.' />
                    </Text>
                )}

                {jurisdiction_selected_shortcode &&
                    jurisdiction_selected_shortcode === 'vanuatu' &&
                    need_poi_for_vanuatu &&
                    poa_acknowledged &&
                    !poi_poa_none && (
                        <Text
                            as='p'
                            color='prominent'
                            align='center'
                            size='xs'
                            weight='bold'
                            line_height='xs'
                            className={`${card_classname}__footnote`}
                        >
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity.' />
                        </Text>
                    )}
                {jurisdiction_selected_shortcode &&
                    (jurisdiction_selected_shortcode === 'bvi' ||
                        jurisdiction_selected_shortcode === 'labuan' ||
                        jurisdiction_selected_shortcode === 'maltainvest') &&
                    need_poi_for_bvi_labuan_maltainvest &&
                    poa_acknowledged &&
                    !poi_poa_none && (
                        <Text
                            as='p'
                            color='prominent'
                            align='center'
                            size='xs'
                            weight='bold'
                            line_height='xs'
                            className={`${card_classname}__footnote`}
                        >
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity.' />
                        </Text>
                    )}
                {poa_failed &&
                    !poa_acknowledged &&
                    !poi_failed &&
                    !poi_poa_none &&
                    jurisdiction_selected_shortcode &&
                    jurisdiction_selected_shortcode !== 'svg' && (
                        <Text
                            as='p'
                            color='prominent'
                            align='center'
                            size='xs'
                            weight='bold'
                            line_height='xs'
                            className={`${card_classname}__footnote`}
                        >
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of address.' />
                        </Text>
                    )}

                {poa_failed &&
                    !poa_acknowledged &&
                    jurisdiction_selected_shortcode &&
                    jurisdiction_selected_shortcode === 'vanuatu' &&
                    need_poi_for_vanuatu && (
                        <Text
                            as='p'
                            color='prominent'
                            align='center'
                            size='xs'
                            weight='bold'
                            line_height='xs'
                            className={`${card_classname}__footnote`}
                        >
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity and address.' />
                        </Text>
                    )}

                {poa_failed &&
                    !poa_acknowledged &&
                    jurisdiction_selected_shortcode &&
                    (jurisdiction_selected_shortcode === 'bvi' ||
                        jurisdiction_selected_shortcode === 'labuan' ||
                        jurisdiction_selected_shortcode === 'maltainvest') &&
                    need_poi_for_bvi_labuan_maltainvest && (
                        <Text
                            as='p'
                            color='prominent'
                            align='center'
                            size='xs'
                            weight='bold'
                            line_height='xs'
                            className={`${card_classname}__footnote`}
                        >
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity and address.' />
                        </Text>
                    )}

                {poa_acknowledged &&
                    poi_acknowledged_for_vanuatu &&
                    !poi_poa_verified &&
                    jurisdiction_selected_shortcode &&
                    jurisdiction_selected_shortcode === 'vanuatu' && (
                        <div className={`${card_classname}__footnote--pending`}>
                            <Text as='p' align='center' color='yellow' weight='bold' size='xs' line_height='xs'>
                                <Localize i18n_default_text='You will be able to open this account once your submitted documents have been verified.' />
                            </Text>
                        </div>
                    )}

                {poa_acknowledged &&
                    poi_acknowledged_for_bvi_labuan_maltainvest &&
                    !poi_poa_verified &&
                    jurisdiction_selected_shortcode &&
                    (jurisdiction_selected_shortcode === 'bvi' ||
                        jurisdiction_selected_shortcode === 'labuan' ||
                        jurisdiction_selected_shortcode === 'maltainvest') && (
                        <div className={`${card_classname}__footnote--pending`}>
                            <Text as='p' align='center' color='yellow' weight='bold' size='xs' line_height='xs'>
                                <Localize i18n_default_text='You will be able to open this account once your submitted documents have been verified.' />
                            </Text>
                        </div>
                    )}
            </>
        );
    };
    const jurisdiction_cards_array = ['bvi', 'maltainvest', 'vanuatu', 'labuan', 'svg'];
    return (
        <>
            <div className={`${card_classname}__wrapper`}>
                {jurisdiction_cards_array.map(
                    card =>
                        cardsToBeShown(card) && (
                            <JurisdictionCard
                                type_of_card={card}
                                disabled={disableCard(card)}
                                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                                synthetic_available_accounts={synthetic_available_accounts}
                                financial_available_accounts={financial_available_accounts}
                                account_type={account_type}
                                setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                                banner={VerificationStatuses(card)}
                            />
                        )
                )}
            </div>
            <ModalFootNote />
            <CfdCheckBoxForAccounts
                is_checked={checked}
                onCheck={() => setChecked(!checked)}
                class_name={`${card_classname}__jurisdiction-checkbox`}
            />
        </>
    );
};

export default connect(({ modules: { cfd }, client }: RootStore) => ({
    account_status: client.account_status,
    real_financial_accounts_existing_data: cfd.real_financial_accounts_existing_data,
    real_synthetic_accounts_existing_data: cfd.real_synthetic_accounts_existing_data,
    is_virtual: client.is_virtual,
}))(JurisdictionModalContent);
