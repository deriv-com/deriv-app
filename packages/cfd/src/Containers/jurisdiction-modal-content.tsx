import React from 'react';
import { Icon, Text, Checkbox, Popover, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import classNames from 'classnames';
import { jurisdiction_contents } from 'Constants/jurisdiction-contents';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import { TExistingData } from 'Components/props.types';

type TAvailableAccountAPI = [
    {
        market_type: string;
        name: string;
        requirements: {
            signup: Array<string>;
            withdrawal: Array<string>;
        };
        shortcode: string;
        sub_account_type: string;
    }
];

type TJurisdictionModalContent = {
    account_type: string;
    jurisdiction_selected_shortcode: string;
    setJurisdictionSelectedShortcode: (card_type: string) => void;
    synthetic_available_accounts: TAvailableAccountAPI;
    financial_available_accounts: TAvailableAccountAPI;
    poa_status: string;
    poi_status: string;
    is_eu: boolean;
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
    poi_verified_for_labuan_bvi: boolean;
    poa_verified: boolean;
    poi_acknowledged_for_bvi_labuan: boolean;
    need_poi_for_vanuatu: boolean;
    need_poi_for_bvi_labuan: boolean;
    poi_acknowledged_for_vanuatu: boolean;
};

type TJurisdictionCard = {
    jurisdiction_selected_shortcode: string;
    synthetic_available_accounts: TAvailableAccountAPI;
    financial_available_accounts: TAvailableAccountAPI;
    account_type: string;
    poa_status: string;
    poi_status: string;
    poi_poa_none: boolean;
    setJurisdictionSelectedShortcode: (card_type: string) => void;
    type_of_card: string;
    disabled: boolean;
    poa_failed: boolean;
    poi_failed: boolean;
    poa_acknowledged: boolean;
    poi_acknowledged: boolean;
    is_fully_authenticated: boolean;
    is_virtual: boolean;
    poi_verified_for_vanuatu: boolean;
    poi_verified_for_labuan_bvi: boolean;
    poa_verified: boolean;
    poi_acknowledged_for_bvi_labuan: boolean;
    need_poi_for_vanuatu: boolean;
    need_poi_for_bvi_labuan: boolean;
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

const JurisdictionCard = ({
    jurisdiction_selected_shortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    account_type,
    poi_poa_none,
    setJurisdictionSelectedShortcode,
    type_of_card,
    disabled,
    poa_failed,
    poa_acknowledged,
    poi_acknowledged,
    is_fully_authenticated,
    is_virtual,
    poi_verified_for_vanuatu,
    poi_verified_for_labuan_bvi,
    poa_verified,
    poi_acknowledged_for_bvi_labuan,
    need_poi_for_vanuatu,
    need_poi_for_bvi_labuan,
    poi_acknowledged_for_vanuatu,
}: TJurisdictionCard) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;
    const number_of_synthetic_accounts_to_be_shown = synthetic_available_accounts?.length;
    const number_of_financial_accounts_to_be_shown = financial_available_accounts?.length;

    const [number_of_cards] = React.useState(
        account_type === 'synthetic'
            ? number_of_synthetic_accounts_to_be_shown
            : number_of_financial_accounts_to_be_shown
    );

    const cardSelection = (cardType: string) => {
        if (jurisdiction_selected_shortcode === cardType) {
            setJurisdictionSelectedShortcode('');
        } else {
            setJurisdictionSelectedShortcode(cardType);
        }
    };

    const Checkmark = () => (
        <Icon icon='IcCheckmark' className={`${card_classname}__bullet-wrapper--checkmark`} color={'green'} size={18} />
    );

    const one_or_two_cards = number_of_cards === 1 || number_of_cards === 2;

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
    const VerificationStatuses = () => {
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
                            <Text size='xxxs' color={'less-prominent'}>
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
                poi_verified_for_labuan_bvi
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
                if (poi_acknowledged_for_bvi_labuan && poa_acknowledged) {
                    return (
                        <div className={`${card_classname}__verification-status`}>
                            <div className={`${card_classname}__verification-status--pending`}>
                                <Text size='xxxs' color={'prominent'}>
                                    <Localize i18n_default_text='Pending verification' />
                                </Text>
                            </div>
                        </div>
                    );
                } else if (need_poi_for_bvi_labuan && poa_acknowledged) {
                    return (
                        <div className={`${card_classname}__verification-status`}>
                            <div className={`${card_classname}__verification-status--POA_POI`}>
                                <Text size='xxxs' color={'white'}>
                                    <Localize i18n_default_text='Check your proof of identity' />
                                </Text>
                            </div>
                        </div>
                    );
                } else if (need_poi_for_bvi_labuan && !poa_acknowledged) {
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

    return (
        <>
            <div
                className={classNames(card_classname, {
                    [`${card_classname}--selected`]: jurisdiction_selected_shortcode === type_of_card,
                })}
                onClick={disabled ? () => undefined : () => cardSelection(`${type_of_card}`)}
                style={one_or_two_cards ? { width: '32em' } : { width: '27.6em' }}
            >
                {jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents].is_over_header_available && (
                    <div className={classNames(`${card_classname}__over-header`)}>
                        <Text as='p' color={'info-blue'} line_height='xxl' weight='bold'>
                            <Localize
                                i18n_default_text={
                                    jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents]
                                        .over_header
                                }
                            />
                        </Text>
                    </div>
                )}
                <div className={`${card_classname}__info-container`}>
                    <Text as='p' color={'prominent'} weight='bold' size='sm' className={`${card_classname}__h2-header`}>
                        <Localize
                            i18n_default_text={
                                jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents].header
                            }
                        />
                    </Text>
                    {account_type === 'synthetic'
                        ? jurisdiction_contents[
                              type_of_card as keyof typeof jurisdiction_contents
                          ].synthetic_contents.map((item, index) => (
                              <div className={`${card_classname}__bullet-wrapper`} key={index}>
                                  <div>
                                      <Checkmark />
                                  </div>
                                  <Text as='p' size='xs' color={'prominent'}>
                                      <Localize i18n_default_text={item} />
                                  </Text>
                              </div>
                          ))
                        : jurisdiction_contents[
                              type_of_card as keyof typeof jurisdiction_contents
                          ].financial_contents.map((item, index) => (
                              <div className={`${card_classname}__bullet-wrapper`} key={index}>
                                  <div>
                                      <Checkmark />
                                  </div>
                                  <Text as='p' size='xs' color={'prominent'}>
                                      <Localize i18n_default_text={item} />
                                  </Text>
                                  {/* TODO: find a better solution */}
                                  {/Straight-through processing/.test(item) && (
                                      <Popover
                                          alignment='left'
                                          className='cfd-compare-accounts-tooltip'
                                          classNameBubble='cfd-compare-accounts-tooltip--msg'
                                          icon='info'
                                          disable_message_icon
                                          is_bubble_hover_enabled
                                          message={localize(
                                              'Choosing this jurisdiction will give you a Financial STP account. Your trades will go directly to the market and have tighter spreads.'
                                          )}
                                          zIndex={9999}
                                      />
                                  )}
                              </div>
                          ))}
                </div>
                <VerificationStatuses />
            </div>
        </>
    );
};

const JurisdictionModalContent = ({
    jurisdiction_selected_shortcode,
    account_type,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    poa_status,
    poi_status,
    is_eu,
    is_fully_authenticated,
    checked,
    setChecked,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    poa_failed,
    poi_failed,
    is_virtual,
    poi_verified_for_vanuatu,
    poi_verified_for_labuan_bvi,
    poa_verified,
    poi_acknowledged_for_bvi_labuan,
    need_poi_for_vanuatu,
    need_poi_for_bvi_labuan,
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

                {poi_verified_for_labuan_bvi && poa_verified && jurisdiction_selected_shortcode === 'bvi' && (
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
                {poi_verified_for_labuan_bvi && poa_verified && jurisdiction_selected_shortcode === 'labuan' && (
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
                    need_poi_for_bvi_labuan &&
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
                    need_poi_for_bvi_labuan && (
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
                    poi_acknowledged_for_bvi_labuan &&
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

    const dbvi_company_names: { [key: string]: { [key: string]: string } } = {
        bvi: { name: 'Deriv (BVI) Ltd', tnc_url: 'tnc/deriv-(bvi)-ltd.pdf' },
        labuan: { name: 'Deriv (FX) Ltd', tnc_url: 'tnc/deriv-(fx)-ltd.pdf' },
        maltainvest: {
            name: 'Deriv Investments (Europe) Limited',
            tnc_url: 'tnc/deriv-investments-(europe)-limited.pdf',
        },
        vanuatu: { name: 'Deriv (V) Ltd', tnc_url: 'tnc/general-terms.pdf' },
    };

    const getCheckboxLabel = () => (
        <Text as='p' align={!isMobile() ? 'center' : ''} size='xs' line_height='xs'>
            <Localize
                i18n_default_text="I confirm and accept {{company}} 's <0>Terms and Conditions</0>"
                values={{ company: dbvi_company_names[jurisdiction_selected_shortcode].name }}
                components={[
                    <StaticUrl
                        key={0}
                        className='link'
                        href={dbvi_company_names[jurisdiction_selected_shortcode].tnc_url}
                    />,
                ]}
            />
        </Text>
    );

    const ModalCheckbox = ({
        onCheck,
        is_checked,
    }: {
        onCheck: React.Dispatch<React.SetStateAction<boolean>>;
        is_checked: boolean;
    }) => (
        <div className={`${card_classname}__jurisdiction-checkbox`}>
            <Checkbox onChange={() => onCheck(!checked)} value={is_checked} label={getCheckboxLabel()} />
        </div>
    );

    const showCheckBox = () => {
        if (jurisdiction_selected_shortcode) {
            if (jurisdiction_selected_shortcode === 'svg') {
                return false;
            } else if (jurisdiction_selected_shortcode === 'vanuatu' && poa_verified && poi_verified_for_vanuatu) {
                return true;
            } else if (
                (jurisdiction_selected_shortcode === 'bvi' || jurisdiction_selected_shortcode === 'labuan') &&
                poa_verified &&
                poi_verified_for_labuan_bvi
            ) {
                return true;
            } else if (is_fully_authenticated && poi_poa_verified) return true;
            return false;
        }
        return false;
    };

    return (
        <>
            <div className={`${card_classname}__wrapper`}>
                {cardsToBeShown('svg') && (
                    <JurisdictionCard
                        type_of_card='svg'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                        disabled={disableCard('svg')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                        poi_poa_none={poi_poa_none}
                        poa_acknowledged={poa_acknowledged}
                        poi_acknowledged={poi_acknowledged}
                        is_fully_authenticated={is_fully_authenticated}
                        is_virtual={is_virtual}
                        poi_verified_for_vanuatu={poi_verified_for_vanuatu}
                        poi_verified_for_labuan_bvi={poi_verified_for_labuan_bvi}
                        poa_verified={poa_verified}
                        poi_acknowledged_for_bvi_labuan={poi_acknowledged_for_bvi_labuan}
                        need_poi_for_vanuatu={need_poi_for_vanuatu}
                        need_poi_for_bvi_labuan={need_poi_for_bvi_labuan}
                        poi_acknowledged_for_vanuatu={poi_acknowledged_for_vanuatu}
                    />
                )}
                {cardsToBeShown('bvi') && (
                    <JurisdictionCard
                        type_of_card='bvi'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                        disabled={disableCard('bvi')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                        poi_poa_none={poi_poa_none}
                        poa_acknowledged={poa_acknowledged}
                        poi_acknowledged={poi_acknowledged}
                        is_fully_authenticated={is_fully_authenticated}
                        is_virtual={is_virtual}
                        poi_verified_for_vanuatu={poi_verified_for_vanuatu}
                        poi_verified_for_labuan_bvi={poi_verified_for_labuan_bvi}
                        poa_verified={poa_verified}
                        poi_acknowledged_for_bvi_labuan={poi_acknowledged_for_bvi_labuan}
                        need_poi_for_vanuatu={need_poi_for_vanuatu}
                        need_poi_for_bvi_labuan={need_poi_for_bvi_labuan}
                        poi_acknowledged_for_vanuatu={poi_acknowledged_for_vanuatu}
                    />
                )}
                {cardsToBeShown('maltainvest') && is_eu && (
                    <JurisdictionCard
                        type_of_card='maltainvest'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                        disabled={disableCard('maltainvest')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                        poi_poa_none={poi_poa_none}
                        poa_acknowledged={poa_acknowledged}
                        poi_acknowledged={poi_acknowledged}
                        is_fully_authenticated={is_fully_authenticated}
                        is_virtual={is_virtual}
                        poi_verified_for_vanuatu={poi_verified_for_vanuatu}
                        poi_verified_for_labuan_bvi={poi_verified_for_labuan_bvi}
                        poa_verified={poa_verified}
                        poi_acknowledged_for_bvi_labuan={poi_acknowledged_for_bvi_labuan}
                        need_poi_for_vanuatu={need_poi_for_vanuatu}
                        need_poi_for_bvi_labuan={need_poi_for_bvi_labuan}
                        poi_acknowledged_for_vanuatu={poi_acknowledged_for_vanuatu}
                    />
                )}
                {cardsToBeShown('vanuatu') && (
                    <JurisdictionCard
                        type_of_card='vanuatu'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                        disabled={disableCard('vanuatu')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                        poi_poa_none={poi_poa_none}
                        poa_acknowledged={poa_acknowledged}
                        poi_acknowledged={poi_acknowledged}
                        is_fully_authenticated={is_fully_authenticated}
                        is_virtual={is_virtual}
                        poi_verified_for_vanuatu={poi_verified_for_vanuatu}
                        poi_verified_for_labuan_bvi={poi_verified_for_labuan_bvi}
                        poa_verified={poa_verified}
                        poi_acknowledged_for_bvi_labuan={poi_acknowledged_for_bvi_labuan}
                        need_poi_for_vanuatu={need_poi_for_vanuatu}
                        need_poi_for_bvi_labuan={need_poi_for_bvi_labuan}
                        poi_acknowledged_for_vanuatu={poi_acknowledged_for_vanuatu}
                    />
                )}
                {cardsToBeShown('labuan') && (
                    <JurisdictionCard
                        type_of_card='labuan'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                        disabled={disableCard('labuan')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                        poi_poa_none={poi_poa_none}
                        poa_acknowledged={poa_acknowledged}
                        poi_acknowledged={poi_acknowledged}
                        is_fully_authenticated={is_fully_authenticated}
                        is_virtual={is_virtual}
                        poi_verified_for_vanuatu={poi_verified_for_vanuatu}
                        poi_verified_for_labuan_bvi={poi_verified_for_labuan_bvi}
                        poa_verified={poa_verified}
                        poi_acknowledged_for_bvi_labuan={poi_acknowledged_for_bvi_labuan}
                        need_poi_for_vanuatu={need_poi_for_vanuatu}
                        need_poi_for_bvi_labuan={need_poi_for_bvi_labuan}
                        poi_acknowledged_for_vanuatu={poi_acknowledged_for_vanuatu}
                    />
                )}
            </div>
            <ModalFootNote />
            {showCheckBox() && <ModalCheckbox is_checked={checked} onCheck={setChecked} />}
        </>
    );
};

export default connect(({ modules: { cfd }, client }: RootStore) => ({
    account_status: client.account_status,
    real_financial_accounts_existing_data: cfd.real_financial_accounts_existing_data,
    real_synthetic_accounts_existing_data: cfd.real_synthetic_accounts_existing_data,
    is_virtual: client.is_virtual,
}))(JurisdictionModalContent);
