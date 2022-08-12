import React from 'react';
import { Icon, Text, Popover } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import classNames from 'classnames';
import { jurisdiction_contents } from 'Constants/jurisdiction-contents';
import { TJurisdictionCard } from 'Components/props.types';
import VerificationStatusBanner from './verification-status-banner';

const JurisdictionCard = ({
    jurisdiction_selected_shortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    setJurisdictionSelectedShortcode,
    account_type,
    type_of_card,
    disabled,
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

    const OneOrTwoCards = number_of_cards === 1 || number_of_cards === 2;

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
                <VerificationStatusBanner
                    type_of_card={type_of_card}
                    card_classname={card_classname}
                    disabled={disabled}
                />
            </div>
        </>
    );
};

export default JurisdictionCard;
