import React from 'react';
import classNames from 'classnames';
import { Badge, Icon, Text } from '@deriv/components';
import { formatMoney, isMobile } from '@deriv/shared';
import { getWalletCurrencyIcon } from 'Constants/utils';

type TCashierWalletModalHeaderProps = {
    balance?: string | number;
    currency: string;
    is_dark: boolean;
    is_demo: boolean;
    closeModal: VoidFunction;
    show_wallet_name: boolean;
};

const CashierWalletModalHeader = ({
    balance,
    closeModal,
    currency,
    is_dark,
    is_demo,
    show_wallet_name,
}: TCashierWalletModalHeaderProps) => {
    const header_class_name = 'cashier-wallet-modal__header';

    const getCloseIcon = React.useCallback(() => {
        if (is_demo && is_dark) return 'IcAppstoreCloseLight';
        if (is_demo && !is_dark) return 'IcAppstoreCloseDark';
        if (is_dark) return 'IcAppstoreCloseDark';
        return 'IcAppstoreCloseLight';
    }, [is_dark, is_demo]);

    const getStylesByClassName = React.useCallback(
        (class_name: string) => {
            return classNames(class_name, {
                [`${class_name}-demo`]: is_demo,
            });
        },
        [is_demo]
    );

    const getCurrencyIconSize = React.useCallback(() => {
        const sizes = {
            mobile: {
                width: is_demo ? 64 : 48,
                height: is_demo ? 40 : 48,
            },
            desktop: {
                width: is_demo ? 128 : 64,
                height: is_demo ? 80 : 64,
            },
        };

        const size = isMobile() ? sizes.mobile : sizes.desktop;

        return size;
    }, [is_demo]);

    const getCurrencyIconProps = React.useCallback(() => {
        const icon = getWalletCurrencyIcon(is_demo ? 'demo' : currency, is_dark);
        const size = getCurrencyIconSize();

        return { icon, ...size };
    }, [currency, getCurrencyIconSize, is_dark, is_demo]);

    const getBackgroundName = React.useCallback(() => {
        if (is_demo) {
            return 'demo';
        }
        return currency;
    }, [is_demo, currency]);

    return (
        <div
            className={classNames(
                header_class_name,
                `wallet-modal__${getBackgroundName().toLowerCase()}-bg${is_dark ? '--dark' : ''}`,
                {
                    [`${header_class_name}--hide-title`]: !show_wallet_name,
                    [`${header_class_name}__demo`]: is_demo,
                }
            )}
        >
            <div className={`${header_class_name}__title-wrapper`}>
                {show_wallet_name && (
                    <div className={classNames(`${header_class_name}__title`)}>
                        <Text
                            size={isMobile() ? 'xs' : 's'}
                            as='span'
                            className={getStylesByClassName(`${header_class_name}__title-wallet`)}
                        >
                            {is_demo ? 'Demo' : ''} {currency} Wallet
                        </Text>
                        {is_demo ? (
                            <Badge type='contained' background_color='blue' label='' />
                        ) : (
                            <Badge type='bordered' label='SVG' />
                        )}
                    </div>
                )}
                <Text
                    as='p'
                    size={isMobile() ? 'xsm' : 'm'}
                    weight='bold'
                    className={getStylesByClassName(`${header_class_name}__title-balance`)}
                >
                    {formatMoney(currency, balance, true)} {currency}
                </Text>
            </div>
            {show_wallet_name && (
                <div className={classNames(`${header_class_name}__currency-icon`)}>
                    <Icon {...getCurrencyIconProps()} />
                </div>
            )}
            <div className={classNames(`${header_class_name}__close-icon`)}>
                <Icon icon={getCloseIcon()} onClick={closeModal} />
            </div>
        </div>
    );
};

export default CashierWalletModalHeader;
