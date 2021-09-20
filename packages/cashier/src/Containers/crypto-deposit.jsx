import PropTypes from 'prop-types';
import React from 'react';
import { Button, ButtonLink, Clipboard, Loading, Text, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { CryptoConfig, getCurrencyName, isCryptocurrency, isMobile } from '@deriv/shared';
import QRCode from 'qrcode.react';
import { connect } from 'Stores/connect';
import RecentTransaction from 'Components/recent-transaction.jsx';
import '../Sass/deposit.scss';

const CryptoDeposit = ({
    api_error,
    currency,
    crypto_transactions,
    deposit_address,
    is_deposit_address_loading,
    recentTransactionOnMount,
    pollApiForDepositAddress,
}) => {
    React.useEffect(() => {
        recentTransactionOnMount();
    }, [recentTransactionOnMount]);

    React.useEffect(() => {
        return () => pollApiForDepositAddress(false);
    }, [pollApiForDepositAddress]);

    if (is_deposit_address_loading) {
        return <Loading is_fullscreen={false} />;
    }

    const currency_name = getCurrencyName(currency);
    const currency_display_code = CryptoConfig.get()[currency].display_code;

    const header_note =
        currency === 'USDC' || currency === 'eUSDT' ? (
            <Localize
                i18n_default_text='To avoid loss of funds, please <0>do not send</0> ETH, and <1>do not use</1> Binance Chain (BNB) and Binance Smart Chain (BSC) networks.'
                components={[<strong key={0} />, <strong key={1} />]}
            />
        ) : currency === 'ETH' ? (
            <Localize
                i18n_default_text='To avoid loss of funds, please <0>do not send</0> ERC20 tokens, and <1>do not use</1> Binance Chain (BNB) and Binance Smart Chain (BSC) networks.'
                components={[<strong key={0} />, <strong key={1} />]}
            />
        ) : (
            <Localize i18n_default_text="Do not send any other currency to the following address. Otherwise, you'll lose funds." />
        );

    return (
        <div className='cashier__wrapper crypto-deposit__wrapper'>
            <div className='crypto-deposit__transaction-wrapper'>
                <Icon icon={`IcCurrency-${currency?.toLowerCase()}`} size={64} />
                <Text
                    className='crypto-deposit__transaction-currency'
                    weight='bold'
                    as='p'
                    line_height='m'
                    size={isMobile() ? 'xs' : 's'}
                    align='center'
                >
                    <Localize
                        i18n_default_text='Send only {{currency}} ({{currency_symbol}}) to this address.'
                        values={{
                            currency: currency_name,
                            currency_symbol: currency_display_code,
                        }}
                    />
                </Text>
                <Text as='p' line_height='m' size={isMobile() ? 'xs' : 's'} align='center'>
                    {header_note}
                </Text>

                {api_error ? (
                    <div className='crypto-api-error'>
                        <Text as='p' align='center' size='xs' className='crypto-api-error__text'>
                            <Icon icon='IcAlertWarning' />
                            <Localize i18n_default_text='Our server cannot retrieve an address' />
                        </Text>
                        <Button
                            text={localize('Refresh')}
                            onClick={() => pollApiForDepositAddress(false)}
                            secondary
                            small
                        />
                    </div>
                ) : (
                    <>
                        <QRCode className='qrcode' value={deposit_address} size={160} />
                        <div className='crypto-deposit__clipboard-wrapper'>
                            <Text
                                className='crypto-deposit__address-hash'
                                line_height='m'
                                size={isMobile() ? 'xxs' : 'xs'}
                                weight='bold'
                                align='center'
                            >
                                {deposit_address}
                            </Text>
                            <Clipboard
                                className='crypto-deposit__clipboard'
                                text_copy={deposit_address}
                                info_message={isMobile() ? '' : localize('copy')}
                                icon='IcCashierClipboard'
                                success_message={localize('copied!')}
                                popoverAlignment={isMobile() ? 'left' : 'bottom'}
                            />
                        </div>
                    </>
                )}
            </div>
            <div className='crypto-deposit__fiat-onramp-wrapper'>
                <div className='crypto-deposit__fiat-onramp-description'>
                    <Text as='p' line_height='m' size={isMobile() ? 'xs' : 's'} align='center'>
                        <Localize i18n_default_text='Looking for a way to buy cryptocurrency?' />
                    </Text>
                    {isMobile() ? null : <br />}
                    <Text as='p' line_height='m' size={isMobile() ? 'xs' : 's'} align='center'>
                        <Localize i18n_default_text='Use our fiat onramp services to buy and deposit cryptocurrency into your Deriv account.' />
                    </Text>
                </div>
                <ButtonLink className='crypto-deposit__fiat-onramp-button' has_effect to='/cashier/on-ramp'>
                    <Text as='p' weight='bold' color='colored-background' size='xs'>
                        <Localize i18n_default_text='Try our Fiat onramp' />
                    </Text>
                </ButtonLink>
            </div>
            {isMobile() && isCryptocurrency(currency) && crypto_transactions?.length ? <RecentTransaction /> : null}
        </div>
    );
};

CryptoDeposit.propTypes = {
    api_error: PropTypes.string,
    crypto_transactions: PropTypes.array,
    currency: PropTypes.string,
    deposit_address: PropTypes.string,
    is_deposit_address_loading: PropTypes.bool,
    recentTransactionOnMount: PropTypes.func,
    pollApiForDepositAddress: PropTypes.func,
};

export default connect(({ modules, client }) => ({
    api_error: modules.cashier.onramp.api_error,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    deposit_address: modules.cashier.onramp.deposit_address,
    is_deposit_address_loading: modules.cashier.onramp.is_deposit_address_loading,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    pollApiForDepositAddress: modules.cashier.onramp.pollApiForDepositAddress,
}))(CryptoDeposit);
