import React from 'react';
import classNames from 'classnames';
import { Icon, Text, WalletJurisdictionBadge, WalletIcon } from '@deriv/components';
import { useCurrencyConfig } from '@deriv/hooks';
import { formatMoney } from '@deriv/shared';
import { localize } from '@deriv/translations';
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
    const {
        balance,
        currency,
        icon,
        is_crypto,
        is_demo,
        gradient_header_class: gradient_class,
        landing_company_name: shortcode,
        name,
    } = wallet;

    const { getConfig } = useCurrencyConfig();

    const header_class_name = 'modal-header';

    const getCloseIcon = React.useCallback(() => {
        if (is_demo && is_dark) return 'IcAppstoreCloseLight';
        if (is_demo && !is_dark) return 'IcAppstoreCloseDark';
        if (is_dark) return 'IcAppstoreCloseDark';
        return 'IcAppstoreCloseLight';
    }, [is_dark, is_demo]);

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
                            {localize('{{wallet_name}}', { wallet_name: name })}
                        </Text>
                        <WalletJurisdictionBadge is_demo={is_demo} shortcode={shortcode} />
                    </div>
                    <Text
                        as='p'
                        size={is_mobile ? 'xsm' : 'm'}
                        weight='bold'
                        className={getStylesByClassName(`${header_class_name}__title-balance`)}
                    >
                        {formatMoney(currency || '', balance, true)} {getConfig(currency || '')?.display_code}
                    </Text>
                </div>
                <div className={classNames(`${header_class_name}__currency-icon icon-visibility`)}>
                    <WalletIcon icon={icon} type={getWalletIconType()} size={getWalletIconSize()} />
                </div>
                <div className={classNames(`${header_class_name}__close-icon`)}>
                    <Icon icon={getCloseIcon()} onClick={closeModal} data_testid='dt_close_icon' />
                </div>
            </div>
        </div>
    );
};

export default WalletModalHeader;
