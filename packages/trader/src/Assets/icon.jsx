import React     from 'react';
import PropTypes from 'prop-types';

class Icon extends React.PureComponent {
    constructor(props) {
        super(props);
        /* When adding a new icon, arrange it by following the ascending file system arrangement */
        this.icons = {
            // AccountManagement
            IconSecurity    : React.lazy(() => import(/* webpackChunkName: "icon-security" */ './AccountManagement/icon-security.jsx')),
            IconVerification: React.lazy(() => import(/* webpackChunkName: "icon-verification" */ './AccountManagement/icon-verification.jsx')),
            IconAPIError    : React.lazy(() => import(/* webpackChunkName: "icon-apierror" */ './AccountManagement/icon-error.jsx')),

            // Common
            IconAccountTransfer   : React.lazy(() => import(/* webpackChunkName: "icon-accounttransfer" */ './Common/icon-account-transfer.jsx')),
            IconArrowBold         : React.lazy(() => import(/* webpackChunkName: "icon-arrowbold" */ './Common/icon-arrow-bold.jsx')),
            IconArrow             : React.lazy(() => import(/* webpackChunkName: "icon-arrow" */ './Common/icon-arrow.jsx')),
            IconBack              : React.lazy(() => import(/* webpackChunkName: "icon-back" */ './Common/icon-back.jsx')),
            IconCalendarToday     : React.lazy(() => import(/* webpackChunkName: "icon-calendartoday" */ './Common/icon-calendar-today.jsx')),
            IconCalendar          : React.lazy(() => import(/* webpackChunkName: "icon-calendar" */ './Common/icon-calendar.jsx')),
            IconChevronDoubleLeft : React.lazy(() => import(/* webpackChunkName: "icon-chevrondoubleleft" */ './Common/icon-chevron-double-left.jsx')),
            IconChevronDoubleRight: React.lazy(() => import(/* webpackChunkName: "icon-chevrondoubleright" */ './Common/icon-chevron-double-right.jsx')),
            IconChevronLeft       : React.lazy(() => import(/* webpackChunkName: "icon-chevronleft" */ './Common/icon-chevron-left.jsx')),
            IconChevronRight      : React.lazy(() => import(/* webpackChunkName: "icon-chevronright" */ './Common/icon-chevron-right.jsx')),
            IconClear             : React.lazy(() => import(/* webpackChunkName: "icon-clear" */ './Common/icon-clear.jsx')),
            IconClipboard         : React.lazy(() => import(/* webpackChunkName: "icon-clipboard" */ './Common/icon-clipboard.jsx')),
            IconClock             : React.lazy(() => import(/* webpackChunkName: "icon-clock" */ './Common/icon-clock.jsx')),
            IconClose             : React.lazy(() => import(/* webpackChunkName: "icon-close" */ './Common/icon-close.jsx')),
            IconCountryFlag       : React.lazy(() => import(/* webpackChunkName: "icon-countryflag" */ './Common/icon-country-flag.jsx')),
            IconDanger            : React.lazy(() => import(/* webpackChunkName: "icon-danger" */ './Common/icon-danger.jsx')),
            IconDeposit           : React.lazy(() => import(/* webpackChunkName: "icon-deposit" */ './Common/icon-deposit.jsx')), // TODO: update big when design is ready
            IconDepositSmall      : React.lazy(() => import(/* webpackChunkName: "icon-depositsmall" */ './Common/icon-deposit-small.jsx')),
            IconEmergency         : React.lazy(() => import(/* webpackChunkName: "icon-emergency" */ './Common/icon-emergency.jsx')),
            IconEmptyNotification : React.lazy(() => import(/* webpackChunkName: "icon-emptynotification" */ './Common/icon-empty-notification.jsx')),
            IconError             : React.lazy(() => import(/* webpackChunkName: "icon-error" */ './Common/icon-error.jsx')),
            IconExclamation       : React.lazy(() => import(/* webpackChunkName: "icon-exclamation" */ './Common/icon-exclamation.jsx')),
            IconFlag              : React.lazy(() => import(/* webpackChunkName: "icon-flag" */ './Common/icon-flag.jsx')),
            IconInfoBlue          : React.lazy(() => import(/* webpackChunkName: "icon-infoblue" */ './Common/icon-info-blue.jsx')),
            IconInfoOutline       : React.lazy(() => import(/* webpackChunkName: "icon-infooutline" */ './Common/icon-info-outline.jsx')),
            IconInformation       : React.lazy(() => import(/* webpackChunkName: "icon-information" */ './Common/icon-information.jsx')),
            IconMinimize          : React.lazy(() => import(/* webpackChunkName: "icon-minimize" */ './Common/icon-minimize.jsx')),
            IconMinus             : React.lazy(() => import(/* webpackChunkName: "icon-minus" */ './Common/icon-minus.jsx')),
            IconPasswordHide      : React.lazy(() => import(/* webpackChunkName: "icon-passwordhide" */ './Common/icon-password-hide.jsx')),
            IconPasswordShow      : React.lazy(() => import(/* webpackChunkName: "icon-passwordshow" */ './Common/icon-password-show.jsx')),
            IconPaymentAgent      : React.lazy(() => import(/* webpackChunkName: "icon-paymentagent" */ './Common/icon-payment-agent.jsx')),
            IconPlus              : React.lazy(() => import(/* webpackChunkName: "icon-plus" */ './Common/icon-plus.jsx')),
            IconQuestion          : React.lazy(() => import(/* webpackChunkName: "icon-question" */ './Common/icon-question.jsx')),
            IconRedDot            : React.lazy(() => import(/* webpackChunkName: "icon-reddot" */ './Common/icon-red-dot.jsx')),
            IconSuccess           : React.lazy(() => import(/* webpackChunkName: "icon-success" */ './Common/icon-success.jsx')),
            IconWarning           : React.lazy(() => import(/* webpackChunkName: "icon-warning" */ './Common/icon-warning.jsx')),
            IconWip               : React.lazy(() => import(/* webpackChunkName: "icon-wip" */ './Common/icon-wip.jsx')),
            IconWithdrawal        : React.lazy(() => import(/* webpackChunkName: "icon-withdrawal" */ './Common/icon-withdrawal.jsx')), // TODO: update big when design is ready
            IconWithdrawalSmall   : React.lazy(() => import(/* webpackChunkName: "icon-withdrawalsmall" */ './Common/icon-withdrawal-small.jsx')),

            // Contract
            ContractIconClose: React.lazy(() => import(/* webpackChunkName: "icon-contract-close" */ './Contract/icon-close.jsx')),
            IconEndTime      : React.lazy(() => import(/* webpackChunkName: "icon-end-time" */ './Contract/icon-end-time.jsx')),
            ContractIconFlag : React.lazy(() => import(/* webpackChunkName: "icon-contract-flag" */ './Contract/icon-flag.jsx')),
            IconStartTime    : React.lazy(() => import(/* webpackChunkName: "icon-start-time" */ './Contract/icon-start-time.jsx')),
            IconTick         : React.lazy(() => import(/* webpackChunkName: "icon-tick" */ './Contract/icon-tick.jsx')),

            // Cashier
            IconAuthenticateWithdrawals: React.lazy(() => import(/* webpackChunkName: "icon-authenticate-withdrawals" */ './Cashier/icon-authenticate-withdrawals.jsx')),
            IconCashierError           : React.lazy(() => import(/* webpackChunkName: "icon-cashier-error" */ './Cashier/icon-cashier-error.jsx')),
            IconEmailSent              : React.lazy(() => import(/* webpackChunkName: "icon-email-sent" */ './Cashier/icon-email-sent.jsx')),
            IconNoBalance              : React.lazy(() => import(/* webpackChunkName: "icon-no-balance" */ './Cashier/icon-no-balance.jsx')),
            IconPhone                  : React.lazy(() => import(/* webpackChunkName: "icon-phone" */ './Cashier/icon-phone.jsx')),
            IconWebsite                : React.lazy(() => import(/* webpackChunkName: "icon-website" */ './Cashier/icon-website.jsx')),
            IconEmail                  : React.lazy(() => import(/* webpackChunkName: "icon-email" */ './Cashier/icon-email.jsx')),
            IconTransferDone           : React.lazy(() => import(/* webpackChunkName: "icon-transfer-done" */ './Cashier/icon-transfer-done.jsx')),

            // Modal
            ModalIconClose: React.lazy(() => import(/* webpackChunkName: "icon-modal-close" */ './Modal/icon-close.jsx')),

            // Footer
            IconMaximize : React.lazy(() => import(/* webpackChunkName: "icon-maximize" */ './Footer/icon-maximize.jsx')),
            IconPositions: React.lazy(() => import(/* webpackChunkName: "icon-positions" */ './Footer/icon-positions.jsx')),
            IconSettings : React.lazy(() => import(/* webpackChunkName: "icon-settings" */ './Footer/icon-settings.jsx')),

            // Header
            IconAccountsCurrency: React.lazy(() => import(/* webpackChunkName: "icon-accounts-currency" */ './Header/AccountsCurrency/icon_accounts_currency.jsx')),
            IconLogout          : React.lazy(() => import(/* webpackChunkName: "icon-logout" */ './Header/Drawer/icon-logout.jsx')),
            IconBell            : React.lazy(() => import(/* webpackChunkName: "icon-bell" */ './Header/NavBar/icon-bell.jsx')),
            IconCashier         : React.lazy(() => import(/* webpackChunkName: "icon-cashier" */ './Header/NavBar/icon-cashier.jsx')),
            IconDeriv           : React.lazy(() => import(/* webpackChunkName: "icon-deriv" */ './Header/NavBar/icon-deriv.jsx')),
            IconHamburger       : React.lazy(() => import(/* webpackChunkName: "icon-hamburger" */ './Header/NavBar/icon-hamburger.jsx')),
            IconPortfolio       : React.lazy(() => import(/* webpackChunkName: "icon-portfolio" */ './Header/NavBar/icon-portfolio.jsx')),
            IconReports         : React.lazy(() => import(/* webpackChunkName: "icon-reports" */ './Header/NavBar/icon-reports.jsx')),
            IconTrade           : React.lazy(() => import(/* webpackChunkName: "icon-trade" */ './Header/NavBar/icon-trade.jsx')),
            IconUser            : React.lazy(() => import(/* webpackChunkName: "icon-user" */ './Header/NavBar/icon-user.jsx')),

            // Platform Switcher
            IconDBot: React.lazy(() => import(/* webpackChunkName: "icon-d-bot" */ './Header/PlatformSwitcher/icon-d-bot.jsx')),
            IconMT5 : React.lazy(() => import(/* webpackChunkName: "icon-mt5" */ './Header/PlatformSwitcher/icon-mt5.jsx')),

            // Reports
            IconDemo                : React.lazy(() => import(/* webpackChunkName: "icon-demo" */ './Reports/icon-demo.jsx')),
            IconOpenPositions       : React.lazy(() => import(/* webpackChunkName: "icon-open-positions" */ './Reports/icon-open-positions.jsx')),
            IconProfitTable         : React.lazy(() => import(/* webpackChunkName: "icon-profit-table" */ './Reports/icon-profit-table.jsx')),
            IconStatement           : React.lazy(() => import(/* webpackChunkName: "icon-statement" */ './Reports/icon-statement.jsx')),
            IconCalendarForwardToday: React.lazy(() => import(/* webpackChunkName: "icon-calendar-forward-today" */ './Reports/ic-calendar-forwardtoday.jsx')),

            // Settings
            IconCharts  : React.lazy(() => import(/* webpackChunkName: "icon-charts" */ './Settings/icon-charts.jsx')),
            IconLanguage: React.lazy(() => import(/* webpackChunkName: "icon-language" */ './Settings/icon-language.jsx')),
            IconPurchase: React.lazy(() => import(/* webpackChunkName: "icon-purchase" */ './Settings/icon-purchase.jsx')),
            IconTheme   : React.lazy(() => import(/* webpackChunkName: "icon-theme" */ './Settings/icon-theme.jsx')),

            // Statement
            IconBuy   : React.lazy(() => import(/* webpackChunkName: "icon-buy" */ './Statement/icon-buy.jsx')),
            IconPayout: React.lazy(() => import(/* webpackChunkName: "icon-payout" */ './Statement/icon-payout.jsx')),
            IconSell  : React.lazy(() => import(/* webpackChunkName: "icon-sell" */ './Statement/icon-sell.jsx')),
            IconWallet: React.lazy(() => import(/* webpackChunkName: "icon-wallet" */ './Statement/icon-wallet.jsx')),

            // Signup
            IconAdd     : React.lazy(() => import(/* webpackChunkName: "icon-add" */ './Signup/icon-add.jsx')),
            IconRedArrow: React.lazy(() => import(/* webpackChunkName: "icon-red-arrow" */ './Signup/icon-red-arrow.jsx')),
            IconWon     : React.lazy(() => import(/* webpackChunkName: "icon-won" */ './Signup/icon-won.jsx')),

            // Trading
            IconBarrierDown   : React.lazy(() => import(/* webpackChunkName: "icon-barrier-down" */ './Trading/Barriers/icon-barrier-down.jsx')),
            IconBarrierUp     : React.lazy(() => import(/* webpackChunkName: "icon-barrier-up" */ './Trading/Barriers/icon-barrier-up.jsx')),
            IconTradeCategory : React.lazy(() => import(/* webpackChunkName: "icon-trade-category" */ './Trading/Categories/icon-trade-categories.jsx')),
            TradeCategoriesGIF: React.lazy(() => import(/* webpackChunkName: "icon-trade-categories-gif" */ './Trading/Categories/trade-categories-gif.jsx')),
            TradeCategories   : React.lazy(() => import(/* webpackChunkName: "icon-trade-categories" */ './Trading/Categories/trade-categories.jsx')),
            IconTradeType     : React.lazy(() => import(/* webpackChunkName: "icon-trade-type" */ './Trading/Types/icon-trade-types.jsx')),
            IconLock          : React.lazy(() => import(/* webpackChunkName: "icon-lock" */ './Trading/icon-lock.jsx')),
            IconPriceMove     : React.lazy(() => import(/* webpackChunkName: "icon-price-move" */ './Trading/icon-price-move.jsx')),
        };
    }

    render() {
        const options = {
            category     : this.props.category,
            className    : this.props.className,
            classNamePath: this.props.classNamePath,
            classNameRect: this.props.classNameRect,
            height       : this.props.height,
            is_dark_theme: this.props.is_dark_theme,
            is_disabled  : this.props.is_disabled,
            onClick      : this.props.onClick,
            onMouseEnter : this.props.onMouseEnter,
            onMouseLeave : this.props.onMouseLeave,
            type         : this.props.type,
            width        : this.props.width,
        };

        const IconLazy = this.icons[this.props.icon];
        if (!IconLazy) return <div />;

        return (
            <React.Suspense fallback={<div />}>
                <IconLazy {...options} />
            </React.Suspense>
        );
    }
}

Icon.propTypes = {
    category     : PropTypes.string,
    className    : PropTypes.string,
    classNamePath: PropTypes.string,
    classNameRect: PropTypes.string,
    icon         : PropTypes.string,
    is_dark_theme: PropTypes.bool,
    is_disabled  : PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClick      : PropTypes.func,
    type         : PropTypes.string,
};

export default Icon;
