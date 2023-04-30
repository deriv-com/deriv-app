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
    const theme = is_dark ? '--dark' : '';

    const header_class_name = 'cashier-wallet-modal__header';

    const getCloseIcon = () => {
        const close_icon_map = {
            dark: {
                demo: 'IcAppstoreCloseLight',
                real: 'IcAppstoreCloseDark',
            },
            light: {
                demo: 'IcAppstoreCloseDark',
                real: 'IcAppstoreCloseLight',
            },
        };

        const icon_type = is_dark ? 'dark' : 'light';
        const icon_variant = is_demo ? 'demo' : 'real';

        return close_icon_map[icon_type][icon_variant];
    };

    const getStylesByClassName = (class_name: string) => {
        return classNames(class_name, {
            [`${class_name}-demo-dark`]: is_demo && is_dark,
            [`${class_name}-demo-light`]: is_demo && !is_dark,
        });
    };

    const getCurrencyIconSize = () => {
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
    };

    const getCurrencyIconProps = () => {
        const icon = getWalletCurrencyIcon(is_demo ? 'demo' : currency, is_dark);
        const size = getCurrencyIconSize();

        return { icon, ...size };
    };

    const getBackgroundName = () => {
        if (is_demo) {
            return 'demo';
        }
        return currency;
    };

    return (
        <div
            className={classNames(header_class_name, `wallet-modal__${getBackgroundName().toLowerCase()}-bg${theme}`, {
                [`${header_class_name}--hide-title`]: !show_wallet_name,
                [`${header_class_name}__demo`]: is_demo,
                [`${header_class_name}__demo--light`]: is_demo && !is_dark,
                [`${header_class_name}__demo--dark`]: is_demo && is_dark,
            })}
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
                            <Badge type='contained' background_color='blue' label='Demo' />
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
