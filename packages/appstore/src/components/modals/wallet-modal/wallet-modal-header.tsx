import React from 'react';
import classNames from 'classnames';
import { Badge, Icon, Text } from '@deriv/components';
import { formatMoney, getCurrencyDisplayCode } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { getWalletCurrencyIcon } from '@deriv/utils';

type TWalletModalHeaderProps = {
    balance?: string | number;
    currency: string;
    is_dark: boolean;
    is_demo: boolean;
    is_mobile: boolean;
    shortcode: string;
    closeModal: VoidFunction;
    is_wallet_name_visible: boolean;
    gradient_class: string;
};

const WalletModalHeader = ({
    balance,
    closeModal,
    currency,
    is_dark,
    is_demo,
    is_mobile,
    shortcode,
    is_wallet_name_visible,
    gradient_class,
}: TWalletModalHeaderProps) => {
    const header_class_name = 'modal-header';

    const wallet_title = React.useMemo(() => {
        return `${is_demo ? localize('Demo') : ''} ${getCurrencyDisplayCode(currency)} ${localize('Wallet')}`;
    }, [currency, is_demo]);

    const getBadgeLabel = React.useCallback(() => {
        if (is_demo) return localize('Demo');
        switch (shortcode) {
            case 'svg':
                return shortcode.toUpperCase();
            case 'malta':
            case 'maltainvest':
                return 'malta'.toUpperCase();
            default:
                return '';
        }
    }, [is_demo, shortcode]);

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
        // TODO: add p2p and payment_agent check
        const is_square_icon =
            ['btc', 'eth', 'ltc', 'usdt', 'eusdt', 'tusdt', 'ust', 'usdc', 'p2p', 'payment_agent'].includes(
                currency.toLowerCase()
            ) || is_demo;

        const sizes = {
            mobile: {
                width: is_square_icon ? 64 : 48,
                height: is_square_icon ? 40 : 48,
            },
            desktop: {
                width: is_square_icon ? 128 : 64,
                height: is_square_icon ? 80 : 64,
            },
        };

        const size = is_mobile ? sizes.mobile : sizes.desktop;

        return size;
    }, [currency, is_demo, is_mobile]);

    const getCurrencyIconProps = React.useCallback(() => {
        const icon = getWalletCurrencyIcon(is_demo ? 'demo' : currency, is_dark, true);
        const size = getCurrencyIconSize();

        return { icon, ...size };
    }, [currency, getCurrencyIconSize, is_dark, is_demo]);

    return (
        <div className={`header-background ${gradient_class}`}>
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
                            {wallet_title}
                        </Text>
                        {is_demo ? (
                            <Badge type='contained' background_color='blue' label={getBadgeLabel()} />
                        ) : (
                            <Badge type='bordered' label={getBadgeLabel()} />
                        )}
                    </div>
                    <Text
                        as='p'
                        size={is_mobile ? 'xsm' : 'm'}
                        weight='bold'
                        className={getStylesByClassName(`${header_class_name}__title-balance`)}
                    >
                        {formatMoney(currency, balance, true)} {getCurrencyDisplayCode(currency)}
                    </Text>
                </div>
                {/* TODO: replace Icon with WalletIcon component  */}
                <div className={classNames(`${header_class_name}__currency-icon icon-visibility`)}>
                    <Icon {...getCurrencyIconProps()} data_testid='dt_currency_icon' />
                </div>
                <div className={classNames(`${header_class_name}__close-icon`)}>
                    <Icon icon={getCloseIcon()} onClick={closeModal} data_testid='dt_close_icon' />
                </div>
            </div>
        </div>
    );
};

export default WalletModalHeader;
