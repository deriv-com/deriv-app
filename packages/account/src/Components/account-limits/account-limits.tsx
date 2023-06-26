import React from 'react';
import classNames from 'classnames';
import { Loading, ThemedScrollbars, Text, ButtonLink } from '@deriv/components';
import { formatMoney, isDesktop, isMobile, useIsMounted, PlatformContext } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import LoadErrorMessage from 'Components/load-error-message';
import DemoMessage from 'Components/demo-message';
import AccountLimitsArticle from './account-limits-article';
import AccountLimitsContext, { TAccountLimitsContext } from './account-limits-context';
import AccountLimitsExtraInfo from './account-limits-extra-info';
import AccountLimitsFooter from './account-limits-footer';
import AccountLimitsOverlay from './account-limits-overlay';
import AccountLimitsTableCell from './account-limits-table-cell';
import AccountLimitsTableHeader from './account-limits-table-header';
import AccountLimitsTurnoverLimitRow, { TAccountLimitsCollection } from './account-limits-turnover-limit-row';
import { FormikValues } from 'formik';

type TAccountLimits = {
    account_limits: {
        api_initial_load_error?: string;
        open_positions?: React.ReactNode;
        account_balance: string | number;
        daily_transfers?: object;
        payout: string | number;
        lifetime_limit?: number;
        market_specific: {
            commodities: TAccountLimitsCollection[];
            cryptocurrency: TAccountLimitsCollection[];
            forex: TAccountLimitsCollection[];
            indices: TAccountLimitsCollection[];
            synthetic_index: TAccountLimitsCollection[];
        };
        num_of_days?: number;
        num_of_days_limit: string | number;
        remainder: string | number;
        withdrawal_for_x_days_monetary?: number;
        withdrawal_since_inception_monetary: string | number;
    };
    currency: string;
    footer_ref?: React.RefObject<HTMLElement>;
    is_app_settings?: boolean;
    getLimits: () => Promise<{ data: object }>;
    is_fully_authenticated: boolean;
    is_from_derivgo?: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    overlay_ref: HTMLDivElement;
    setIsOverlayShown?: (is_overlay_shown?: boolean) => void;
    setIsPopupOverlayShown?: (is_popup_overlay_shown: boolean) => void;
    should_bypass_scrollbars?: boolean;
    should_show_article?: boolean;
};

const AccountLimits = ({
    account_limits,
    currency,
    footer_ref,
    getLimits,
    is_app_settings,
    is_fully_authenticated,
    is_switching,
    is_virtual,
    overlay_ref,
    is_from_derivgo,
    setIsOverlayShown: setIsPopupOverlayShown,
    should_bypass_scrollbars,
    should_show_article,
}: TAccountLimits) => {
    const isMounted = useIsMounted();
    const [is_loading, setLoading] = React.useState(false);
    const [is_overlay_shown, setIsOverlayShown] = React.useState(false);
    const { is_appstore } = React.useContext(PlatformContext);

    React.useEffect(() => {
        if (is_virtual) {
            setLoading(false);
        } else {
            getLimits().then(() => {
                if (isMounted()) setLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!is_virtual && account_limits && is_loading) {
            setLoading(false);
        }
    }, [account_limits, is_virtual, is_loading]);

    React.useEffect(() => {
        if (typeof setIsPopupOverlayShown === 'function') {
            setIsPopupOverlayShown(is_overlay_shown);
        }
    }, [is_overlay_shown, setIsPopupOverlayShown]);

    const toggleOverlay = () => setIsOverlayShown(!is_overlay_shown);

    if (is_switching) {
        return <Loading is_fullscreen={false} />;
    }

    if (is_virtual) {
        return (
            <div
                data-testid='dt_account_demo_message_wrapper'
                className={classNames('account__demo-message-wrapper', {
                    'account__demo-message-wrapper-dashboard': is_appstore,
                })}
            >
                <DemoMessage has_demo_icon={is_appstore} has_button={is_appstore} />
            </div>
        );
    }

    const {
        api_initial_load_error,
        open_positions,
        account_balance,
        payout,
        market_specific,
        num_of_days_limit,
        remainder,
        withdrawal_since_inception_monetary,
    }: TAccountLimits['account_limits'] = account_limits;

    if (api_initial_load_error) {
        return <LoadErrorMessage error_message={api_initial_load_error} />;
    }

    if (is_switching || is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    const { commodities, forex, indices, synthetic_index } = { ...market_specific };
    const forex_ordered = forex
        ?.slice()
        .sort((a: FormikValues, b: FormikValues) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    const derived_ordered = synthetic_index
        ?.slice()
        .sort((a: FormikValues, b: FormikValues) => (a.level > b.level ? 1 : -1));

    const context_value: TAccountLimitsContext = {
        currency,
        footer_ref,
        overlay_ref,
        toggleOverlay,
    };

    return (
        <AccountLimitsContext.Provider value={context_value}>
            <section className='da-account-limits__wrapper' data-testid='account_limits_data'>
                <div
                    className={classNames('da-account-limits', {
                        'da-account-limits--app-settings': is_app_settings,
                    })}
                >
                    {should_show_article && isMobile() && <AccountLimitsArticle is_from_derivgo={is_from_derivgo} />}
                    <div className='da-account-limits__table-wrapper'>
                        <ThemedScrollbars is_bypassed={should_bypass_scrollbars || isMobile()}>
                            <table className='da-account-limits__table' data-testid='trading_limit_item_table'>
                                <thead>
                                    <tr>
                                        <AccountLimitsTableHeader>
                                            <Localize i18n_default_text='Trading limits' />
                                        </AccountLimitsTableHeader>
                                        <AccountLimitsTableHeader align='right'>
                                            <Localize i18n_default_text='Limit' />
                                        </AccountLimitsTableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <AccountLimitsTableCell
                                            renderExtraInfo={() => (
                                                <AccountLimitsExtraInfo
                                                    message={localize(
                                                        'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.'
                                                    )}
                                                />
                                            )}
                                        >
                                            <Localize i18n_default_text='*Maximum number of open positions' />
                                        </AccountLimitsTableCell>
                                        <AccountLimitsTableCell align='right'>{open_positions}</AccountLimitsTableCell>
                                    </tr>
                                    <tr>
                                        <AccountLimitsTableCell
                                            renderExtraInfo={() => (
                                                <AccountLimitsExtraInfo
                                                    message={localize(
                                                        'Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.'
                                                    )}
                                                />
                                            )}
                                        >
                                            <Localize i18n_default_text='*Maximum account cash balance' />
                                        </AccountLimitsTableCell>
                                        <AccountLimitsTableCell align='right'>
                                            {/* null or 0 are expected form BE when max balance limit is not set */}
                                            {account_balance ? (
                                                formatMoney(currency, account_balance, true)
                                            ) : (
                                                <Localize i18n_default_text='Not set' />
                                            )}
                                        </AccountLimitsTableCell>
                                    </tr>
                                    <tr>
                                        <AccountLimitsTableCell
                                            renderExtraInfo={() => (
                                                <AccountLimitsExtraInfo
                                                    message={localize(
                                                        'Represents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.'
                                                    )}
                                                />
                                            )}
                                        >
                                            <Localize i18n_default_text='Maximum aggregate payouts on open positions' />
                                        </AccountLimitsTableCell>
                                        <AccountLimitsTableCell align='right'>
                                            {formatMoney(currency, payout, true)}
                                        </AccountLimitsTableCell>
                                    </tr>
                                    <tr>
                                        <AccountLimitsTableCell is_hint>
                                            <Localize i18n_default_text='*Any limits in your Self-exclusion settings will override these default limits.' />
                                        </AccountLimitsTableCell>
                                        <AccountLimitsTableCell />
                                    </tr>
                                </tbody>
                            </table>
                            <table className='da-account-limits__table' data-testid='trading_daily_turnover_table'>
                                <thead>
                                    <tr>
                                        <AccountLimitsTableHeader
                                            renderExtraInfo={() => (
                                                <AccountLimitsExtraInfo
                                                    message={localize(
                                                        'Represents the maximum volume of contracts that you may purchase in any given trading day.'
                                                    )}
                                                />
                                            )}
                                        >
                                            <Localize i18n_default_text='Maximum daily turnover' />
                                        </AccountLimitsTableHeader>
                                        <AccountLimitsTableHeader align='right'>
                                            <Localize i18n_default_text='Limit' />
                                        </AccountLimitsTableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AccountLimitsTurnoverLimitRow collection={commodities} />
                                    <AccountLimitsTurnoverLimitRow collection={forex_ordered} />
                                    <AccountLimitsTurnoverLimitRow collection={indices} />
                                    <AccountLimitsTurnoverLimitRow collection={derived_ordered} />
                                </tbody>
                            </table>
                            {/* We only show "Withdrawal Limits" on account-wide settings pages. */}
                            {!is_app_settings && (
                                <React.Fragment>
                                    <table className='da-account-limits__table' data-testid='withdrawal_limits_table'>
                                        <thead>
                                            <tr>
                                                <AccountLimitsTableHeader>
                                                    <Localize i18n_default_text='Withdrawal limits' />
                                                </AccountLimitsTableHeader>
                                                {is_fully_authenticated && (
                                                    <AccountLimitsTableHeader align='right'>
                                                        <Localize i18n_default_text='Limit' />
                                                    </AccountLimitsTableHeader>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {is_fully_authenticated ? (
                                                <tr>
                                                    <AccountLimitsTableCell>
                                                        <React.Fragment>
                                                            <Text size='xxs' color='prominent'>
                                                                {localize(
                                                                    'Your account is fully authenticated and your withdrawal limits have been lifted.'
                                                                )}
                                                            </Text>
                                                        </React.Fragment>
                                                    </AccountLimitsTableCell>
                                                    <AccountLimitsTableCell />
                                                </tr>
                                            ) : (
                                                <React.Fragment>
                                                    <tr>
                                                        <AccountLimitsTableCell>
                                                            {is_appstore ? (
                                                                <Localize i18n_default_text='Total withdrawal limit' />
                                                            ) : (
                                                                <Localize i18n_default_text='Total withdrawal allowed' />
                                                            )}
                                                            {is_appstore && !is_fully_authenticated && (
                                                                <React.Fragment>
                                                                    <Text
                                                                        size={isMobile() ? 'xxxs' : 'xxs'}
                                                                        className='account-management-table__verify'
                                                                        color='less-prominent'
                                                                        line_height='xs'
                                                                    >
                                                                        {localize(
                                                                            'To increase limit please verify your identity'
                                                                        )}
                                                                    </Text>
                                                                    <ButtonLink
                                                                        to='/account/proof-of-identity'
                                                                        size='small'
                                                                        className='account-management-table__verify-button'
                                                                    >
                                                                        <Text
                                                                            weight='bold'
                                                                            color='colored-background'
                                                                            size={isMobile() ? 'xxxs' : 'xxs'}
                                                                        >
                                                                            {localize('Verify')}
                                                                        </Text>
                                                                    </ButtonLink>
                                                                </React.Fragment>
                                                            )}
                                                        </AccountLimitsTableCell>
                                                        <AccountLimitsTableCell align='right'>
                                                            {formatMoney(currency, num_of_days_limit, true)}
                                                        </AccountLimitsTableCell>
                                                    </tr>
                                                    <tr>
                                                        <AccountLimitsTableCell>
                                                            <Localize i18n_default_text='Total withdrawn' />
                                                        </AccountLimitsTableCell>
                                                        <AccountLimitsTableCell align='right'>
                                                            {formatMoney(
                                                                currency,
                                                                withdrawal_since_inception_monetary,
                                                                true
                                                            )}
                                                        </AccountLimitsTableCell>
                                                    </tr>
                                                    <tr>
                                                        <AccountLimitsTableCell>
                                                            <Localize i18n_default_text='Maximum withdrawal remaining' />
                                                        </AccountLimitsTableCell>
                                                        <AccountLimitsTableCell align='right'>
                                                            {formatMoney(currency, remainder, true)}
                                                        </AccountLimitsTableCell>
                                                    </tr>
                                                </React.Fragment>
                                            )}
                                        </tbody>
                                    </table>
                                    {(!is_appstore || isMobile()) && (
                                        <div className='da-account-limits__text-container'>
                                            <Text as='p' size='xxs' color='less-prominent' line_height='xs'>
                                                {is_fully_authenticated ? (
                                                    <Localize i18n_default_text='Your account is fully authenticated and your withdrawal limits have been lifted.' />
                                                ) : (
                                                    <Localize i18n_default_text='Stated limits are subject to change without prior notice.' />
                                                )}
                                            </Text>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </ThemedScrollbars>
                    </div>
                    {should_show_article && isDesktop() && <AccountLimitsArticle />}
                    {footer_ref && <AccountLimitsFooter />}
                    {is_overlay_shown && overlay_ref && <AccountLimitsOverlay />}
                </div>
            </section>
        </AccountLimitsContext.Provider>
    );
};

export default AccountLimits;
