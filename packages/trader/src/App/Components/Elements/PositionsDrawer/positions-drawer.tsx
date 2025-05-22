import React from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';

import { DataList, Icon, Money, PositionsDrawerCard, Text } from '@deriv/components';
import { useNewRowTransition } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';

import { useTraderStore } from 'Stores/useTraderStores';

import EmptyPortfolioMessage from '../EmptyPortfolioMessage';

type TUiStore = Pick<
    ReturnType<typeof useStore>['ui'],
    | 'addToast'
    | 'current_focus'
    | 'is_mobile'
    | 'removeToast'
    | 'setCurrentFocus'
    | 'should_show_cancellation_warning'
    | 'toggleCancellationWarning'
>;
type TPortfolioStore = Pick<
    ReturnType<typeof useStore>['portfolio'],
    'onHoverPosition' | 'onClickCancel' | 'onClickSell'
>;
type TPositionDrawerCardItem = TPortfolioStore &
    TUiStore & {
        currency: ReturnType<typeof useStore>['client']['currency'];
        getContractById: ReturnType<typeof useStore>['contract_trade']['getContractById'];
        is_new_row?: boolean;
        measure?: () => void;
        onClickRemove: ReturnType<typeof useStore>['portfolio']['removePositionById'];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        row?: TPortfolioPosition | { [key: string]: any };
        server_time: ReturnType<typeof useStore>['common']['server_time'];
        symbol: ReturnType<typeof useTraderStore>['symbol'];
    };
type TPortfolioPosition = ReturnType<typeof useStore>['portfolio']['active_positions'][0];

const PositionsDrawerCardItem = ({
    row: portfolio_position,
    measure,
    onHoverPosition,
    symbol,
    is_new_row,
    onClickRemove,
    ...props
}: TPositionDrawerCardItem) => {
    const { in_prop } = useNewRowTransition(is_new_row as boolean);

    React.useEffect(() => {
        measure?.();
    }, [portfolio_position?.contract_info.is_sold, measure]);

    React.useEffect(() => {
        if (portfolio_position?.contract_info.is_sold) {
            const timeout = setTimeout(() => {
                onClickRemove(portfolio_position.id);
            }, 8000);

            return () => clearTimeout(timeout);
        }
    }, [portfolio_position?.contract_info.is_sold, portfolio_position?.id, onClickRemove]);

    return (
        <CSSTransition
            in={in_prop}
            timeout={150}
            classNames={{
                appear: 'dc-contract-card__wrapper--enter',
                enter: 'dc-contract-card__wrapper--enter',
                enterDone: 'dc-contract-card__wrapper--enter-done',
                exit: 'dc-contract-card__wrapper--exit',
            }}
            onEntered={measure}
            unmountOnExit
        >
            <div className='dc-contract-card__wrapper'>
                <PositionsDrawerCard
                    {...portfolio_position}
                    {...props}
                    onMouseEnter={() => {
                        onHoverPosition(true, portfolio_position as TPortfolioPosition, symbol);
                    }}
                    onMouseLeave={() => {
                        onHoverPosition(false, portfolio_position as TPortfolioPosition, symbol);
                    }}
                    onFooterEntered={measure}
                    should_show_transition={is_new_row}
                    onClickRemove={onClickRemove}
                />
            </div>
        </CSSTransition>
    );
};

const PositionsDrawer = observer(({ ...props }) => {
    const { symbol, contract_type: trade_contract_type } = useTraderStore();
    const { client, common, contract_trade, portfolio, ui } = useStore();
    const { currency } = client;
    const { server_time } = common;
    const { getContractById } = contract_trade;
    const {
        all_positions,
        error,
        onHoverPosition,
        onMount,
        onClickCancel,
        onClickSell,
        removePositionById: onClickRemove,
    } = portfolio;
    const {
        is_mobile,
        is_positions_drawer_on,
        togglePositionsDrawer: toggleDrawer,
        addToast,
        current_focus,
        removeToast,
        setCurrentFocus,
        should_show_cancellation_warning,
        toggleCancellationWarning,
    } = ui;
    const drawer_ref = React.useRef(null);
    const list_ref = React.useRef<HTMLDivElement>(null);
    const scrollbar_ref = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        onMount();
    }, [onMount]);

    React.useEffect(() => {
        list_ref?.current?.scrollTo({ top: 0 });
        if (scrollbar_ref.current) scrollbar_ref.current.scrollTop = 0;
    }, [symbol, trade_contract_type]);

    const getTotalProfit = (active_positions: TPortfolioPosition[]) => {
        return active_positions.reduce((total: number, position: TPortfolioPosition) => {
            return total + (position.contract_info.profit || 0);
        }, 0);
    };

    const body_content = (
        <DataList
            data_source={all_positions}
            rowRenderer={args => (
                <PositionsDrawerCardItem
                    onHoverPosition={onHoverPosition}
                    symbol={symbol}
                    currency={currency}
                    addToast={addToast}
                    onClickCancel={onClickCancel}
                    onClickSell={onClickSell}
                    onClickRemove={onClickRemove}
                    server_time={server_time}
                    getContractById={getContractById}
                    is_mobile={is_mobile}
                    current_focus={current_focus}
                    removeToast={removeToast}
                    setCurrentFocus={setCurrentFocus}
                    should_show_cancellation_warning={should_show_cancellation_warning}
                    toggleCancellationWarning={toggleCancellationWarning}
                    {...args}
                    {...props}
                />
            )}
            keyMapper={row => row.id}
            row_gap={8}
        />
    );

    return (
        <React.Fragment>
            <div
                className={classNames('positions-drawer__bg', {
                    'positions-drawer__bg--open': is_positions_drawer_on,
                })}
            />
            <div
                id='dt_positions_drawer'
                className={classNames('positions-drawer', {
                    'positions-drawer--open': is_positions_drawer_on,
                })}
            >
                <div className='positions-drawer__header'>
                    <Text color='prominent' weight='bold' size='xs'>
                        {localize('Open positions')}
                    </Text>
                    <div
                        data-testid='dt_positions_drawer_close_icon'

                        id='dt_positions_drawer_close_icon'
                        className='positions-drawer__icon-close'
                        onClick={toggleDrawer}
                    >
                        <Icon data-testid='dt_positions_drawer_close_icon' icon='IcMinusBold' />
                    </div>
                </div>
                <div className='positions-drawer__body' ref={drawer_ref}>
                    {all_positions.length === 0 || error ? <EmptyPortfolioMessage error={error} /> : body_content}
                </div>
                <div className='positions-drawer__footer'>
                    {all_positions.length > 0 && (
                        <div className='positions-drawer__summary'>
                            <Text size='xxs' color='less-prominent' className='positions-drawer__count'>
                                {all_positions.length}{' '}
                                {`${all_positions.length > 1 ? localize('open positions') : localize('open position')}`}
                            </Text>
                            <div className='positions-drawer__total'>
                                <Text size='xs' weight='bold'>
                                    {localize('Total P/L:')}
                                </Text>
                                <Text
                                    size='xs'
                                    weight='bold'
                                    color={getTotalProfit(all_positions) > 0 ? 'profit-success' : 'loss-danger'}
                                >
                                    <React.Fragment>
                                        <Money amount={getTotalProfit(all_positions)} currency={currency} has_sign />{' '}
                                        {currency}
                                    </React.Fragment>
                                </Text>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
});

export default PositionsDrawer;
