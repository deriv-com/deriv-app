import { IconArrow }              from 'Assets/Common/icon-arrow.jsx';
import { IconArrowBold }          from 'Assets/Common/icon-arrow-bold.jsx';
import { IconBack }               from 'Assets/Common/icon-back.jsx';
import { IconCalendar }           from 'Assets/Common/icon-calendar.jsx';
import { IconCalendarToday }      from 'Assets/Common/icon-calendar-today.jsx';
import { IconChevronDoubleLeft }  from 'Assets/Common/icon-chevron-double-left.jsx';
import { IconChevronDoubleRight } from 'Assets/Common/icon-chevron-double-right.jsx';
import { IconChevronLeft }        from 'Assets/Common/icon-chevron-left.jsx';
import { IconChevronRight }       from 'Assets/Common/icon-chevron-right.jsx';
import { IconClear }              from 'Assets/Common/icon-clear.jsx';
import { IconClock }              from 'Assets/Common/icon-clock.jsx';
import { IconClose }              from 'Assets/Common/icon-close.jsx';
import { IconCountryFlag }        from 'Assets/Common/icon-country-flag.jsx';
import { IconError }              from 'Assets/Common/icon-error.jsx';
import { IconExclamation }        from 'Assets/Common/icon-exclamation.jsx';
import { IconFlag }               from 'Assets/Common/icon-flag.jsx';
import { IconInfoBlue }           from 'Assets/Common/icon-info-blue.jsx';
import { IconInfoOutline }        from 'Assets/Common/icon-info-outline.jsx';
import { IconInitialLogoDark }    from 'Assets/Common/icon-initial-logo-dark.jsx';
import { IconInitialLogoLight }   from 'Assets/Common/icon-initial-logo-light.jsx';
import { IconMinimize }           from 'Assets/Common/icon-minimize.jsx';
import { IconMinus }              from 'Assets/Common/icon-minus.jsx';
import { IconPlus }               from 'Assets/Common/icon-plus.jsx';
import { IconQuestion }           from 'Assets/Common/icon-question.jsx';
import { IconRedDot }             from 'Assets/Common/icon-red-dot.jsx';
import { IconSuccess }            from 'Assets/Common/icon-success.jsx';
import { IconWarning }            from 'Assets/Common/icon-warning.jsx';

// import { IconEntrySpotSVG }       from 'Assets/Contract/icon-entry-spot.jsx';
import { IconEndTimeSVG }         from 'Assets/Contract/icon-end-time.jsx';
import { IconFlagSVG }            from 'Assets/Contract/icon-flag.jsx';
import { IconStartTimeSVG }       from 'Assets/Contract/icon-start-time.jsx';
import { IconTickSVG }            from 'Assets/Contract/icon-tick.jsx';

import { IconMaximize }           from 'Assets/Footer/icon-maximize.jsx';
import { IconPositions }          from 'Assets/Footer/icon-positions.jsx';
import { IconSettings }           from 'Assets/Footer/icon-settings.jsx';

import { IconAccountsCurrency }   from 'Assets/Header/AccountsCurrency/icon_accounts_currency.jsx';
import { IconLogout }             from 'Assets/Header/Drawer/icon-logout.jsx';
import { IconBell }               from 'Assets/Header/NavBar/icon-bell.jsx';
import { IconCashier }            from 'Assets/Header/NavBar/icon-cashier.jsx';
import { IconHamburger }          from 'Assets/Header/NavBar/icon-hamburger.jsx';
import { IconPortfolio }          from 'Assets/Header/NavBar/icon-portfolio.jsx';
import { IconStatement }          from 'Assets/Header/NavBar/icon-statement.jsx';
import { IconTrade }              from 'Assets/Header/NavBar/icon-trade.jsx';

import { IconBuy }                from 'Assets/Statement/icon-buy.jsx';
import { IconDeposit }            from 'Assets/Statement/icon-deposit.jsx';
import { IconPayout }             from 'Assets/Statement/icon-payout.jsx';
import { IconSell }               from 'Assets/Statement/icon-sell.jsx';
import { IconWallet }             from 'Assets/Statement/icon-wallet.jsx';
import { IconWithdrawal }         from 'Assets/Statement/icon-withdrawal.jsx';

import { IconBarrierDown }        from 'Assets/Trading/Barriers/icon-barrier-down.jsx';
import { IconBarrierUp }          from 'Assets/Trading/Barriers/icon-barrier-up.jsx';
import { IconTradeCategory }      from 'Assets/Trading/Categories/icon-trade-categories.jsx';
import { IconTradeType }          from 'Assets/Trading/Types/icon-trade-types.jsx';
import { IconLock }               from 'Assets/Trading/icon-lock.jsx';
import { IconPriceMove }          from 'Assets/Trading/icon-price-move.jsx';

const ICONS = {
    COMMON: {
        ARROW               : IconArrow,
        ARROW_BOLD          : IconArrowBold,
        BACK                : IconBack,
        CALENDAR_TODAY      : IconCalendarToday,
        CALENDAR            : IconCalendar,
        CHEVRON_DOUBLE_LEFT : IconChevronDoubleLeft,
        CHEVRON_DOUBLE_RIGHT: IconChevronDoubleRight,
        CHEVRON_LEFT        : IconChevronLeft,
        CHEVRON_RIGHT       : IconChevronRight,
        CLEAR               : IconClear,
        CLOCK               : IconClock,
        CLOSE               : IconClose,
        COUNTRY_FLAG        : IconCountryFlag,
        ERROR               : IconError,
        EXCLAMATION         : IconExclamation,
        FLAG                : IconFlag,
        INFO_BLUE           : IconInfoBlue,
        INFO_OUTLINE        : IconInfoOutline,
        INITIAL_LOGO_DARK   : IconInitialLogoDark,
        INITIAL_LOGO_LIGHT  : IconInitialLogoLight,
        MINIMIZE            : IconMinimize,
        MINUS               : IconMinus,
        PLUS                : IconPlus,
        QUESTION            : IconQuestion,
        RED_DOT             : IconRedDot,
        SUCCESS             : IconSuccess,
        WARNING             : IconWarning,
    },
    CONTRACT: {
        // ENTRY_SPOT: IconEntrySpotSVG,
        END_TIME  : IconEndTimeSVG,
        FLAG      : IconFlagSVG,
        START_TIME: IconStartTimeSVG,
        TICK      : IconTickSVG,
    },
    FOOTER: {
        MAXIMIZE : IconMaximize,
        POSITIONS: IconPositions,
        SETTINGS : IconSettings,
    },
    HEADER: {
        ACCOUNTS_CURRENCY: IconAccountsCurrency,
        LOGOUT           : IconLogout,
        BELL             : IconBell,
        CASHIER          : IconCashier,
        HAMBURGER        : IconHamburger,
        PORTFOLIO        : IconPortfolio,
        STATEMENT        : IconStatement,
        TRADE            : IconTrade,
    },
    STATEMENT: {
        BUY       : IconBuy,
        DEPOSIT   : IconDeposit,
        PAYOUT    : IconPayout,
        SELL      : IconSell,
        WALLET    : IconWallet,
        WITHDRAWAL: IconWithdrawal,
    },
    TRADING: {
        BARRIER_DOWN  : IconBarrierDown,
        BARRIER_UP    : IconBarrierUp,
        TRADE_CATEGORY: IconTradeCategory,
        TRADE_TYPES   : IconTradeType,
        LOCK          : IconLock,
        PRICE_MOVE    : IconPriceMove,
    },
};

export { ICONS };
