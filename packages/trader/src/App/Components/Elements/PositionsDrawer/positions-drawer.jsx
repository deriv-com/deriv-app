import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Icon, DataList, Text, PositionsDrawerCard } from '@deriv/components';
import { routes, useNewRowTransition } from '@deriv/shared';
import { localize } from '@deriv/translations';
import EmptyPortfolioMessage from '../EmptyPortfolioMessage';
import { filterByContractType } from './helpers';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

const PositionsDrawerCardItem = ({
    row: portfolio_position,
    measure,
    onHoverPosition,
    symbol,
    is_new_row,
    ...props
}) => {
    const { in_prop } = useNewRowTransition(is_new_row);

    React.useEffect(() => {
        measure();
    }, [portfolio_position.contract_info.is_sold, measure]);

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
                        onHoverPosition(true, portfolio_position, symbol);
                    }}
                    onMouseLeave={() => {
                        onHoverPosition(false, portfolio_position, symbol);
                    }}
                    onFooterEntered={measure}
                    should_show_transition={is_new_row}
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
        toggleUnsupportedContractModal,
    } = ui;
    const drawer_ref = React.useRef(null);
    const list_ref = React.useRef(null);
    const scrollbar_ref = React.useRef(null);

    React.useEffect(() => {
        onMount();
    }, [onMount]);

    React.useEffect(() => {
        list_ref?.current?.scrollTo(0);
        scrollbar_ref?.current?.scrollToTop();
    }, [symbol, trade_contract_type]);

    const positions = all_positions.filter(
        p =>
            p.contract_info &&
            symbol === p.contract_info.underlying &&
            filterByContractType(p.contract_info, trade_contract_type)
    );

    const body_content = (
        <DataList
            data_source={positions}
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
                    toggleUnsupportedContractModal={toggleUnsupportedContractModal}
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
                        {localize('Recent positions')}
                    </Text>
                    <div
                        id='dt_positions_drawer_close_icon'
                        className='positions-drawer__icon-close'
                        onClick={toggleDrawer}
                    >
                        <Icon icon='IcMinusBold' />
                    </div>
                </div>
                <div className='positions-drawer__body' ref={drawer_ref}>
                    {positions.length === 0 || error ? <EmptyPortfolioMessage error={error} /> : body_content}
                </div>
                <div className='positions-drawer__footer'>
                    <NavLink
                        id='dt_positions_drawer_report_button'
                        className='dc-btn dc-btn--secondary dc-btn__large'
                        to={routes.reports}
                    >
                        <Text size='xs' weight='bold'>
                            {localize('Go to Reports')}
                        </Text>
                    </NavLink>
                </div>
            </div>
        </React.Fragment>
    );
});

PositionsDrawer.propTypes = {
    children: PropTypes.node,
    onChangeContractUpdate: PropTypes.func,
    onClickContractUpdate: PropTypes.func,
};

export default PositionsDrawer;
