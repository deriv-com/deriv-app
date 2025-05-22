import classNames from 'classnames';
import React from 'react';
import { toJS } from 'mobx';
import { Popover, Text } from '@deriv/components';
import { TickSpotData } from '@deriv/api-types';
import { getMarketNamesMap, useIsMounted, isContractElapsed, TContractStore } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Bounce, SlideIn } from 'App/Components/Animations';
import { DigitSpot, LastDigitPrediction } from '../LastDigitPrediction';
import { useTraderStore } from 'Stores/useTraderStores';
import { useDevice } from '@deriv-com/ui';

type TTraderStore = ReturnType<typeof useTraderStore>;
type TOnChangeStatus = { status: string | null | undefined; current_tick: number | null };
type TOnLastDigitSpot = {
    spot: string | null;
    is_lost?: boolean;
    is_selected_winning: boolean;
    is_latest: boolean;
    is_won?: boolean;
};
type TDigitsWrapper = TDigits & {
    onChangeStatus?: (params: TOnChangeStatus) => void;
    onLastDigitSpot?: (params: TOnLastDigitSpot) => void;
};
type TDigits = Pick<TContractStore, 'contract_info' | 'digits_info'> & {
    digits_array?: number[];
    display_status?: TContractStore['display_status'];
    is_digit_contract?: TContractStore['is_digit_contract'];
    is_ended?: TContractStore['is_ended'];
    is_trade_page?: boolean;
    is_mobile: boolean;
    onDigitChange?: TTraderStore['onChange'];
    selected_digit?: TTraderStore['last_digit'];
    trade_type?: TTraderStore['contract_type'];
    tick?: TickSpotData | null;
    underlying?: TTraderStore['symbol'];
};
type TTickStream = NonNullable<TContractStore['contract_info']['tick_stream']>[number];
type TTickData =
    | TickSpotData
    | null
    | undefined
    | {
          ask: TTickStream['tick'];
          bid: TTickStream['tick'];
          current_tick: number;
          epoch: TTickStream['epoch'];
          quote: TTickStream['tick'];
          pip_size?: number;
      };

const DigitsWrapper = ({
    contract_info,
    digits_array,
    digits_info,
    display_status,
    is_digit_contract,
    is_ended,
    is_trade_page,
    is_mobile,
    onDigitChange,
    selected_digit,
    trade_type,
    onChangeStatus,
    ...props
}: TDigitsWrapper) => {
    const has_contract = contract_info.date_start;
    let tick: TTickData = props.tick;

    const is_tick_ready = is_trade_page ? !!tick : true;
    const is_contract_elapsed = is_trade_page ? isContractElapsed(contract_info, tick) : false;
    const status = !is_contract_elapsed && is_tick_ready ? display_status : null;

    // tick from contract_info.tick_stream has totally different
    // format from the tick from tick_history api call.
    if (has_contract && !is_contract_elapsed) {
        tick = null;
        const tick_stream = contract_info.tick_stream;
        if (tick_stream?.length) {
            const t = toJS(tick_stream.slice(-1)[0]);
            tick = {
                ask: t.tick,
                bid: t.tick,
                epoch: t.epoch,
                pip_size: t.tick_display_value?.split('.')[1].length,
                quote: t.tick,
                current_tick: tick_stream.length,
            };
        }
    }

    React.useEffect(() => {
        if (onChangeStatus) {
            onChangeStatus({ status, current_tick: tick && 'current_tick' in tick ? tick.current_tick : null });
        }
    }, [tick, is_trade_page, display_status, onChangeStatus, status]);

    return (
        <LastDigitPrediction
            // dimension of a single digit widget including margin/padding (number)
            // i.e - 40px + 6px left and 6px right padding/margin = 52
            dimension={is_mobile ? 64 : 52}
            has_entry_spot={!!contract_info.entry_tick}
            barrier={!is_contract_elapsed && is_tick_ready ? Number(contract_info.barrier) : null}
            contract_type={!is_contract_elapsed && is_tick_ready ? contract_info.contract_type : ''}
            digits={digits_array}
            digits_info={!is_contract_elapsed && is_tick_ready ? digits_info : {}}
            is_digit_contract={is_digit_contract}
            is_ended={is_ended}
            is_trade_page={is_trade_page}
            status={status as React.ComponentProps<typeof LastDigitPrediction>['status']}
            tick={tick as React.ComponentProps<typeof LastDigitPrediction>['tick']}
            trade_type={trade_type}
            onDigitChange={onDigitChange}
            selected_digit={selected_digit}
            onLastDigitSpot={props.onLastDigitSpot}
        />
    );
};

const Digits = React.memo((props: TDigits) => {
    const [status, setStatus] = React.useState<string | null>();
    const [current_tick, setCurrentTick] = React.useState<number | null>();
    const [spot, setSpot] = React.useState<string | null>();
    const [is_selected_winning, setIsSelectedWinning] = React.useState<boolean>();
    const [is_won, setIsWon] = React.useState<boolean>();
    const [is_lost, setIsLost] = React.useState<boolean>();
    const isMounted = useIsMounted();
    const { isMobile } = useDevice();

    const { contract_info, digits_array, is_digit_contract, is_trade_page, underlying } = props;

    const onChangeStatus = (params: TOnChangeStatus) => {
        setStatus(params.status);
        setCurrentTick(params.current_tick);
    };

    const onLastDigitSpot = (params: TOnLastDigitSpot) => {
        setSpot(params.spot);
        setIsLost(params.is_lost);
        setIsSelectedWinning(params.is_selected_winning);
        setIsWon(params.is_won);
    };

    const getPopoverMessage = () => {
        const underlying_name = is_trade_page ? underlying : contract_info.underlying;
        return (
            <Localize
                i18n_default_text='Last digit stats for latest 1000 ticks for {{underlying_name}}'
                values={{
                    underlying_name:
                        getMarketNamesMap()[
                            underlying_name?.toUpperCase() as keyof ReturnType<typeof getMarketNamesMap>
                        ],
                }}
            />
        );
    };

    if (isMobile) {
        return (
            <div className='digits__container'>
                <Bounce
                    is_visible={!!(is_digit_contract && status && spot && !!contract_info.entry_tick)}
                    className={classNames('digits__digit-spot', {
                        'digits__digit-spot--is-trading': is_trade_page,
                    })}
                    keyname='digits__digit-spot'
                >
                    {is_trade_page && (
                        <Text size='xs' align='center' className='digits__digit-spot-value'>
                            <Localize i18n_default_text='Tick {{current_tick}} - ' values={{ current_tick }} />
                        </Text>
                    )}
                    <DigitSpot
                        current_spot={spot}
                        is_lost={is_lost}
                        is_selected_winning={is_selected_winning}
                        is_won={is_won}
                    />
                </Bounce>
                <DigitsWrapper {...props} onChangeStatus={onChangeStatus} onLastDigitSpot={onLastDigitSpot} />
            </div>
        );
    }

    return (
        <SlideIn
            is_visible={(digits_array || is_digit_contract) && isMounted()}
            className='digits__container'
            keyname='digits'
            type='bottom'
        >
            {is_trade_page && (
                <div className='digits__tooltip-container'>
                    <Popover
                        alignment='top'
                        classNameBubble='digits__tooltip-bubble'
                        icon='info'
                        id='dt_last_digits_info_tooltip'
                        margin={4}
                        message={getPopoverMessage()}
                        zIndex='100'
                    />
                </div>
            )}
            <DigitsWrapper {...props} />
        </SlideIn>
    );
});

Digits.displayName = 'Digits';

export default Digits;
