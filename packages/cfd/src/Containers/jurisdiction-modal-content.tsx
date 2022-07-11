import React from 'react';
import { Icon, Text, Checkbox } from '@deriv/components';
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
    jurisdiction_selected_card: string;
    setJurisdictionSelectedCard: (card_type: string) => void;
    synthetic_available_accounts: TAvailableAccountAPI;
    financial_available_accounts: TAvailableAccountAPI;
    poa_status: string;
    poi_status: string;
    is_eu: boolean;
    is_fully_authenticated: boolean;
    is_pending_authentication: boolean;
    checked: boolean;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
    real_synthetic_accounts_existing_data: TExistingData;
    real_financial_accounts_existing_data: TExistingData;
    poa_failed: boolean;
    poi_failed: boolean;
};

type TJurisdictionCard = {
    jurisdiction_selected_card: string;
    synthetic_available_accounts: TAvailableAccountAPI;
    financial_available_accounts: TAvailableAccountAPI;
    account_type: string;
    poa_status: string;
    poi_status: string;
    is_fully_authenticated: boolean;
    is_pending_authentication: boolean;
    setJurisdictionSelectedCard: (card_type: string) => void;
    type_of_card: string;
    disabled: boolean;
    poa_failed: boolean;
    poi_failed: boolean;
};

const JurisdictionCard = ({
    jurisdiction_selected_card,
    synthetic_available_accounts,
    financial_available_accounts,
    account_type,
    poa_status,
    poi_status,
    is_fully_authenticated,
    is_pending_authentication,
    setJurisdictionSelectedCard,
    type_of_card,
    disabled,
    poa_failed,
    poi_failed,
}: TJurisdictionCard) => {
    const number_of_synthetic_accounts_to_be_shown = synthetic_available_accounts?.length;
    const number_of_financial_accounts_to_be_shown = financial_available_accounts?.length;

    const [number_of_cards] = React.useState(
        account_type === 'synthetic'
            ? number_of_synthetic_accounts_to_be_shown
            : number_of_financial_accounts_to_be_shown
    );

    const poa_verified = poa_status === PoaStatusCodes.verified;
    const poa_none = poa_status === PoaStatusCodes.none;
    const poi_verified = poi_status === PoaStatusCodes.verified;
    const poi_none = poi_status === PoaStatusCodes.none;

    const cardSelection = (cardType: string) => {
        if (jurisdiction_selected_card === cardType) {
            setJurisdictionSelectedCard('');
        } else {
            setJurisdictionSelectedCard(cardType);
        }
    };

    const Checkmark = () => (
        <Icon
            icon='IcCheckmark'
            className='cfd-jurisdiction-card__bullet-wrapper--checkmark'
            color={disabled ? 'disabled' : 'green'}
            size={18}
        />
    );

    const OneOrTwoCards = number_of_cards === 1 || number_of_cards === 2;

    const VerificationStatuses = () => (
        <>
            {poa_none && poi_none && (
                <div className='cfd-jurisdiction-card__footer'>
                    <Text size='xxxs' color={disabled ? 'less-prominent' : 'prominent'}>
                        <Localize i18n_default_text='You will need to submit proof of identity and address' />
                    </Text>
                </div>
            )}
            {!poa_failed && !poi_failed && is_pending_authentication && type_of_card && type_of_card !== 'svg' && (
                <div className='cfd-jurisdiction-card__verification-status'>
                    <div className='cfd-jurisdiction-card__verification-status--pending'>
                        <Text size='xxxs' color={disabled ? 'less-prominent' : 'prominent'}>
                            <Localize i18n_default_text='Pending verification' />
                        </Text>
                    </div>
                </div>
            )}
            {is_pending_authentication && type_of_card === 'svg' && (
                <div className='cfd-jurisdiction-card__footer'>
                    <Text size='xxxs' color={disabled ? 'less-prominent' : 'prominent'}>
                        <Localize i18n_default_text='You will need to submit proof of identity and address once you reach certain thresholds' />
                    </Text>
                </div>
            )}
            {/* {is_fully_authenticated && (
                <div className='cfd-jurisdiction-card__verification-status'>
                    <Text
                        size='xxxs'
                        color={disabled ? 'less-prominent' : 'prominent'}
                        className='cfd-jurisdiction-card__verification-status--verified'
                    >
                        <Localize i18n_default_text='Verified' />
                    </Text>
                </div>
            )} */}
            {poi_failed && !poa_failed && type_of_card && type_of_card !== 'svg' && (
                <div className='cfd-jurisdiction-card__verification-status'>
                    <div className='cfd-jurisdiction-card__verification-status--POA_POI'>
                        <Text size='xxxs' color={disabled ? 'less-prominent' : 'white'}>
                            <Localize i18n_default_text='Check your proof of identity' />
                        </Text>
                    </div>
                </div>
            )}
            {poa_failed && !poi_failed && type_of_card && type_of_card !== 'svg' && (
                <div className='cfd-jurisdiction-card__verification-status'>
                    <div className='cfd-jurisdiction-card__verification-status--POA_POI'>
                        <Text size='xxxs' color={disabled ? 'less-prominent' : 'white'}>
                            <Localize i18n_default_text='Check your proof of address' />
                        </Text>
                    </div>
                </div>
            )}
            {poa_failed && poi_failed && type_of_card && type_of_card !== 'svg' && (
                <div className='cfd-jurisdiction-card__verification-status'>
                    <div className='cfd-jurisdiction-card__verification-status--POA_POI'>
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
                className={classNames('cfd-jurisdiction-card', {
                    'cfd-jurisdiction-card--selected': jurisdiction_selected_card === type_of_card,
                })}
                onClick={disabled ? () => undefined : () => cardSelection(`${type_of_card}`)}
                style={OneOrTwoCards ? { width: '32em' } : { width: '27.6em' }}
            >
                {jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents].is_over_header_available && (
                    <div className={classNames('cfd-jurisdiction-card__over-header')}>
                        <Text as='p' color={disabled ? 'less-prominent' : 'blue'} line_height='l' weight='bold'>
                            <Localize
                                i18n_default_text={
                                    jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents]
                                        .over_header
                                }
                            />
                        </Text>
                    </div>
                )}
                <Text
                    as='h2'
                    color={disabled ? 'less-prominent' : 'prominent'}
                    weight='bold'
                    size='m'
                    className='cfd-jurisdiction-card__h2-header'
                >
                    <Localize
                        i18n_default_text={
                            jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents].header
                        }
                    />
                </Text>

                {jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents].contents.map(
                    (item, index) => (
                        <div className='cfd-jurisdiction-card__bullet-wrapper' key={index}>
                            <div>
                                <Checkmark />
                            </div>
                            <Text as='p' size='xs' line_height='xs' color={disabled ? 'less-prominent' : 'prominent'}>
                                <Localize i18n_default_text={item} />
                            </Text>
                        </div>
                    )
                )}

                <VerificationStatuses />
            </div>
        </>
    );
};

const JurisdictionModalContent = ({
    jurisdiction_selected_card,
    account_type,
    setJurisdictionSelectedCard,
    synthetic_available_accounts,
    financial_available_accounts,
    poa_status,
    poi_status,
    is_eu,
    is_fully_authenticated,
    is_pending_authentication,
    checked,
    setChecked,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    poa_failed,
    poi_failed,
}: TJurisdictionModalContent) => {
    const poa_none = poa_status === PoaStatusCodes.none;
    const poi_none = poi_status === PoaStatusCodes.none;
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
        return (
            <>
                {poa_none && poi_none && jurisdiction_selected_card !== 'svg' && jurisdiction_selected_card && (
                    <Text
                        as='p'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className='cfd-jurisdiction-card__footnote'
                    >
                        <Localize i18n_default_text='To create this account first we need your proof of identity and address.' />
                    </Text>
                )}
                {poi_failed && !poa_failed && jurisdiction_selected_card && jurisdiction_selected_card !== 'svg' && (
                    <Text
                        as='p'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className='cfd-jurisdiction-card__footnote'
                    >
                        <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity.' />
                    </Text>
                )}
                {poa_failed && !poi_failed && jurisdiction_selected_card && jurisdiction_selected_card !== 'svg' && (
                    <Text
                        as='p'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className='cfd-jurisdiction-card__footnote'
                    >
                        <Localize i18n_default_text='To create this account first we need you to resubmit your proof of address.' />
                    </Text>
                )}
                {poa_failed && poi_failed && jurisdiction_selected_card && jurisdiction_selected_card !== 'svg' && (
                    <Text
                        as='p'
                        align='center'
                        size='xs'
                        weight='bold'
                        line_height='xs'
                        className='cfd-jurisdiction-card__footnote'
                    >
                        <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity and address.' />
                    </Text>
                )}
                {jurisdiction_selected_card === 'svg' && (
                    <div className='cfd-jurisdiction-card__footnote'>
                        <Text as='p' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize i18n_default_text='Add your DMT5 Synthetics account under Deriv (SVG) LLC (company no. 273 LLC 2020).' />
                        </Text>
                    </div>
                )}
                {is_fully_authenticated && jurisdiction_selected_card === 'bvi' && (
                    <div className='cfd-jurisdiction-card__footnote'>
                        <Text as='p' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize i18n_default_text='Add your DMT5 Financial account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114).' />
                        </Text>
                    </div>
                )}
                {is_fully_authenticated && jurisdiction_selected_card === 'vanuatu' && (
                    <div className='cfd-jurisdiction-card__footnote'>
                        <Text as='p' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize i18n_default_text='Add Your DMT5 Financial account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.' />
                        </Text>
                    </div>
                )}
                {is_fully_authenticated && jurisdiction_selected_card === 'labuan' && (
                    <div className='cfd-jurisdiction-card__footnote'>
                        <Text as='p' weight='bold' align='center' size='xs' line_height='xs'>
                            <Localize i18n_default_text='Add your DMT5 Financial STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority(licence no. MB/18/0024).' />
                        </Text>
                    </div>
                )}
                {is_pending_authentication && jurisdiction_selected_card !== 'svg' && jurisdiction_selected_card && (
                    <div className='cfd-jurisdiction-card__footnote--pending'>
                        <Text as='p' align='center' color='yellow' weight='bold' size='xs' line_height='xs'>
                            <Localize i18n_default_text='Your documents are being reviewed, we will notify you once this account is ready for you to create.' />
                        </Text>
                    </div>
                )}
            </>
        );
    };

    const ModalCheckbox = ({
        onCheck,
        is_checked,
    }: {
        onCheck: React.Dispatch<React.SetStateAction<boolean>>;
        is_checked: boolean;
    }) => (
        <div className='cfd-jurisdiction-card__jurisdiction-checkbox'>
            <Checkbox onChange={() => onCheck(!checked)} value={is_checked} />
            <Text as='p' align='center' size='xs' line_height='xs'>
                I confirm and accept Deriv (V) Ltd &#39;s Terms and Conditions
            </Text>
        </div>
    );

    return (
        <>
            <div className='cfd-jurisdiction-card__wrapper'>
                {cardsToBeShown('bvi') && (
                    <JurisdictionCard
                        type_of_card='bvi'
                        jurisdiction_selected_card={jurisdiction_selected_card}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        account_type={account_type}
                        is_fully_authenticated={is_fully_authenticated}
                        is_pending_authentication={is_pending_authentication}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedCard={setJurisdictionSelectedCard}
                        disabled={disableCard('bvi')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                    />
                )}

                {cardsToBeShown('maltainvest') && is_eu && (
                    <JurisdictionCard
                        type_of_card='mf'
                        jurisdiction_selected_card={jurisdiction_selected_card}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        is_fully_authenticated={is_fully_authenticated}
                        is_pending_authentication={is_pending_authentication}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedCard={setJurisdictionSelectedCard}
                        disabled={disableCard('mf')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                    />
                )}

                {cardsToBeShown('vanuatu') && (
                    <JurisdictionCard
                        type_of_card='vanuatu'
                        jurisdiction_selected_card={jurisdiction_selected_card}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        is_fully_authenticated={is_fully_authenticated}
                        is_pending_authentication={is_pending_authentication}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedCard={setJurisdictionSelectedCard}
                        disabled={disableCard('vanuatu')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                    />
                )}
                {cardsToBeShown('labuan') && (
                    <JurisdictionCard
                        type_of_card='labuan'
                        jurisdiction_selected_card={jurisdiction_selected_card}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        is_fully_authenticated={is_fully_authenticated}
                        is_pending_authentication={is_pending_authentication}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedCard={setJurisdictionSelectedCard}
                        disabled={disableCard('labuan')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                    />
                )}

                {cardsToBeShown('svg') && (
                    <JurisdictionCard
                        type_of_card='svg'
                        jurisdiction_selected_card={jurisdiction_selected_card}
                        synthetic_available_accounts={synthetic_available_accounts}
                        financial_available_accounts={financial_available_accounts}
                        is_fully_authenticated={is_fully_authenticated}
                        is_pending_authentication={is_pending_authentication}
                        account_type={account_type}
                        poa_status={poa_status}
                        poi_status={poi_status}
                        setJurisdictionSelectedCard={setJurisdictionSelectedCard}
                        disabled={disableCard('svg')}
                        poa_failed={poa_failed}
                        poi_failed={poi_failed}
                    />
                )}
            </div>
            <ModalFootNote />
            {is_fully_authenticated &&
                poi_poa_verified &&
                jurisdiction_selected_card &&
                jurisdiction_selected_card !== 'svg' && <ModalCheckbox is_checked={checked} onCheck={setChecked} />}
        </>
    );
};

export default connect(({ modules: { cfd }, client }: RootStore) => ({
    account_status: client.account_status,
    real_financial_accounts_existing_data: cfd.real_financial_accounts_existing_data,
    real_synthetic_accounts_existing_data: cfd.real_synthetic_accounts_existing_data,
}))(JurisdictionModalContent);
