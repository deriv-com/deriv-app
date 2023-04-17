import React from 'react';
import classnames from 'classnames';
import { log_types } from '@deriv/bot-skeleton';
import { Text } from '@deriv/components';
import { formatMoney, getCurrencyDisplayCode } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { TFormatMessageProps } from '../journal.types';

const FormatMessage = ({ logType, className, extra }: TFormatMessageProps) => {
    const getLogMessage = () => {
        switch (logType) {
            case log_types.LOAD_BLOCK: {
                return localize('Blocks are loaded successfully');
            }
            case log_types.NOT_OFFERED: {
                return localize('Resale of this contract is not offered.');
            }
            case log_types.PURCHASE: {
                const { longcode, transaction_id } = extra;
                return (
                    <Localize
                        i18n_default_text='<0>Bought</0>: {{longcode}} (ID: {{transaction_id}})'
                        values={{ longcode, transaction_id }}
                        components={[<Text key={0} size='xxs' styles={{ color: 'var(--status-info)' }} />]}
                        options={{ interpolation: { escapeValue: false } }}
                    />
                );
            }
            case log_types.SELL: {
                const { sold_for } = extra;
                return (
                    <Localize
                        i18n_default_text='<0>Sold for</0>: {{sold_for}}'
                        values={{ sold_for }}
                        components={[<Text key={0} size='xxs' styles={{ color: 'var(--status-warning)' }} />]}
                    />
                );
            }
            case log_types.PROFIT: {
                const { currency, profit } = extra;
                return (
                    <Localize
                        i18n_default_text='Profit amount: <0>{{profit}}</0>'
                        values={{
                            profit: `${formatMoney(currency, profit, true)} ${getCurrencyDisplayCode(currency)}`,
                        }}
                        components={[<Text key={0} size='xxs' styles={{ color: 'var(--status-success)' }} />]}
                    />
                );
            }
            case log_types.LOST: {
                const { currency, profit } = extra;
                return (
                    <Localize
                        i18n_default_text='Loss amount: <0>{{profit}}</0>'
                        values={{
                            profit: `${formatMoney(currency, profit, true)} ${getCurrencyDisplayCode(currency)}`,
                        }}
                        components={[<Text key={0} size='xxs' styles={{ color: 'var(--status-danger)' }} />]}
                    />
                );
            }
            case log_types.WELCOME_BACK: {
                return <Localize i18n_default_text='Welcome back! Your messages have been restored.' />;
            }
            default:
                return null;
        }
    };

    return <div className={classnames('journal__text', className)}>{getLogMessage()}</div>;
};

export default FormatMessage;
