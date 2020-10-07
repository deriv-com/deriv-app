import classNames from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { VariableSizeList as List } from 'react-window';
import { Icon, ThemedScrollbars } from '@deriv/components';
import { routes, isMultiplierContract, isHighLow } from '@deriv/shared';
import { localize } from '@deriv/translations';
import EmptyPortfolioMessage from 'Modules/Reports/Components/empty-portfolio-message.jsx';
import { connect } from 'Stores/connect';
import { getContractTypesConfig } from 'Stores/Modules/Trading/Constants/contract';
import { isCallPut } from 'Stores/Modules/Contract/Helpers/contract-type';
import { filterByContractType } from './helpers';
import PositionsDrawerCard from './PositionsDrawerCard';

const ThemedScrollbarsWrapper = React.forwardRef((props, ref) => (
    <ThemedScrollbars {...props} height='calc(100vh - 220px)' forwardedRef={ref}>
        {props.children}
    </ThemedScrollbars>
));
// Display name is required by Developer Tools to give a name to the components we use.
// If a component doesn't have a displayName is will be shown as <Unknown />. Hence, name is set.
ThemedScrollbarsWrapper.displayName = 'ThemedScrollbars';

class PositionsDrawer extends React.Component {
    state = {};

    componentDidMount() {
        this.props.onMount();

        // Todo: Handle Resizing
        this.setState({
            drawer_height: this.drawer_ref.clientHeight,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (
            (this.props.symbol && nextProps.symbol !== this.props.symbol) ||
            (this.props.trade_contract_type && nextProps.trade_contract_type !== this.props.trade_contract_type)
        ) {
            if (this.list_ref && this.scrollbar_ref) {
                this.list_ref.scrollTo(0);
                this.scrollbar_ref.scrollToTop();
            }
        }
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    itemRender = ({
        data,
        index, // Index of row
        style,
        isScrolling,
    }) => {
        const {
            currency,
            onClickCancel,
            onClickSell,
            onClickRemove,
            onHoverPosition,
            server_time,
            toggleUnsupportedContractModal,
        } = this.props;
        const portfolio_position = data[index];

        return (
            <div key={portfolio_position.id} style={style}>
                <CSSTransition
                    appear
                    key={portfolio_position.id}
                    in={true}
                    timeout={isScrolling ? 0 : 150}
                    classNames={
                        isScrolling
                            ? {}
                            : {
                                  appear: 'contract-card__wrapper--enter',
                                  enter: 'contract-card__wrapper--enter',
                                  enterDone: 'contract-card__wrapper--enter-done',
                                  exit: 'contract-card__wrapper--exit',
                              }
                    }
                    unmountOnExit
                >
                    <PositionsDrawerCard
                        onClickCancel={onClickCancel}
                        onClickSell={onClickSell}
                        onClickRemove={onClickRemove}
                        onMouseEnter={() => {
                            onHoverPosition(true, portfolio_position);
                        }}
                        onMouseLeave={() => {
                            onHoverPosition(false, portfolio_position);
                        }}
                        key={portfolio_position.id}
                        currency={currency}
                        server_time={server_time}
                        show_transition={!isScrolling}
                        toggleUnsupportedContractModal={toggleUnsupportedContractModal}
                        {...portfolio_position}
                    />
                </CSSTransition>
            </div>
        );
    };

    filterByContractType = ({ contract_type, shortcode }) => {
        const { trade_contract_type } = this.props;
        const is_call_put = isCallPut(trade_contract_type);
        const is_high_low = isHighLow({ shortcode });
        const trade_types = is_call_put
            ? ['CALL', 'CALLE', 'PUT', 'PUTE']
            : getContractTypesConfig()[trade_contract_type]?.trade_types;
        const match = trade_types?.includes(contract_type);
        if (trade_contract_type === 'high_low') return is_high_low;
        return match && !is_high_low;
    };

    hasPositionsHeightChanged = (newPositionsHeight, oldPositionsHeight) => {
        if (newPositionsHeight.length !== oldPositionsHeight.length) {
            return true;
        }
        for (let i = 0; i < newPositionsHeight.length; i++) {
            if (newPositionsHeight[i] !== oldPositionsHeight[i]) {
                return true;
            }
        }
        return false;
    };

    calculatePositionsHeight() {
        const newPositionsHeight = this.positions.map(position => this.getPositionHeight(position));
        if (this.list_ref && this.hasPositionsHeightChanged(newPositionsHeight, this.positionsHeight)) {
            // When there is a change in height of an item, this recalculates scroll height of the list and reapplies styles.
            setTimeout(() => (this.list_ref ? this.list_ref.resetAfterIndex(0) : undefined));
        }

        this.positionsHeight = newPositionsHeight;
    }

    getCachedPositionHeight = index => {
        return this.positionsHeight[index];
    };

    getPositionHeight = position => {
        // React window doesn't work with dynamic height. This is a work around to get height of a position based on different combinations.
        const { contract_info } = position;
        const is_multiplier_contract = isMultiplierContract(contract_info.contract_type);
        const is_tick_contract = contract_info.tick_count > 0;

        if (contract_info.is_sold) {
            return is_multiplier_contract ? 266 : 167;
        } else if (is_tick_contract) {
            return 245;
        }
        return is_multiplier_contract ? 310 : 238;
    };

    render() {
        const {
            all_positions,
            error,
            is_empty,
            is_positions_drawer_on,
            symbol,
            toggleDrawer,
            trade_contract_type,
        } = this.props;

        this.positions = all_positions.filter(
            p =>
                p.contract_info &&
                symbol === p.contract_info.underlying &&
                filterByContractType(p.contract_info, trade_contract_type)
        );
        this.calculatePositionsHeight();

        const body_content = (
            <React.Fragment>
                <div style={{ height: '100%' }}>
                    {this.state.drawer_height > 0 && (
                        <TransitionGroup
                            component='div'
                            style={{ position: 'relative', height: '100%', width: '100%' }}
                        >
                            <List
                                itemCount={this.positions.length}
                                itemData={this.positions}
                                itemSize={this.getCachedPositionHeight}
                                height={this.state.drawer_height}
                                outerElementType={is_empty ? null : ThemedScrollbarsWrapper}
                                ref={el => (this.list_ref = el)}
                                useIsScrolling
                            >
                                {this.itemRender}
                            </List>
                        </TransitionGroup>
                    )}
                </div>
            </React.Fragment>
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
                        <span className='positions-drawer__title'>{localize('Recent positions')}</span>
                        <div
                            id='dt_positions_drawer_close_icon'
                            className='positions-drawer__icon-close'
                            onClick={toggleDrawer}
                        >
                            <Icon icon='IcMinusBold' />
                        </div>
                    </div>
                    <div
                        className='positions-drawer__body'
                        ref={el => {
                            this.drawer_ref = el;
                        }}
                    >
                        {this.positions.length === 0 || error ? <EmptyPortfolioMessage error={error} /> : body_content}
                    </div>
                    <div className='positions-drawer__footer'>
                        <NavLink
                            id='dt_positions_drawer_report_button'
                            className='dc-btn dc-btn--secondary dc-btn__large'
                            to={routes.reports}
                        >
                            <span className='dc-btn__text'>{localize('Go to Reports')}</span>
                        </NavLink>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

PositionsDrawer.propTypes = {
    all_positions: MobxPropTypes.arrayOrObservableArray,
    children: PropTypes.any,
    currency: PropTypes.string,
    error: PropTypes.string,
    is_empty: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    onChangeContractUpdate: PropTypes.func,
    onClickContractUpdate: PropTypes.func,
    onClickRemove: PropTypes.func,
    onClickSell: PropTypes.func,
    onHoverPosition: PropTypes.func,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    symbol: PropTypes.string,
    toggleDrawer: PropTypes.func,
};

export default connect(({ client, common, modules, ui }) => ({
    currency: client.currency,
    all_positions: modules.portfolio.all_positions,
    error: modules.portfolio.error,
    onClickCancel: modules.portfolio.onClickCancel,
    is_empty: modules.portfolio.is_empty,
    onClickSell: modules.portfolio.onClickSell,
    onClickRemove: modules.portfolio.removePositionById,
    onHoverPosition: modules.portfolio.onHoverPosition,
    onMount: modules.portfolio.onMount,
    onUnmount: modules.portfolio.onUnmount,
    server_time: common.server_time,
    symbol: modules.trade.symbol,
    trade_contract_type: modules.trade.contract_type,
    is_mobile: ui.is_mobile,
    is_positions_drawer_on: ui.is_positions_drawer_on,
    toggleDrawer: ui.togglePositionsDrawer,
    toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
}))(PositionsDrawer);
