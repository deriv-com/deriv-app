import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, ButtonLink, Clipboard, Dropdown, Icon, Loading, Text } from '@deriv/components';
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
    setIsDeposit,
}) => {
    React.useEffect(() => {
        recentTransactionOnMount();
    }, [recentTransactionOnMount]);

    React.useEffect(() => {
        setIsDeposit(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        pollApiForDepositAddress(false);
    }, [pollApiForDepositAddress]);

    const eth_option_list = [
        { text: <Localize i18n_default_text='Binance Smart Chain' />, value: 1 },
        { text: <Localize i18n_default_text='Ethereum (ERC20)' />, value: 2 },
        { text: <Localize i18n_default_text='Ethereum (ETH)' />, value: 3 },
    ];

    const [eth_option_message, setEthOptionMessage] = useState('');
    const [eth_option_list_value, setEthOptionListValue] = useState(0);
    const [eth_qrcode_header, setEthQRCodeHeader] = useState('');

    const onChangeEthListOption = event => {
        if (event.target.value === eth_option_list[0].value) {
            setEthOptionMessage(
                <Localize i18n_default_text='We do not support Binance Smart Chain tokens to deposit, please use only Ethereum (ETH).' />
            );
        } else if (event.target.value === eth_option_list[1].value) {
            setEthOptionMessage(
                <Localize i18n_default_text='This is an Ethereum (ETH) only address, please do not use ERC20 tokens.' />
            );
        } else if (event.target.value === eth_option_list[2].value) {
            setEthOptionMessage('');
            setEthQRCodeHeader(
                <Localize i18n_default_text="Do not send any other currency to the following address. Otherwise, you'll lose funds." />
            );
        }
        setEthOptionListValue(event.target.value);
    };

    if (is_deposit_address_loading) {
        return <Loading is_fullscreen />;
    }

    const currency_name = getCurrencyName(currency);
    const currency_display_code = CryptoConfig.get()[currency].display_code;

    let header_note;
    if (['USDC', 'eUSDT'].includes(currency)) {
        header_note = (
            <Localize
                i18n_default_text='To avoid loss of funds, please <0>do not send</0> ETH, and <1>do not use</1> Binance Chain (BNB) and Binance Smart Chain (BSC) networks.'
                components={[<strong key={0} />, <strong key={1} />]}
            />
        );
    } else if (currency === 'ETH') {
        header_note = (
            <Localize i18n_default_text='Please select the network from where your deposit will come from.' />
        );
    } else {
        header_note = (
            <Localize i18n_default_text="Do not send any other currency to the following address. Otherwise, you'll lose funds." />
        );
    }

    return (
        <div className='cashier__wrapper crypto-deposit__wrapper'>
            <div className='crypto-deposit__transaction-wrapper'>
                <Icon icon={`IcCurrency-${currency?.toLowerCase()}`} size={64} />
                <Text
                    align='center'
                    as='p'
                    className='crypto-deposit__transaction-currency'
                    line_height='m'
                    size={isMobile() ? 'xs' : 's'}
                    weight='bold'
                >
                    <Localize
                        i18n_default_text='Send only {{currency}} ({{currency_symbol}}) to this address.'
                        values={{
                            currency: currency_name,
                            currency_symbol: currency_display_code,
                        }}
                    />
                </Text>
                {api_error ? (
                    <div className='crypto-api-error'>
                        <Text as='p' align='center' size='xs' className='crypto-api-error__text'>
                            <Icon width={30} height={20} icon='IcAlertWarning' />
                            <Localize i18n_default_text="Unfortunately, we couldn't get the address since our server was down. Please click Refresh to reload the address or try again later." />
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
                        <Text as='p' align='center' line_height='m' size={isMobile() ? 'xs' : 's'}>
                            {eth_qrcode_header || header_note}
                        </Text>
                        {currency === 'ETH' && (
                            <>
                                {eth_option_list_value !== eth_option_list[2].value && (
                                    <Dropdown
                                        className='crypto-deposit__dropdown-menu'
                                        is_align_text_left
                                        list={eth_option_list}
                                        name='eth-dropdown'
                                        onChange={onChangeEthListOption}
                                        placeholder={localize('Choose an option')}
                                        value={eth_option_list_value}
                                    />
                                )}
                                {eth_option_message && (
                                    <Text
                                        align='center'
                                        as='p'
                                        color='loss-danger'
                                        className='crypto-deposit__eth-option-message'
                                        line_height='m'
                                        size={isMobile() ? 'xs' : 's'}
                                    >
                                        {eth_option_message}
                                    </Text>
                                )}
                            </>
                        )}
                        {(currency !== 'ETH' || eth_option_list_value === eth_option_list[2].value) && (
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
    setIsDeposit: PropTypes.func,
};

export default connect(({ modules, client }) => ({
    api_error: modules.cashier.onramp.api_error,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    deposit_address: modules.cashier.onramp.deposit_address,
    is_deposit_address_loading: modules.cashier.onramp.is_deposit_address_loading,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    pollApiForDepositAddress: modules.cashier.onramp.pollApiForDepositAddress,
    setIsDeposit: modules.cashier.setIsDeposit,
}))(CryptoDeposit);
