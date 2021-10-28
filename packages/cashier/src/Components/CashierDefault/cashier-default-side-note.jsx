import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import { CryptoConfig, isMobile } from '@deriv/shared';

const CashierDefaultSideNote = ({ can_change_fiat_currency, currency, is_crypto, openRealAccountSignup }) => {
    currency = CryptoConfig.get()[currency].display_code;
    return (
        <div
            className={classNames({
                'cashier-default-detail': isMobile(),
            })}
        >
            <div
                className={classNames({
                    'cashier-default-detail__div': isMobile(),
                })}
            >
                <Text className='cashier-side-note__text' color='prominent' weight='bold' sixe='xs' as='p'>
                    {is_crypto ? (
                        <Localize i18n_default_text='This is your {{currency}} account.' values={{ currency }} />
                    ) : (
                        <Localize
                            i18n_default_text="Your fiat account's currency is currently set to {{currency}}."
                            values={{ currency }}
                        />
                    )}
                </Text>
                <Text className='cashier-side-note__text' size='xxs' as='p'>
                    {is_crypto ? (
                        <Localize
                            i18n_default_text="Don't want to trade in {{currency}}? You can open another cryptocurrency account."
                            values={{ currency }}
                        />
                    ) : can_change_fiat_currency ? (
                        <Localize
                            i18n_default_text='You can <0>set a new currency</0> before you deposit for the first time or create an MT5 account.'
                            components={[
                                <a
                                    key={0}
                                    className='link link--orange'
                                    onClick={() => openRealAccountSignup('manage')}
                                />,
                            ]}
                        />
                    ) : (
                        <Localize
                            i18n_default_text="You can no longer change your account currency because you've either made a deposit or created a DMT5 account. Please contact us via <0>live chat</0> for clarification."
                            components={[
                                <span
                                    key={0}
                                    className='link link--orange'
                                    onClick={() => window.LC_API.open_chat_window()}
                                />,
                            ]}
                        />
                    )}
                </Text>
                {is_crypto && (
                    <div
                        className='cashier-default-side-note__link'
                        onClick={() => openRealAccountSignup('add_crypto')}
                    >
                        <Text size='xxs' color='red'>
                            <Localize i18n_default_text='Manage your accounts ' />
                        </Text>
                        <Icon icon='IcChevronRight' color='red' />
                    </div>
                )}
            </div>
        </div>
    );
};

CashierDefaultSideNote.propTypes = {
    can_change_fiat_currency: PropTypes.bool,
    currency: PropTypes.string,
    mt5_login_list: PropTypes.array,
    openRealAccountSignup: PropTypes.func,
};

export default connect(({ client, ui }) => ({
    can_change_fiat_currency: client.can_change_fiat_currency,
    currency: client.currency,
    mt5_login_list: client.mt5_login_list,
    openRealAccountSignup: ui.openRealAccountSignup,
}))(CashierDefaultSideNote);
