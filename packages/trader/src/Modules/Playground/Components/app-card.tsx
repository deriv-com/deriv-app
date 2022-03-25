import React from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';

type TAppCardDetails = {
    size?: string;
    dark?: boolean;
    checked?: boolean;
    app_name?: string;
    app_icon?: string;
};

type TLinkedAppCard = TAppCardDetails & {
    wallet_name?: string;
    wallet_icon?: string;
    currency_name?: string;
    balance?: number;
};

type TUnlinkedAppCard = TAppCardDetails;

type TCFDAppCard = {
    account_type?: 'Real' | 'Demo';
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
    app_icon,
    wallet_name,
    wallet_icon,
    currency_name,
    balance,
    size,
    dark,
    checked,
}: TLinkedAppCard) => {
    const size_el = size && `appstore-app-card__block--linked__wrapper--${size}`;
    const wallet_placeholder_icon = dark
        ? 'icAppstoreWalletCardPlaceholderDark'
        : 'icAppstoreWalletCardPlaceholderLight';

    const checked_wallet_icon =
        checked && 'appstore-app-card__small-block-wrapper--linked__wallet-icon-wrapper-checked';

    return (
        <div className={classNames('appstore-app-card__block--linked', size_el)}>
            <>
                {size === 'small' ? (
                    <div className='appstore-app-card__small-block-wrapper--linked'>
                        <div className='appstore-app-card__small-block-wrapper--linked__app-icon-wrapper'>
                            {app_icon ? (
                                <Icon icon={app_icon} width='24' height='24' />
                            ) : (
                                <div className='appstore-app-card--appcard-placeholder'>&nbsp;</div>
                            )}
                        </div>
                        <div
                            className={classNames(
                                'appstore-app-card__small-block-wrapper--linked__wallet-icon-wrapper',
                                checked_wallet_icon
                            )}
                        >
                            {wallet_icon ? (
                                <Icon
                                    icon={wallet_icon}
                                    width='40'
                                    height='24'
                                    className='appstore-app-card__block--linked__wrapper__icon-wrapper--wallet__wallet-icon'
                                />
                            ) : (
                                <div className='appstore-app-card__background'>
                                    <Icon icon={wallet_placeholder_icon} />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='appstore-app-card__block--linked__wrapper'>
                        <div className='appstore-app-card__block--linked__wrapper__icon-wrapper'>
                            <div className='appstore-app-card__block--linked__wrapper__icon-wrapper--app'>
                                <>
                                    {app_icon ? (
                                        <Icon icon={app_icon} width='24' height='24' />
                                    ) : (
                                        <div className='appstore-app-card--appcard-placeholder'>&nbsp;</div>
                                    )}
                                </>
                            </div>
                            <div className='appstore-app-card__block--linked__wrapper__icon-wrapper--wallet'>
                                <>
                                    {wallet_icon ? (
                                        <Icon
                                            icon={wallet_icon}
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
                            <p className='appstore-app-card__block--linked__wrapper__details-wrapper--first-row'>
                                {app_name}
                            </p>
                            <p className='appstore-app-card__block--linked__wrapper__details-wrapper--second-row'>
                                {wallet_name} {currency_name} wallet
                            </p>
                            <p className='appstore-app-card__block--linked__wrapper__details-wrapper--third-row'>
                                {balance} {currency_name}
                            </p>
                        </div>
                    </div>
                )}
            </>
        </div>
    );
};

const UnlinkedAppcard = ({ app_name, app_icon, size }: TUnlinkedAppCard) => {
    const size_el = size && `appstore-app-card__block--unlinked__wrapper--${size}`;

    return (
        <div className={classNames('appstore-app-card__block--unlinked', size_el)}>
            <>
                {size === 'small' ? (
                    <div className='appstore-app-card__small-block-wrapper--unlinked'>
                        <>
                            {app_icon ? (
                                <Icon icon={app_icon} width='24' height='24' />
                            ) : (
                                <div className='appstore-app-card--appcard-placeholder'>&nbsp;</div>
                            )}
                        </>
                    </div>
                ) : (
                    <div className='appstore-app-card__block--unlinked__wrapper'>
                        <div className='appstore-app-card__block--unlinked__wrapper--icon'>
                            <>
                                {app_icon ? (
                                    <Icon icon={app_icon} width='24' height='24' />
                                ) : (
                                    <div className='appstore-app-card--appcard-placeholder'>&nbsp;</div>
                                )}
                            </>
                        </div>
                        <p className='appstore-app-card__block--unlinked__wrapper--text'>{app_name}</p>
                    </div>
                )}
            </>
        </div>
    );
};

const AppCard = ({ app_card_details, size, dark, linked, checked }: TCFDAppCard) => {
    return (
        <>
            {linked ? (
                <LinkedAppCard
                    app_name={app_card_details?.app_name}
                    app_icon={app_card_details?.app_icon}
                    wallet_name={app_card_details?.wallet_name}
                    wallet_icon={app_card_details?.wallet_icon}
                    currency_name={app_card_details?.currency_name}
                    balance={app_card_details?.balance}
                    size={size}
                    dark={dark}
                    checked={checked}
                />
            ) : (
                <UnlinkedAppcard
                    size={size}
                    app_name={app_card_details?.app_name}
                    app_icon={app_card_details?.app_icon}
                />
            )}
        </>
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

    // small
    const checked_border_small = checked && size === 'small' && 'appstore-app-card--checked-border-small';
    // 3 functions for small

    return (
        <div
            className={classNames(
                main_class,
                dark_mode_on,
                card_size,
                faded_el,
                disabled_el,
                checked_border,
                checked_border_small,
                size !== 'small' ? `${main_class}--normal-size` : `${main_class}--s-size`
            )}
            onMouseEnter={() => !checked && set_hovered(!is_hovered)}
            onMouseLeave={() => !checked && set_hovered(!is_hovered)}
        >
            <>
                {size !== 'small' ? (
                    <>
                        {/* badge */}
                        <div className={classNames(`${main_class}__badge`, badge_bg)}>{account_type || 'Default'}</div>

                        {/* linked or unlinked app card type */}
                        <div className='appstore-app-card__block'>
                            <AppCard app_card_details={app_card_details} size={size} dark={dark} linked={linked} />
                        </div>

                        {/* is_hovered */}
                        {(is_hovered || checked) && !disabled && (
                            <div
                                className={classNames(
                                    'appstore-app-card--hovered',
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
                    </>
                ) : (
                    <div className='appstore-app-card__small-block-wrapper'>
                        <div className='appstore-app-card__small-block-wrapper__main-wrapper'>
                            {/* light mode bg */}
                            {!dark && (
                                <div className='appstore-app-card__small-block-wrapper__main-wrapper--background'>
                                    <Icon icon='icAppstoreAppCardDefaultBackgroundSmall' width='64' height='40' />
                                </div>
                            )}

                            {/* is_hovered */}
                            {(is_hovered || checked) && !disabled && (
                                <div
                                    className={classNames(
                                        'appstore-app-card--hovered-small',
                                        dark ? 'appstore-app-card--hovered--dark' : 'appstore-app-card--hovered--light'
                                    )}
                                >
                                    &nbsp;
                                </div>
                            )}

                            <AppCard
                                app_card_details={app_card_details}
                                size={size}
                                dark={dark}
                                linked={linked}
                                checked={checked}
                            />
                        </div>

                        {/* checked */}
                        {checked && (
                            <div className='appstore-app-card--checked-small'>
                                <Icon icon='icAppstoreCheckedRedBg' width='16' height='16' />
                            </div>
                        )}
                    </div>
                )}
            </>
        </div>
    );
};

export default AppstoreAppCard;
