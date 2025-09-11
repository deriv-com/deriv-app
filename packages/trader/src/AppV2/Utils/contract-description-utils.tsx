import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';
import VideoFragment from 'AppV2/Components/Guide/Description/video-fragment';
import { DESCRIPTION_VIDEO_ID } from 'Modules/Trading/Helpers/video-config';
import { CONTRACT_LIST } from './trade-types-utils';

type TDtraderVideoUrl = {
    [key: string]: TVideoVariants;
};

type TVideoVariants = {
    dark: string;
    light: string;
};

export const getTerm = () => ({
    BARRIER: localize('Barrier'),
    CONTRACT_VALUE: localize('Contract value'),
    DEAL_CANCELLATION: localize('Deal cancellation'),
    ENTRY_SPOT: localize('Entry spot'),
    EXIT_SPOT: localize('Exit spot'),
    EXPIRY: localize('Expiry'),
    FINAL_PRICE: localize('Final price'),
    GROWTH_RATE: localize('Growth rate'),
    INDEX: localize('Index price'),
    STAKE: localize('Stake'),
    PAYOUT: localize('Payout'),
    PAYOUT_PER_POINT: localize('Payout per point'),
    PREVIOUS_SPOT_PRICE: localize('Previous spot price'),
    RANGE: localize('Range'),
    SLIPPAGE_RISK: localize('Slippage risk'),
    STOP_OUT: localize('Stop out'),
    STOP_LOSS: localize('Stop loss'),
    STRIKE_PRICE: localize('Strike price'),
    TAKE_PROFIT: localize('Take profit'),
    BARRIER_RANGE: localize('Barrier range'),
    SPOT_PRICE: localize('Spot price'),
});

const getDefinition = () => {
    const {
        BARRIER,
        CONTRACT_VALUE,
        DEAL_CANCELLATION,
        ENTRY_SPOT,
        EXIT_SPOT,
        EXPIRY,
        FINAL_PRICE,
        GROWTH_RATE,
        PAYOUT,
        PAYOUT_PER_POINT,
        PREVIOUS_SPOT_PRICE,
        RANGE,
        SLIPPAGE_RISK,
        STOP_OUT,
        STOP_LOSS,
        STRIKE_PRICE,
        TAKE_PROFIT,
        INDEX,
        STAKE,
        BARRIER_RANGE,
        SPOT_PRICE,
    } = getTerm();
    return {
        [BARRIER]: (
            <Localize i18n_default_text='The corresponding price level based on the payout per point you’ve selected.' />
        ),
        [SPOT_PRICE]: (
            <Localize i18n_default_text='The real-time price of an asset for immediate buying and selling.' />
        ),
        [CONTRACT_VALUE]: (contract_type: string) =>
            contract_type === CONTRACT_LIST.VANILLAS ? (
                <Localize i18n_default_text='The current value of a trade contract, based on the initial buy price and the current profit/loss.' />
            ) : (
                <Localize i18n_default_text='This is the resale value of your contract, based on the prevailing market conditions (e.g, the current spot), including additional commissions if any.' />
            ),
        [DEAL_CANCELLATION]: (
            <Localize i18n_default_text='A feature that lets you cancel your trade and get your stake back if the price moves against you.' />
        ),
        [ENTRY_SPOT]: (
            <Localize i18n_default_text='The specific price level at which a trader decides to buy or sell an asset.' />
        ),
        [EXIT_SPOT]: (
            <Localize i18n_default_text='The specific price level at which a trader closes their positions in a market, either to realise profits or limit losses.' />
        ),
        [EXPIRY]: (
            <Localize i18n_default_text='The moment when a contract ends — the exact time at which it matures. It marks the final point when the outcome of the contract is determined.' />
        ),
        [FINAL_PRICE]: <Localize i18n_default_text='This is the spot price of the last tick at expiry.' />,
        [GROWTH_RATE]: (
            <Localize i18n_default_text='A feature that lets you select a percentage gain for your stake (1%, 2%, 3%, 4%, or 5%).' />
        ),
        [PAYOUT]: <Localize i18n_default_text='The sum of your initial stake and profit.' />,
        [PAYOUT_PER_POINT]: (
            <Localize i18n_default_text='The money you make or lose for every one-point change in an asset’s price.' />
        ),
        [PREVIOUS_SPOT_PRICE]: <Localize i18n_default_text='The price from the trading period that just ended.' />,
        [RANGE]: (
            <Localize i18n_default_text='It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.' />
        ),
        [SLIPPAGE_RISK]: (
            <Localize i18n_default_text='The chance that your order will be executed at a worse price than you expected.' />
        ),
        [STOP_OUT]: (
            <Localize i18n_default_text='An automated action to close a trader’s open positions when their account’s equity falls to a predetermined level.' />
        ),
        [STOP_LOSS]: (
            <Localize i18n_default_text='An order placed to automatically sell an asset once it reaches a certain price.' />
        ),
        [STRIKE_PRICE]: (
            <Localize i18n_default_text='The agreed-upon price in the contract that decides whether your trade wins or loses.' />
        ),
        [TAKE_PROFIT]: (
            <Localize i18n_default_text='An order set by a trader to automatically close a profitable position when an asset’s price reaches a specified level.' />
        ),
        [INDEX]: <Localize i18n_default_text='A measure of a section of shares in the stock market.' />,
        [STAKE]: <Localize i18n_default_text='The amount of money risked in your trade.' />,
        [BARRIER_RANGE]: (
            <Localize i18n_default_text='The maximum amount the price is allowed to move from its previous value at each step. If the price goes beyond that amount, the contract ends.' />
        ),
    };
};

export const getTermDefinition = ({ contract_type, term }: { contract_type?: string; term?: string }) => {
    if (!contract_type || !term) return;
    const result = getDefinition()[term];
    if (typeof result === 'function') return result(contract_type);
    return result ?? '';
};

interface PayoutBadgeProps {
    children: React.ReactNode;
}

const PayoutBadge: React.FC<PayoutBadgeProps> = ({ children }) => {
    return <div className='description__badge'>{children}</div>;
};

export const getContractDescription = (
    content: {
        type: string;
        text: JSX.Element | string;
    }[],
    is_mobile_forced = false
) =>
    content.map(({ type, text }, index) => {
        if (type === 'heading' && typeof text !== 'string')
            return (
                <Text key={text.props.i18n_default_text} bold size='md' className='description__heading'>
                    {text}
                </Text>
            );
        if ((type === 'paragraph' || type === 'general') && typeof text !== 'string')
            return (
                <Text
                    as='p'
                    key={text.props.i18n_default_text}
                    size='sm'
                    className={`description__${type}`}
                    color='quill-typography__color--default'
                >
                    {text}
                </Text>
            );
        if (type === 'video' && typeof text === 'string')
            return <VideoFragment contract_type={text} key={text + index} is_mobile_forced={is_mobile_forced} />;
        if (type === 'badge' && typeof text !== 'string')
            return <PayoutBadge key={`badge-${index}`}>{text}</PayoutBadge>;
    });

export const DESCRIPTION_VIDEO_IDS: TDtraderVideoUrl = {
    [CONTRACT_LIST.ACCUMULATORS]: DESCRIPTION_VIDEO_ID.accumulator,
    [CONTRACT_LIST.EVEN_ODD]: DESCRIPTION_VIDEO_ID.even_odd,
    [CONTRACT_LIST.HIGHER_LOWER]: DESCRIPTION_VIDEO_ID.high_low,
    [CONTRACT_LIST.MATCHES_DIFFERS]: DESCRIPTION_VIDEO_ID.match_diff,
    [CONTRACT_LIST.MULTIPLIERS]: DESCRIPTION_VIDEO_ID.multiplier,
    [CONTRACT_LIST.OVER_UNDER]: DESCRIPTION_VIDEO_ID.over_under,
    [CONTRACT_LIST.RISE_FALL]: DESCRIPTION_VIDEO_ID.rise_fall,
    [CONTRACT_LIST.TOUCH_NO_TOUCH]: DESCRIPTION_VIDEO_ID.touch,
    [CONTRACT_LIST.VANILLAS]: DESCRIPTION_VIDEO_ID.vanilla,
    [CONTRACT_LIST.TURBOS]: DESCRIPTION_VIDEO_ID.turbos,
};

export const getDescriptionVideoIds = (contract_type = '', is_dark_theme = false) =>
    DESCRIPTION_VIDEO_IDS[contract_type]?.[is_dark_theme ? 'dark' : 'light'];
