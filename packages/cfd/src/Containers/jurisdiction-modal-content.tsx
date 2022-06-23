import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';

type TJurisdictionModalContent = {
    jurisdiction_selected_card: string | undefined;
    selectTypeOfCard: (card_type: string | undefined) => string | undefined;
    account_status: any[];
};

const JurisdictionModalContent = ({
    jurisdiction_selected_card,
    selectTypeOfCard,
    account_status,
}: TJurisdictionModalContent) => {
    const [verification_status] = React.useState('pending');
    const [verification_status2] = React.useState('verified');
    const [verification_status3] = React.useState('not_submitted');
    const [unselect_card, setUnselectCard] = React.useState(false);
    const [number_of_cards] = React.useState(2);

    const cardSelection = (cardType: string) => {
        setUnselectCard(!unselect_card);
        !unselect_card ? selectTypeOfCard(cardType) : selectTypeOfCard(undefined);
    };

    const Checkmark = () => (
        <Icon icon='IcCheckmark' className='cfd-jurisdiction-card__bullet-wrapper--checkmark' color='green' size={16} />
    );

    const OneOrTwoCards = number_of_cards === 1 || number_of_cards === 2;

    return (
        <>
            <div className='cfd-jurisdiction-card__wrapper'>
                {number_of_cards === 2 && (
                    <div
                        className={classNames('cfd-jurisdiction-card', {
                            'cfd-jurisdiction-card--selected': jurisdiction_selected_card === 'BVI',
                        })}
                        onClick={() => cardSelection('BVI')}
                        style={OneOrTwoCards ? { width: '32em' } : { width: '27.6em' }}
                    >
                        <div className='cfd-jurisdiction-card__over-header'>
                            <p>
                                <Localize i18n_default_text='Better leverage and spreads' />
                            </p>
                        </div>
                        <h1>
                            <Localize i18n_default_text='British Virgin Islands' />
                        </h1>
                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Selecting this will onboard you through Deriv (SVG) LLC (company no. 273 LLC 2020)' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Registered with the Financial Commission' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='170+ assets: forex (standard/micro), stocks, stock indices, commodities, basket indices, and cryptocurrencies' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Leverage up to 1:1000' />
                        </div>
                        {verification_status === 'not_submitted' && (
                            <div className='cfd-jurisdiction-card__footer'>
                                <p>
                                    <Localize i18n_default_text='You will need to submit proof of identity and address' />
                                </p>
                            </div>
                        )}
                        {verification_status === 'pending' && (
                            <div className='cfd-jurisdiction-card__verification-status'>
                                <p className='cfd-jurisdiction-card__verification-status--pending'>
                                    <Localize i18n_default_text='Pending verification' />
                                </p>
                            </div>
                        )}
                        {verification_status === 'verified' && (
                            <div className='cfd-jurisdiction-card__verification-status'>
                                <p className='cfd-jurisdiction-card__verification-status--verified'>
                                    <Localize i18n_default_text='Verified' />
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {number_of_cards === 2 && (
                    <div
                        className={classNames('cfd-jurisdiction-card', {
                            'cfd-jurisdiction-card--selected': jurisdiction_selected_card === 'Vanuatu',
                        })}
                        onClick={() => cardSelection('Vanuatu')}
                        style={OneOrTwoCards ? { width: '32em' } : { width: '27.6em' }}
                    >
                        <div className='cfd-jurisdiction-card__over-header'>
                            <p>
                                <Localize i18n_default_text='Better leverage and spreads' />
                            </p>
                        </div>
                        <h1>
                            <Localize i18n_default_text='Vanuatu' />
                        </h1>
                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Regulated by the Vanuatu Financial Services Commission' />
                        </div>
                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Registered with the Financial Commission' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='30+ assets: forex and commodities' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Leverage up to 1:1000' />
                        </div>
                        {verification_status2 === 'not_submitted' && (
                            <div className='cfd-jurisdiction-card__footer'>
                                <p>
                                    <Localize i18n_default_text='You will need to submit proof of identity and address' />
                                </p>
                            </div>
                        )}
                        {verification_status2 === 'pending' && (
                            <div className='cfd-jurisdiction-card__verification-status'>
                                <p className='cfd-jurisdiction-card__verification-status--pending'>
                                    <Localize i18n_default_text='Pending verification' />
                                </p>
                            </div>
                        )}
                        {verification_status2 === 'verified' && (
                            <div className='cfd-jurisdiction-card__verification-status'>
                                <p className='cfd-jurisdiction-card__verification-status--verified'>
                                    <Localize i18n_default_text='Verified' />
                                </p>
                            </div>
                        )}
                    </div>
                )}
                {number_of_cards === 4 && (
                    <div
                        className={classNames('cfd-jurisdiction-card', {
                            'cfd-jurisdiction-card--selected': jurisdiction_selected_card === 'Labuan',
                        })}
                        onClick={() => cardSelection('Labuan')}
                    >
                        <div className='cfd-jurisdiction-card__over-header'>
                            <p>
                                <Localize i18n_default_text='Straight through processing' />
                            </p>
                        </div>
                        <h1>Labuan</h1>
                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Regulated by the Labuan Financial Services Authority (licence no. MB/18/0024)' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Registered with the Financial Commission' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='80+ assets: forex and cryptocurrencies' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Leverage up to 1:100' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Straight through processing' />
                        </div>
                        {verification_status3 === 'not_submitted' && (
                            <div className='cfd-jurisdiction-card__footer'>
                                <p>
                                    <Localize i18n_default_text='You will need to submit proof of identity and address' />
                                </p>
                            </div>
                        )}
                        {verification_status3 === 'pending' && (
                            <div className='cfd-jurisdiction-card__verification-status'>
                                <p className='cfd-jurisdiction-card__verification-status--pending'>
                                    <Localize i18n_default_text='Pending verification' />
                                </p>
                            </div>
                        )}
                        {verification_status3 === 'verified' && (
                            <div className='cfd-jurisdiction-card__verification-status'>
                                <p className='cfd-jurisdiction-card__verification-status--verified'>
                                    <Localize i18n_default_text='Verified' />
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {number_of_cards === 4 && (
                    <div
                        className={classNames('cfd-jurisdiction-card', {
                            'cfd-jurisdiction-card--selected': jurisdiction_selected_card === 'SVG',
                        })}
                        onClick={() => cardSelection('SVG')}
                    >
                        <h1>
                            <Localize i18n_default_text='St. Vincent & Grenadines' />
                        </h1>
                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Regulated by the Labuan Financial Services Authority (licence no. MB/18/0024)' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Registered with the Financial Commission' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='80+ assets: forex and cryptocurrencies' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Leverage up to 1:100' />
                        </div>

                        <div className='cfd-jurisdiction-card__bullet-wrapper'>
                            <Checkmark />
                            <Localize i18n_default_text='Straight through processing' />
                        </div>
                        {verification_status3 === 'not_submitted' && (
                            <div className='cfd-jurisdiction-card__footer'>
                                <p>
                                    <Localize i18n_default_text='You will need to submit proof of identity and address' />
                                </p>
                            </div>
                        )}
                        {verification_status3 === 'pending' && (
                            <div className='cfd-jurisdiction-card__verification-status'>
                                <p className='cfd-jurisdiction-card__verification-status--pending'>
                                    <Localize i18n_default_text='Pending verification' />
                                </p>
                            </div>
                        )}
                        {verification_status3 === 'verified' && (
                            <div className='cfd-jurisdiction-card__verification-status'>
                                <p className='cfd-jurisdiction-card__verification-status--verified'>
                                    <Localize i18n_default_text='Verified' />
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Text as='p' align='center' size='xs' line_height='xs' className='cfd-jurisdiction-card__footnote'>
                <Localize i18n_default_text='To create this account first we need your proof of identity and address.' />
            </Text>
        </>
    );
};

export default connect(({ modules: { cfd }, client }: RootStore) => ({
    selectTypeOfCard: cfd.selectTypeOfCard,
    jurisdiction_selected_card: cfd.jurisdiction_selected_card,
    account_status: client.account_status,
}))(JurisdictionModalContent);
