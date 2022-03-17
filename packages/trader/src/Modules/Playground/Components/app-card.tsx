import React from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';

type TAppCardDetails = {
    size?: string;
    dark?: boolean;
    app_name?: string;
    app_icon_name?: string;
};

type TLinkedAppCard = TAppCardDetails & {
    wallet_name?: string;
    wallet_icon_name?: string;
    currency_name?: string;
    balance?: number;
};

type TUnlinkedAppCard = TAppCardDetails;

type TCFDAppCard = {
    account_type: 'Real' | 'Demo';
    size: 'large' | 'medium' | 'small';
    checked?: boolean;
    dark?: boolean;
    linked?: boolean;
    faded?: boolean;
    disabled?: boolean;
    app_card_details?: TLinkedAppCard & TUnlinkedAppCard;
};

const LinkedAppCard = ({
    app_name,
    app_icon_name,
    wallet_name,
    wallet_icon_name,
    currency_name,
    balance,
    size,
    dark,
}: TLinkedAppCard) => {
    const size_el = size && `appstore-app-card__block--linked__wrapper--${size}`;
    const wallet_placeholder_icon = dark
        ? 'icAppstoreWalletCardPlaceholderDark'
        : 'icAppstoreWalletCardPlaceholderLight';

    return (
        <div className={classNames('appstore-app-card__block--linked', size_el)}>
            <div className='appstore-app-card__block--linked__wrapper'>
                <div className='appstore-app-card__block--linked__wrapper__icon-wrapper'>
                    <div className='appstore-app-card__block--linked__wrapper__icon-wrapper--app'>
                        <>
                            {app_icon_name ? (
                                <Icon icon={app_icon_name} width='24' height='24' />
                            ) : (
                                <div className='appstore-app-card--appcard-placeholder'>&nbsp;</div>
                            )}
                        </>
                    </div>
                    <div className='appstore-app-card__block--linked__wrapper__icon-wrapper--wallet'>
                        <>
                            {wallet_icon_name ? (
                                <Icon
                                    icon={wallet_icon_name}
                                    width='32'
                                    height='20'
                                    className='appstore-app-card__block--linked__wrapper__icon-wrapper--wallet__wallet-icon'
                                />
                            ) : (
                                <div className='appstore-app-card__background'>
                                    <Icon icon={wallet_placeholder_icon} />
                                </div>
                            )}
                        </>
                    </div>
                </div>
                <div className='appstore-app-card__block--linked__wrapper__details-wrapper'>
                    <p className='appstore-app-card__block--linked__wrapper__details-wrapper--first-row'>{app_name}</p>
                    <p className='appstore-app-card__block--linked__wrapper__details-wrapper--second-row'>
                        {wallet_name} {currency_name} wallet
                    </p>
                    <p className='appstore-app-card__block--linked__wrapper__details-wrapper--third-row'>
                        {balance} {currency_name}
                    </p>
                </div>
            </div>
        </div>
    );
};

const UnlinkedAppcard = ({ app_name, app_icon_name, size }: TUnlinkedAppCard) => {
    const size_el = size && `appstore-app-card__block--unlinked__wrapper--${size}`;

    return (
        <div className={classNames('appstore-app-card__block--unlinked', size_el)}>
            <div className='appstore-app-card__block--unlinked__wrapper'>
                <div className='appstore-app-card__block--unlinked__wrapper--icon'>
                    <>
                        {app_icon_name ? (
                            <Icon icon={app_icon_name} width='24' height='24' />
                        ) : (
                            <div className='appstore-app-card--appcard-placeholder'>&nbsp;</div>
                        )}
                    </>
                </div>
                <p className='appstore-app-card__block--unlinked__wrapper--text'>{app_name}</p>
            </div>
        </div>
    );
};

const AppstoreAppCard = ({
    account_type,
    app_card_details,
    size,
    checked,
    dark,
    linked,
    faded,
    disabled,
}: TCFDAppCard) => {
    /* eslint-disabled */
    // console.log('faded_el ', faded);
    /* eslint-enable */

    const [is_hovered, set_hovered] = React.useState(false);
    const main_class = 'appstore-app-card';
    const dark_mode_on = dark && 'appstore-app-card--dark';
    const badge_bg =
        account_type === 'Real'
            ? `${main_class}__badge--real`
            : account_type === 'Demo'
            ? `${main_class}__badge--demo`
            : `${main_class}__badge--default`;
    const card_size = `${main_class}--${size}`;
    const faded_el = faded && !is_hovered && `${main_class}--faded`;
    const disabled_el = disabled && `${main_class}--disabled`;
    const checked_border = checked && 'appstore-app-card--checked-border';

    return (
        <div
            className={classNames(main_class, dark_mode_on, card_size, faded_el, disabled_el, checked_border)}
            onMouseEnter={() => !checked && set_hovered(!is_hovered)}
            onMouseLeave={() => !checked && set_hovered(!is_hovered)}
        >
            {/* badge */}
            <div className={classNames(`${main_class}__badge`, badge_bg)}>{account_type || 'Default'}</div>

            {/* linked or unlinked app card type */}
            <div className='appstore-app-card__block'>
                {linked ? (
                    <LinkedAppCard
                        app_name={app_card_details?.app_name}
                        app_icon_name={app_card_details?.app_icon_name}
                        wallet_name={app_card_details?.wallet_name}
                        wallet_icon_name={app_card_details?.wallet_icon_name}
                        currency_name={app_card_details?.currency_name}
                        balance={app_card_details?.balance}
                        size={size}
                        dark={dark}
                    />
                ) : (
                    <UnlinkedAppcard
                        size={size}
                        app_name={app_card_details?.app_name}
                        app_icon_name={app_card_details?.app_icon_name}
                    />
                )}
            </div>

            {/* is_hovered */}
            {(is_hovered || checked) && !disabled && (
                <div
                    className={classNames(
                        `appstore-app-card--hovered`,
                        dark ? 'appstore-app-card--hovered--dark' : 'appstore-app-card--hovered--light'
                    )}
                >
                    &nbsp;
                </div>
            )}

            {/* light mode bg */}
            {!dark && (
                <div className='appstore-app-card__background'>
                    <Icon icon='icAppstoreAppCardDefaultBackground' />
                </div>
            )}

            {/* checked */}
            {checked && (
                <div className='appstore-app-card--checked'>
                    <Icon icon='icAppstoreCheckedRedBg' width='32' height='32' />
                </div>
            )}
        </div>
    );
};

export default AppstoreAppCard;
