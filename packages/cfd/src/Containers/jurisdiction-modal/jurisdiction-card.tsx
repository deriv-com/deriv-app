import React from 'react';
import classNames from 'classnames';
import { Icon, Text, Popover } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { jurisdiction_contents } from '../../Constants/jurisdiction-contents';
import { TJurisdictionCardProps } from '../props.types';
import VerificationStatusBanner from './jurisdiction-card-banner';

const JurisdictionCard = ({
    account_type,
    disabled,
    context,
    jurisdiction_selected_shortcode,
    financial_available_accounts,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    type_of_card,
}: TJurisdictionCardProps) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;
    const number_of_synthetic_accounts_to_be_shown = synthetic_available_accounts?.length;
    const number_of_financial_accounts_to_be_shown = financial_available_accounts?.length;

    const is_synthetic = account_type === 'synthetic';
    const [number_of_cards] = React.useState(
        is_synthetic ? number_of_synthetic_accounts_to_be_shown : number_of_financial_accounts_to_be_shown
    );

    const one_or_two_cards = [1, 2].includes(number_of_cards);

    const card_values = jurisdiction_contents[type_of_card as keyof typeof jurisdiction_contents];

    const card_data = is_synthetic ? card_values.synthetic_contents : card_values.financial_contents;

    const cardSelection = (cardType: string) => {
        setJurisdictionSelectedShortcode(jurisdiction_selected_shortcode === cardType ? '' : cardType);
    };

    const Checkmark = () => (
        <Icon icon='IcCheckmark' className={`${card_classname}__bullet-wrapper--checkmark`} color={'green'} size={18} />
    );

    return (
        <React.Fragment>
            <div
                className={classNames(card_classname, {
                    [`${card_classname}--selected`]: jurisdiction_selected_shortcode === type_of_card,
                })}
                onClick={disabled ? () => undefined : () => cardSelection(type_of_card)}
                style={one_or_two_cards ? { width: '32em' } : { width: '27.6em' }}
            >
                {card_values.is_over_header_available && (
                    <div className={classNames(`${card_classname}__over-header`)}>
                        <Text as='p' color={'info-blue'} line_height='xxl' weight='bold'>
                            <Localize i18n_default_text={card_values.over_header} />
                        </Text>
                    </div>
                )}
                <div className={`${card_classname}__info-container`}>
                    <Text as='p' color={'prominent'} weight='bold' size='sm' className={`${card_classname}__h2-header`}>
                        <Localize i18n_default_text={card_values.header} />
                    </Text>
                    {card_data.map((item, index) => (
                        <div className={`${card_classname}__bullet-wrapper`} key={index}>
                            <div>
                                <Checkmark />
                            </div>
                            <Text as='p' size='xs' color={'prominent'}>
                                <Localize i18n_default_text={item} />
                            </Text>
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
                <VerificationStatusBanner
                    type_of_card={type_of_card}
                    card_classname={card_classname}
                    disabled={disabled}
                    context={context}
                    account_type={account_type}
                />
            </div>
        </React.Fragment>
    );
};

export default JurisdictionCard;
