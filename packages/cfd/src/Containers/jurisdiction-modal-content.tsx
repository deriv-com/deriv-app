import React from 'react';
import { Icon, Text, Checkbox, StaticUrl } from '@deriv/components';
import { PoaStatusCodes } from '@deriv/account';
import { Localize } from '@deriv/translations';
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
};

type TJurisdictionCard = {
    jurisdiction_selected_shortcode: string;
    synthetic_available_accounts: TAvailableAccountAPI;
    financial_available_accounts: TAvailableAccountAPI;
    account_type: string;
    poa_status: string;
    poi_status: string;
    poi_poa_pending: boolean;
    setJurisdictionSelectedShortcode: (card_type: string) => void;
    type_of_card: string;
    disabled: boolean;
    poa_failed: boolean;
    poi_failed: boolean;
};

const JurisdictionCard = ({
    jurisdiction_selected_shortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    account_type,
    poa_status,
    poi_status,
    poi_poa_pending,
    setJurisdictionSelectedShortcode,
    type_of_card,
    disabled,
    poa_failed,
    poi_failed,
}: TJurisdictionCard) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;
    const number_of_synthetic_accounts_to_be_shown = synthetic_available_accounts?.length;
    const number_of_financial_accounts_to_be_shown = financial_available_accounts?.length;

    const [number_of_cards] = React.useState(
        account_type === 'synthetic'
            ? number_of_synthetic_accounts_to_be_shown
            : number_of_financial_accounts_to_be_shown
    );

    const poa_none = poa_status === PoaStatusCodes.none;
    const poi_none = poi_status === PoaStatusCodes.none;
    const poi_poa_none = poi_none || poa_none;

    const cardSelection = (cardType: string) => {
        if (jurisdiction_selected_shortcode === cardType) {
            setJurisdictionSelectedShortcode('');
        } else {
            setJurisdictionSelectedShortcode(cardType);
        }
    };

    const Checkmark = () => (
        <Icon
            icon='IcCheckmark'
            className={`${card_classname}__bullet-wrapper--checkmark`}
            color={disabled ? 'disabled' : 'green'}
            size={18}
        />
    );

    const OneOrTwoCards = number_of_cards === 1 || number_of_cards === 2;

    const VerificationStatuses = () => (
        <>
            {!disabled && poa_none && poi_none && type_of_card !== 'svg' && (
                <div className={`${card_classname}__footer--none`}>
                    <Text as='p' size='xxxs' align='center' color={disabled ? 'less-prominent' : 'prominent'}>
                        <Localize i18n_default_text='You will need to submit proof of identity and address' />
                    </Text>
                </div>
            )}
            {!disabled && poi_poa_pending && type_of_card && type_of_card !== 'svg' && (
                <div className={`${card_classname}__verification-status`}>
                    <div className={`${card_classname}__verification-status--pending`}>
                        <Text size='xxxs' color={disabled ? 'less-prominent' : 'prominent'}>
                            <Localize i18n_default_text='Pending verification' />
                        </Text>
                    </div>
                </div>
            )}
            {!disabled && type_of_card === 'svg' && (
                <div className={`${card_classname}__footer`}>
                    <Text size={OneOrTwoCards ? 'xxxs' : 'xxxxs'} color={'less-prominent'}>
                        <Localize i18n_default_text='You will need to submit proof of identity and address once you reach certain thresholds' />
                    </Text>
                </div>
            )}
            {disabled && (
                <div className={`${card_classname}__verification-status`}>
                    <div className={`${card_classname}__verification-status--verified`}>
                        <Text
                            size='xxxs'
                            className={`${card_classname}__verification-status--verified-text`}
                            weight='bold'
                        >
                            <Localize i18n_default_text='Account added' />
                        </Text>
                    </div>
                </div>
            )}
            {!disabled && poi_failed && !poa_failed && !poi_poa_none && type_of_card && type_of_card !== 'svg' && (
                <div className={`${card_classname}__verification-status`}>
                    <div className={`${card_classname}__verification-status--POA_POI`}>
                        <Text size='xxxs' color={disabled ? 'less-prominent' : 'white'}>
                            <Localize i18n_default_text='Check your proof of identity' />
                        </Text>
                    </div>
                </div>
            )}
            {!disabled && poa_failed && !poi_failed && !poi_poa_none && type_of_card && type_of_card !== 'svg' && (
                <div className={`${card_classname}__verification-status`}>
                    <div className={`${card_classname}__verification-status--POA_POI`}>
                        <Text size='xxxs' color={disabled ? 'less-prominent' : 'white'}>
                            <Localize i18n_default_text='Check your proof of address' />
                        </Text>
                    </div>
                </div>
            )}
            {!disabled && poa_failed && poi_failed && type_of_card && type_of_card !== 'svg' && (
                <div className={`${card_classname}__verification-status`}>
                    <div className={`${card_classname}__verification-status--POA_POI`}>
                        <Text size='xxxs' color={disabled ? 'less-prominent' : 'white'}>
                            <Localize i18n_default_text='Check your proof of identity and address' />
                        </Text>
                    </div>
                </div>
            )}
        </>
    );

    return (
        <>
            <div
                className={classNames(card_classname, {
                    [`${card_classname}--selected`]: jurisdiction_selected_shortcode === type_of_card,
                })}
                onClick={disabled ? () => undefined : () => cardSelection(`${type_of_card}`)}
                style={OneOrTwoCards ? { width: '32em' } : { width: '27.6em' }}
            >
                {jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents].is_over_header_available && (
                    <div className={classNames(`${card_classname}__over-header`)}>
                        <Text as='p' color={disabled ? 'less-prominent' : 'blue'} line_height='xxl' weight='bold'>
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
                    <Text
                        as='p'
                        color={disabled ? 'less-prominent' : 'prominent'}
                        weight='bold'
                        size='sm'
                        className={`${card_classname}__h2-header`}
                    >
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
                                  <Text as='p' size='xs' color={disabled ? 'less-prominent' : 'prominent'}>
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
                                  <Text as='p' size='xs' color={disabled ? 'less-prominent' : 'prominent'}>
                                      <Localize i18n_default_text={item} />
                                  </Text>
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
    poi_poa_pending,
    checked,
    setChecked,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    poa_failed,
    poi_failed,
}: TJurisdictionModalContent) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;
    const poa_none = poa_status === PoaStatusCodes.none;
    const poi_none = poi_status === PoaStatusCodes.none;
    const poi_poa_none = poi_none || poa_none;

    const poi_poa_verified = poi_status === PoaStatusCodes.verified && poa_status === PoaStatusCodes.verified;

    const cardsToBeShown = (type_of_card: string) => {
        const is_available =
            account_type === 'synthetic'
                ? synthetic_available_accounts?.some(account => account.shortcode === type_of_card)
                : financial_available_accounts?.some(account => account.shortcode === type_of_card);
        return is_available;
    };

    const disableCard = (type_of_card: string) => {
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
                {poi_poa_none && jurisdiction_selected_shortcode !== 'svg' && jurisdiction_selected_shortcode && (
                    <Text
                        as='p'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className={`${card_classname}__footnote`}
                    >
                        <Localize i18n_default_text='To create this account first we need your proof of identity and address.' />
                    </Text>
                )}
                {poi_failed &&
                    !poa_failed &&
                    !poi_poa_none &&
                    jurisdiction_selected_shortcode &&
                    jurisdiction_selected_shortcode !== 'svg' && (
                        <Text
                            as='p'
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
                    !poi_failed &&
                    !poi_poa_none &&
                    jurisdiction_selected_shortcode &&
                    jurisdiction_selected_shortcode !== 'svg' && (
                        <Text
                            as='p'
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
                    poi_failed &&
                    jurisdiction_selected_shortcode &&
                    jurisdiction_selected_shortcode !== 'svg' && (
                        <Text
                            as='p'
                            align='center'
                            size='xs'
                            weight='bold'
                            line_height='xs'
                            className={`${card_classname}__footnote`}
                        >
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity and address.' />
                        </Text>
                    )}
                {jurisdiction_selected_shortcode === 'svg' && (
                    <div className={`${card_classname}__footnote`}>
                        <Text as='p' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize
                                i18n_default_text='Add your DMT5 {{account_type}} account under Deriv (SVG) LLC (company no. 273 LLC 2020).'
                                values={{ account_type: account_type_name }}
                            />
                        </Text>
                    </div>
                )}
                {is_fully_authenticated && jurisdiction_selected_shortcode === 'bvi' && (
                    <div className={`${card_classname}__footnote`}>
                        <Text as='p' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize
                                i18n_default_text='Add your DMT5 {{account_type}} account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/{{line_break}}L/18/1114).'
                                values={{ account_type: account_type_name, line_break: '\n' }}
                            />
                        </Text>
                    </div>
                )}
                {is_fully_authenticated && jurisdiction_selected_shortcode === 'vanuatu' && (
                    <div className={`${card_classname}__footnote`}>
                        <Text as='p' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize
                                i18n_default_text='Add Your DMT5 {{account_type}} account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.'
                                values={{ account_type: account_type_name }}
                            />
                        </Text>
                    </div>
                )}
                {is_fully_authenticated && jurisdiction_selected_shortcode === 'labuan' && (
                    <div className={`${card_classname}__footnote`}>
                        <Text as='p' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize
                                i18n_default_text='Add your DMT5 {{account_type}} STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority(licence no. MB/18/0024).'
                                values={{ account_type: account_type_name }}
                            />
                        </Text>
                    </div>
                )}
                {poi_poa_pending && jurisdiction_selected_shortcode !== 'svg' && jurisdiction_selected_shortcode && (
                    <div className={`${card_classname}__footnote--pending`}>
                        <Text as='p' align='center' color='yellow' weight='bold' size='xs' line_height='xs'>
                            <Localize i18n_default_text='Your documents are being reviewed, we will notify you once this account is ready for you to create.' />
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

    const ModalCheckbox = ({
        onCheck,
        is_checked,
    }: {
        onCheck: React.Dispatch<React.SetStateAction<boolean>>;
        is_checked: boolean;
    }) => (
        <div className={`${card_classname}__jurisdiction-checkbox`}>
            <Checkbox onChange={() => onCheck(!checked)} value={is_checked} />
            <Text as='p' align='center' size='xs' line_height='xs'>
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
        </div>
    );

    return (
        <>
            <div className={`${card_classname}__wrapper`}>
                {cardsToBeShown('bvi') && (
                    <JurisdictionCard
                        type_of_card='bvi'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        account_type={account_type}
                        poi_poa_pending={poi_poa_pending}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                        disabled={disableCard('bvi')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                    />
                )}

                {cardsToBeShown('maltainvest') && is_eu && (
                    <JurisdictionCard
                        type_of_card='maltainvest'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        poi_poa_pending={poi_poa_pending}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                        disabled={disableCard('maltainvest')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                    />
                )}

                {cardsToBeShown('vanuatu') && (
                    <JurisdictionCard
                        type_of_card='vanuatu'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        poi_poa_pending={poi_poa_pending}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                        disabled={disableCard('vanuatu')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                    />
                )}
                {cardsToBeShown('labuan') && (
                    <JurisdictionCard
                        type_of_card='labuan'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        poi_poa_pending={poi_poa_pending}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                        disabled={disableCard('labuan')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                    />
                )}

                {cardsToBeShown('svg') && (
                    <JurisdictionCard
                        type_of_card='svg'
                        jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        poi_poa_pending={poi_poa_pending}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                        disabled={disableCard('svg')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                    />
                )}
            </div>
            <ModalFootNote />
            {is_fully_authenticated &&
                poi_poa_verified &&
                jurisdiction_selected_shortcode &&
                jurisdiction_selected_shortcode !== 'svg' && (
                    <ModalCheckbox is_checked={checked} onCheck={setChecked} />
                )}
        </>
    );
};

export default connect(({ modules: { cfd }, client }: RootStore) => ({
    account_status: client.account_status,
    real_financial_accounts_existing_data: cfd.real_financial_accounts_existing_data,
    real_synthetic_accounts_existing_data: cfd.real_synthetic_accounts_existing_data,
}))(JurisdictionModalContent);
