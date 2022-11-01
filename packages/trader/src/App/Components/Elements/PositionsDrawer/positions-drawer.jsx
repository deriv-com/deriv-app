import classNames from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Icon, DataList, Text, PositionsDrawerCard } from '@deriv/components';
import { routes, useNewRowTransition } from '@deriv/shared';
import { localize } from '@deriv/translations';
import EmptyPortfolioMessage from '../EmptyPortfolioMessage';
import { connect } from 'Stores/connect';
import { filterByContractType } from './helpers';

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

const PositionsDrawer = ({
    all_positions,
    error,
    is_positions_drawer_on,
    onHoverPosition,
    symbol,
    toggleDrawer,
    trade_contract_type,
    onMount,
    ...props
}) => {
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
                <PositionsDrawerCardItem onHoverPosition={onHoverPosition} symbol={symbol} {...args} {...props} />
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
};

PositionsDrawer.propTypes = {
    all_positions: MobxPropTypes.arrayOrObservableArray,
    children: PropTypes.node,
    error: PropTypes.string,
    is_mobile: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    onChangeContractUpdate: PropTypes.func,
    onClickContractUpdate: PropTypes.func,
    onHoverPosition: PropTypes.func,
    onMount: PropTypes.func,
    symbol: PropTypes.string,
    toggleDrawer: PropTypes.func,
    currency: PropTypes.string,
    server_time: PropTypes.object,
    addToast: PropTypes.func,
    current_focus: PropTypes.string,
    onClickCancel: PropTypes.func,
    onClickSell: PropTypes.func,
    onClickRemove: PropTypes.func,
    getContractById: PropTypes.func,
    removeToast: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    toggleCancellationWarning: PropTypes.func,
    toggleUnsupportedContractModal: PropTypes.func,
    trade_contract_type: PropTypes.string,
};

export default connect(({ modules, ui, client, common, portfolio, contract_trade }) => ({
    all_positions: portfolio.all_positions,
    error: portfolio.error,
    onHoverPosition: portfolio.onHoverPosition,
    onMount: portfolio.onMount,
    symbol: modules.trade.symbol,
    trade_contract_type: modules.trade.contract_type,
    is_mobile: ui.is_mobile,
    is_positions_drawer_on: ui.is_positions_drawer_on,
    toggleDrawer: ui.togglePositionsDrawer,
    currency: client.currency,
    server_time: common.server_time,
    addToast: ui.addToast,
    current_focus: ui.current_focus,
    onClickCancel: portfolio.onClickCancel,
    onClickSell: portfolio.onClickSell,
    onClickRemove: portfolio.removePositionById,
    getContractById: contract_trade.getContractById,
    removeToast: ui.removeToast,
    setCurrentFocus: ui.setCurrentFocus,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
    toggleCancellationWarning: ui.toggleCancellationWarning,
    toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
}))(PositionsDrawer);
