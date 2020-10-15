import classNames from 'classnames';
import React from 'react';
import { Money, Button, Card } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { Mt5AccountCopy } from './mt5-account-copy.jsx';
// import { getMT5WebTerminalLink } from '../Helpers/constants';

const LoginBadge = ({ display_login }) => (
    <span className='mt5-account-card__login'>
        <Localize
            i18n_default_text='<0>Login ID</0><1>{{display_login}}</1>'
            values={{
                display_login,
            }}
            components={[<span key={0} />, <strong className='mt5-account-card__login-number' key={1} />]}
        />
        <div className='mt5-account-card__login-clipboard'>
            <Mt5AccountCopy text={display_login} />
        </div>
    </span>
);

const MT5AccountCard = ({
    button_label,
    descriptor,
    existing_data,
    has_mt5_account,
    icon,
    background_image,
    is_button_primary,
    is_disabled,
    is_logged_in,
    specs,
    title,
    type,
    onSelectAccount,
    onClickFund,
    onPasswordManager,
}) => {
    const IconComponent = icon || (() => null);
    const BackgroundComponent = background_image || (() => null);
    const lbl_add_account = <Localize i18n_default_text='Add account' />;
    const cta_label = button_label || lbl_add_account;
    const has_demo_banner = type.category === 'demo';

    const renderHeader = () => {
        return (
            <>
                <div
                    className={classNames('mt5-account-card__type', {
                        'mt5-account-card__type': has_demo_banner,
                    })}
                    id={`mt5_${type.category}_${type.type}`}
                >
                    <div className='mt5-account-card__type--description'>
                        <h1 className='mt5-account-card--paragraph mt5-account-card--paragraph-bold'>{title}</h1>
                        {has_demo_banner && (
                            <div className='mt5-account-card__banner mt5-account-card__banner--demo'>
                                <Localize i18n_default_text='Demo' />
                            </div>
                        )}
                        {existing_data && existing_data.display_balance && is_logged_in && (
                            <p className='mt5-account-card--balance'>
                                <Money
                                    amount={existing_data.display_balance}
                                    currency={existing_data.currency}
                                    show_currency
                                />
                            </p>
                        )}
                        <p className='mt5-account-card--xsmall'>{descriptor}</p>
                    </div>
                    <div className='mt5-account-card__icon'>{icon && <IconComponent />}</div>
                    <div className='mt5-account-card__background'>{background_image && <BackgroundComponent />}</div>
                </div>
                <div className='mt5-account-card__login-details'>
                    {existing_data?.login && is_logged_in && <LoginBadge display_login={existing_data.display_login} />}
                    {existing_data && is_logged_in && (
                        <Button
                            className='mt5-account-card__login-details-password'
                            classNameSpan='mt5-account-card__login-details-password'
                            onClick={() => {
                                onPasswordManager(existing_data.login, title, type.category, type.type);
                            }}
                            type='button'
                            tertiary
                            small
                        >
                            <Localize i18n_default_text='Manage password' />
                        </Button>
                    )}
                </div>
            </>
        );
    };

    const renderContent = () => {
        return (
            <div className='mt5-account-card__cta'>
                <div className='mt5-account-card__specs'>
                    <table className='mt5-account-card__specs-table'>
                        <tbody>
                            {Object.keys(specs).map((spec_attribute, idx) => (
                                <tr key={idx} className='mt5-account-card__specs-table-row'>
                                    <td className='mt5-account-card__specs-table-attribute'>
                                        <p className='mt5-account-card--paragraph'>{spec_attribute}</p>
                                    </td>
                                    <td className='mt5-account-card__specs-table-data'>
                                        <p className='mt5-account-card--paragraph mt5-account-card--paragraph-right'>
                                            {specs[spec_attribute]}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <>
                {existing_data && is_logged_in && (
                    <div className='mt5-account-card__manage'>
                        <Button onClick={onClickFund} type='button' secondary>
                            {type.category === 'real' && <Localize i18n_default_text='Fund transfer' />}
                            {type.category === 'demo' && <Localize i18n_default_text='Fund top up' />}
                        </Button>
                    </div>
                )}
                {!existing_data && has_mt5_account && (
                    <Button className='mt5-account-card__account-selection' onClick={onSelectAccount} type='button'>
                        <Localize i18n_default_text='Select' />
                    </Button>
                )}
                {!existing_data && !has_mt5_account && is_logged_in && (
                    <Button
                        className='mt5-account-card__account-selection'
                        onClick={onSelectAccount}
                        type='button'
                        is_disabled={is_disabled}
                        primary={is_button_primary}
                        secondary={!is_button_primary}
                        large
                    >
                        {cta_label}
                    </Button>
                )}
            </>
        );
    };

    return (
        <Card
            renderHeader={renderHeader}
            renderContent={renderContent}
            renderFooter={renderFooter}
            className={classNames(
                'mt5-account-card',
                { 'mt5-account-card__logged-out': !is_logged_in },
                { 'mt5-account-card__synthetic': type.type === 'synthetic' },
                { 'mt5-account-card__financial': type.type === 'financial' },
                { 'mt5-account-card__financial-stp': type.type === 'financial_stp' }
            )}
        />
    );
};

export { MT5AccountCard };
