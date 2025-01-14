import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount, useLandingCompany, useWalletAccountsList } from '@deriv/api-v2';
import { getInitialLanguage, Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { redirectToOutSystems } from '../../helpers/urls';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { defineSwitcherWidth } from '../../utils/utils';
import './WalletListHeader.scss';

const WalletListHeader: React.FC = () => {
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const switchWalletAccount = useWalletAccountSwitcher();
    const { data: landingCompany } = useLandingCompany();
    const demoTextRef = useRef<HTMLDivElement>(null);
    const realTextRef = useRef<HTMLDivElement>(null);
    const language = getInitialLanguage();

    const demoAccount = wallets?.find(wallet => wallet.is_virtual)?.loginid;
    const firstRealAccount = wallets?.find(wallet => !wallet.is_virtual && !wallet.is_disabled)?.loginid;
    const hasAnyRealWallets = wallets?.some(wallet => !wallet.is_virtual);
    const hasAnyActiveRealWallets = wallets?.some(wallet => !wallet.is_virtual && !wallet.is_disabled);
    const shouldShowSwitcher = (demoAccount && firstRealAccount) || !hasAnyActiveRealWallets;
    const isDemo = activeWallet?.is_virtual;
    const shouldDisableSwitcher = hasAnyRealWallets && !hasAnyActiveRealWallets;
    const shortcode = landingCompany?.financial_company?.shortcode ?? landingCompany?.gaming_company?.shortcode;

    const [isChecked, setIsChecked] = useState(!isDemo);

    useEffect(() => {
        const updateWidths = () => {
            if (demoTextRef.current && realTextRef.current) {
                const demoWidth = demoTextRef.current.offsetWidth;
                const realWidth = realTextRef.current.offsetWidth;
                defineSwitcherWidth(realWidth, demoWidth);
            }
        };

        updateWidths();

        const resizeObserver = new ResizeObserver(updateWidths);
        resizeObserver.observe(demoTextRef.current as Element);
        resizeObserver.observe(realTextRef.current as Element);

        return () => {
            resizeObserver.disconnect();
        };
    }, [language]);

    const handleToggle = () => {
        setIsChecked(prev => !prev);
        if (!hasAnyActiveRealWallets && isDemo) {
            return redirectToOutSystems(shortcode);
        }
        if (firstRealAccount && activeWallet?.loginid === demoAccount) {
            switchWalletAccount(firstRealAccount);
        } else if (demoAccount) {
            switchWalletAccount(demoAccount);
        }
    };

    useEffect(() => {
        setIsChecked(!isDemo);
    }, [isDemo]);

    return (
        <div className='wallets-list-header'>
            <Text align='start' size='xl' weight='bold'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
            {shouldShowSwitcher && (
                <div className='wallets-list-header__switcher-container'>
                    <div className='wallets-list-header__label'>
                        <div className='wallets-list-header__label-item' ref={demoTextRef}>
                            <Text align='start' size='sm'>
                                <Localize i18n_default_text='Demo' />
                            </Text>
                        </div>
                        <div
                            className={classNames('wallets-list-header__label-item', {
                                'wallets-list-header__label-item--disabled': shouldDisableSwitcher,
                            })}
                            data-testid='dt_wallets_list_header__label_item_real'
                            ref={realTextRef}
                        >
                            <Text align='start' size='sm'>
                                <Localize i18n_default_text='Real' />
                            </Text>
                        </div>
                    </div>
                    <label
                        className={classNames('wallets-list-header__switcher', {
                            'wallets-list-header__switcher--disabled': shouldDisableSwitcher,
                        })}
                        htmlFor='wallets-list-header__switcher'
                    >
                        <input
                            checked={isChecked}
                            className='wallets-list-header__switcher-input'
                            data-testid='wallets_list_header__switcher_input'
                            disabled={shouldDisableSwitcher}
                            id='wallets-list-header__switcher'
                            onChange={handleToggle}
                            type='checkbox'
                        />
                        <span className='wallets-list-header__slider' />
                    </label>
                </div>
            )}
        </div>
    );
};

export default WalletListHeader;
