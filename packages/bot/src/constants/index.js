import { translate }        from '../utils/lang/i18n';
import { load as loadLang } from '../utils/lang/lang';

loadLang();

const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'LTC', 'BCH'];

const config = {
    lists: {
        PAYOUTTYPE: [
            // [translate('Payout'), 'payout'],
            [translate('Stake'), 'stake'],
        ],
        CRYPTO_CURRENCIES,
        DETAILS: [
            [translate('deal reference id'), '1'],
            [translate('purchase price'), '2'],
            [translate('payout'), '3'],
            [translate('profit'), '4'],
            [translate('contract type'), '5'],
            [translate('entry spot time'), '6'],
            [translate('entry spot price'), '7'],
            [translate('exit spot time'), '8'],
            [translate('exit spot price'), '9'],
            [translate('barrier'), '10'],
            [translate('result'), '11'],
        ],
        CHECK_RESULT     : [[translate('Win'), 'win'], [translate('Loss'), 'loss']],
        CHECK_DIRECTION  : [[translate('Rise'), 'rise'], [translate('Fall'), 'fall'], [translate('No Change'), '']],
        BALANCE_TYPE     : [[translate('string'), 'STR'], [translate('number'), 'NUM']],
        NOTIFICATION_TYPE: [
            [translate('green'), 'success'],
            [translate('blue'), 'info'],
            [translate('yellow'), 'warn'],
            [translate('red'), 'error'],
        ],
        NOTIFICATION_SOUND: [
            [translate('Silent'), 'silent'],
            [translate('Announcement'), 'announcement'],
            [translate('Earned money'), 'earned-money'],
            [translate('Job done'), 'job-done'],
            [translate('Error'), 'error'],
            [translate('Severe error'), 'severe-error'],
        ],
        CURRENCY: [
            ['USD', 'USD'],
            ['EUR', 'EUR'],
            ['GBP', 'GBP'],
            ['AUD', 'AUD'],
            ...CRYPTO_CURRENCIES.map(c => [c, c]),
        ],
    },
    opposites: {
        CALLPUT: [
            {
                CALL: translate('Rise'),
            },
            {
                PUT: translate('Fall'),
            },
        ],
        CALLPUTEQUAL: [
            {
                CALLE: translate('Rise Equals'),
            },
            {
                PUTE: translate('Fall Equals'),
            },
        ],
        HIGHERLOWER: [
            {
                CALL: translate('Higher'),
            },
            {
                PUT: translate('Lower'),
            },
        ],
        TOUCHNOTOUCH: [
            {
                ONETOUCH: translate('Touch'),
            },
            {
                NOTOUCH: translate('No Touch'),
            },
        ],
        ENDSINOUT: [
            {
                EXPIRYRANGE: translate('Ends Between'),
            },
            {
                EXPIRYMISS: translate('Ends Outside'),
            },
        ],
        STAYSINOUT: [
            {
                RANGE: translate('Stays Between'),
            },
            {
                UPORDOWN: translate('Goes Outside'),
            },
        ],
        ASIANS: [
            {
                ASIANU: translate('Asian Up'),
            },
            {
                ASIAND: translate('Asian Down'),
            },
        ],
        MATCHESDIFFERS: [
            {
                DIGITMATCH: translate('Matches'),
            },
            {
                DIGITDIFF: translate('Differs'),
            },
        ],
        EVENODD: [
            {
                DIGITEVEN: translate('Even'),
            },
            {
                DIGITODD: translate('Odd'),
            },
        ],
        OVERUNDER: [
            {
                DIGITOVER: translate('Over'),
            },
            {
                DIGITUNDER: translate('Under'),
            },
        ],
        HIGHLOWTICKS: [
            {
                TICKHIGH: translate('High Tick'),
            },
            {
                TICKLOW: translate('Low Tick'),
            },
        ],
        RESET: [
            {
                RESETCALL: translate('Reset Call'),
            },
            {
                RESETPUT: translate('Reset Put'),
            },
        ],
        RUNS: [
            {
                RUNHIGH: translate('Only Ups'),
            },
            {
                RUNLOW: translate('Only Downs'),
            },
        ],
        CALLPUTSPREAD: [
            {
                CALLSPREAD: translate('Call Spread'),
            },
            {
                PUTSPREAD: translate('Put Spread'),
            },
        ],
    },
    BARRIER_TYPES: [['Offset\u00A0+', '+'], ['Offset\u00A0-', '-']],
    ohlcFields   : [
        [translate('Open'), 'open'],
        [translate('High'), 'high'],
        [translate('Low'), 'low'],
        [translate('Close'), 'close'],
        [translate('Open Time'), 'epoch'],
    ],
    candleIntervals: [
        [translate('Default'), 'default'],
        [translate('1 minute'), '60'],
        [translate('2 minutes'), '120'],
        [translate('3 minutes'), '180'],
        [translate('5 minutes'), '300'],
        [translate('10 minutes'), '600'],
        [translate('15 minutes'), '900'],
        [translate('30 minutes'), '1800'],
        [translate('1 hour'), '3600'],
        [translate('2 hours'), '7200'],
        [translate('4 hours'), '14400'],
        [translate('8 hours'), '28800'],
        [translate('1 day'), '86400'],
    ],
    mainBlocks                             : ['trade_definition', 'before_purchase', 'after_purchase', 'during_purchase'],
    TRADE_TYPE_TO_CONTRACT_CATEGORY_MAPPING: {
        callput: ['callput', 'higherlower'],
        asian  : ['asians'],
        digits : ['matchesdiffers', 'evenodd', 'overunder'],
    },
    TRADE_TYPE_CATEGORIES: {
        callput      : ['callput', 'callputequal', 'higherlower'],
        touchnotouch : ['touchnotouch'],
        inout        : ['endsinout', 'staysinout'],
        asian        : ['asians'],
        digits       : ['matchesdiffers', 'evenodd', 'overunder'],
        reset        : ['reset'],
        callputspread: ['callputspread'],
        highlowticks : ['highlowticks'],
        runs         : ['runs'],
    },
    TRADE_TYPE_CATEGORY_NAMES: {
        callput      : translate('Up/Down'),
        touchnotouch : translate('Touch/No Touch'),
        inout        : translate('In/Out'),
        asian        : translate('Asians'),
        digits       : translate('Digits'),
        reset        : translate('Reset Call/Reset Put'),
        callputspread: translate('Call Spread/Put Spread'),
        highlowticks : translate('High/Low Ticks'),
        runs         : translate('Only Ups/Only Downs'),
    },
    BARRIER_CATEGORIES: {
        euro_atm     : ['callput', 'callputequal'],
        euro_non_atm : ['endsinout', 'higherlower', 'callputspread'],
        american     : ['staysinout', 'touchnotouch', 'highlowticks', 'runs'],
        non_financial: ['digits', 'overunder', 'evenodd', 'matchesdiffers'],
        asian        : ['asians'],
        reset        : ['reset'],
        lookback     : ['lookback'],
    },
    DEFAULT_DURATION_DROPDOWN_OPTIONS: [
        [translate('Ticks'), 't'],
        [translate('Seconds'), 's'],
        [translate('Minutes'), 'm'],
        [translate('Hours'), 'h'],
        [translate('Days'), 'd'],
    ],
    BARRIER_LABELS                  : [translate('High barrier'), translate('Low barrier')],
    ABSOLUTE_BARRIER_DROPDOWN_OPTION: [[translate('Absolute'), 'absolute']],
    NOT_AVAILABLE_DROPDOWN_OPTIONS  : [[translate('Not available'), 'na']],
    NOT_AVAILABLE_DURATIONS         : [{ display: translate('Not available'), unit: 'na', min: 0 }],
    BARRIER_TRADE_TYPES             : ['higherlower', 'touchnotouch', 'endsinout', 'staysinout', 'callputspread'],
    DIGIT_CATEGORIES                : ['digits', 'highlowticks'],
    INDEPEDENT_BLOCKS               : ['block_holder', 'tick_analysis', 'loader', 'procedures_defreturn', 'procedures_defnoreturn'],
    bbResult                        : [[translate('upper'), '1'], [translate('middle'), '0'], [translate('lower'), '2']],
    macdFields                      : [[translate('Histogram'), '0'], [translate('MACD'), '1'], [translate('Signal'), '2']],
    gd                              : {
        cid: '646610722767-7ivdbunktgtnumj23en9gkecbgtf2ur7.apps.googleusercontent.com',
        aid: 'binarybot-237009',
        api: 'AIzaSyBieTeLip_lVQZUimIuJypU1kJyqOvQRgc',
    },
    help: {
        TEXT : 'text',
        VIDEO: 'video',
        IMAGE: 'image',
        BLOCK: 'block',
    },
    workspaces: {
        flyoutWorkspacesStartScale: 0.7,
        mainWorkspaceStartScale   : 0.9,
    },
};

export default config;
