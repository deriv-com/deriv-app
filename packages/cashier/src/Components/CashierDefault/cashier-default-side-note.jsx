import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import { getCurrencyDisplayCode, isMobile, routes } from '@deriv/shared';
import 'Sass/cashier-default.scss';

const CashierDefaultSideNote = ({ currency, is_crypto, openRealAccountSignup, setDepositTarget }) => {
    const currency_code = getCurrencyDisplayCode(currency);

    const getSideNoteDescription = () => {
        if (is_crypto) {
            return (
                <Localize
                    i18n_default_text="Don't want to trade in {{currency_code}}? You can open another cryptocurrency account."
                    values={{ currency_code }}
                />
            );
        }

        return (
            <Localize
                i18n_default_text='If you want to change your account currency, please contact us via <0>live chat</0>.'
                components={[
                    <span
                        key={0}
                        className='link link--orange cashier-default-side-note__text-nowrap'
                        onClick={() => window.LC_API.open_chat_window()}
                    />,
                ]}
            />
        );
    };

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
                <Text className='cashier-default-side-note__text' color='prominent' weight='bold' sixe='xs' as='p'>
                    {is_crypto ? (
                        <Localize
                            i18n_default_text='This is your {{currency_code}} account.'
                            values={{ currency_code }}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='Your fiat account currency is set to {{currency_code}}.'
                            values={{ currency_code }}
                        />
                    )}
                </Text>
                <Text className='cashier-default-side-note__text' size='xxs' as='p' data-testid='side-note-text'>
                    {getSideNoteDescription()}
                </Text>
                {is_crypto && (
                    <div
                        className='cashier-default-side-note__link'
                        onClick={() => {
                            setDepositTarget(routes.cashier_deposit);
                            openRealAccountSignup('add_crypto');
                        }}
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
    currency: PropTypes.string,
    mt5_login_list: PropTypes.array,
    openRealAccountSignup: PropTypes.func,
    setDepositTarget: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    currency: client.currency,
    mt5_login_list: client.mt5_login_list,
    openRealAccountSignup: ui.openRealAccountSignup,
    setDepositTarget: modules.cashier.general_store.setDepositTarget,
}))(CashierDefaultSideNote);
