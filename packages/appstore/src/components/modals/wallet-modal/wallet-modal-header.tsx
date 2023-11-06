import React from 'react';
import classNames from 'classnames';
import { Icon, Text, WalletIcon } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { getAccountName } from 'Constants/utils';
import { WalletJurisdictionBadge } from 'Components/wallet-jurisdiction-badge';
import type { TWalletAccount } from 'Types';

type TWalletModalHeaderProps = {
    closeModal: VoidFunction;
    is_dark: boolean;
    is_mobile: boolean;
    is_wallet_name_visible: boolean;
    wallet: TWalletAccount;
};

const WalletModalHeader = ({
    closeModal,
    is_dark,
    is_mobile,
    is_wallet_name_visible,
    wallet,
}: TWalletModalHeaderProps) => {
    const { balance, currency, icon, currency_config, is_demo, gradient_header_class, landing_company_name } = wallet;
    const is_crypto = currency_config?.is_crypto;
    const display_currency_code = currency_config?.display_code;

    const header_class_name = 'wallet-modal--header';

    const getCloseIcon = React.useCallback(() => {
        if (is_demo && is_dark) return 'IcAppstoreCloseLight';
        if (is_demo && !is_dark) return 'IcAppstoreCloseDark';
        if (is_dark) return 'IcAppstoreCloseDark';
        return 'IcAppstoreCloseLight';
    }, [is_dark, is_demo]);

    const getWalletIcon = React.useCallback(() => {
        if (currency && ['USDT', 'eUSDT', 'tUSDT', 'UST'].includes(currency)) {
            return is_dark ? 'IcWalletModalTetherDark' : 'IcWalletModalTetherLight';
        }
        return icon;
    }, [currency, icon, is_dark]);

    const getStylesByClassName = (class_name: string) => {
        return classNames(class_name, {
            [`${class_name}-demo`]: is_demo,
        });
    };

    const getWalletIconType = (): React.ComponentProps<typeof WalletIcon>['type'] => {
        if (is_demo) return 'demo';
        return is_crypto ? 'crypto' : 'fiat';
    };

    const getWalletIconSize = (): React.ComponentProps<typeof WalletIcon>['size'] => {
        if (is_mobile) return is_demo || is_crypto ? 'large' : 'xlarge';
        return 'xxlarge';
    };

    return (
        <div className={`wallet-modal--header-background ${gradient_header_class}`}>
            <div
                className={classNames(header_class_name, {
                    [`${header_class_name}--hidden-title`]: is_mobile && !is_wallet_name_visible,
                })}
            >
                <div className={`${header_class_name}__title-wrapper`}>
                    <div className={classNames(`${header_class_name}__title title-visibility`)}>
                        <Text
                            size={is_mobile ? 'xs' : 's'}
                            as='span'
                            className={getStylesByClassName(`${header_class_name}__title-wallet`)}
                        >
                            {getAccountName({
                                display_currency_code: wallet.currency_config?.display_code,
                                account_type: 'wallet',
                            })}
                        </Text>
                        <WalletJurisdictionBadge is_demo={is_demo} shortcode={landing_company_name} />
                    </div>
                    <Text
                        as='p'
                        size={is_mobile ? 'xsm' : 'm'}
                        weight='bold'
                        className={getStylesByClassName(`${header_class_name}__title-balance`)}
                        data-testid='dt_wallet_balance'
                    >
                        {formatMoney(currency || '', balance, true)} {display_currency_code}
                    </Text>
                </div>
                <div className={classNames(`${header_class_name}__currency-icon icon-visibility`)}>
                    <WalletIcon icon={getWalletIcon()} type={getWalletIconType()} size={getWalletIconSize()} />
                </div>
                <div className={classNames(`${header_class_name}__close-icon`)}>
                    <Icon icon={getCloseIcon()} onClick={closeModal} data_testid='dt_close_icon' />
                </div>
            </div>
        </div>
    );
};

export default WalletModalHeader;
