import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { NavLink }                    from 'react-router-dom';
import { TransitionGroup,
    CSSTransition }                   from 'react-transition-group';
import { Icon, ThemedScrollbars }     from 'deriv-components';
import { localize }                   from 'deriv-translations';
import routes                         from 'Constants/routes';
import EmptyPortfolioMessage          from 'Modules/Reports/Components/empty-portfolio-message.jsx';
import { connect }                    from 'Stores/connect';
import { isMultiplierContract }       from 'Stores/Modules/Contract/Helpers/multiplier';
import PositionsDrawerCard            from './PositionsDrawerCard';

class PositionsDrawer extends React.Component {
    componentDidMount()    {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const {
            all_positions,
            error,
            currency,
            is_empty,
            is_multiplier,
            is_positions_drawer_on,
            onClickCancel,
            onClickSell,
            onClickRemove,
            onHoverPosition,
            symbol,
            symbol_display_name,
            toggleDrawer,
            toggleUnsupportedContractModal,
        } = this.props;

        let positions;

        if (is_multiplier) {
            positions = all_positions.filter((p) => {
                if (p.contract_info) {
                    return isMultiplierContract(p.contract_info.contract_type) && symbol === p.contract_info.underlying;
                }
                return true;
            });
        } else {
            positions = all_positions.slice(0, 5);
        }

        // Show only 5 most recent open contracts
        const body_content = (
            <React.Fragment>
                <TransitionGroup component='div'>
                    {positions.map((portfolio_position) => (
                        <CSSTransition
                            appear
                            key={portfolio_position.id}
                            in={true}
                            timeout={150}
                            classNames={{
                                appear   : 'positions-drawer-card__wrapper--enter',
                                enter    : 'positions-drawer-card__wrapper--enter',
                                enterDone: 'positions-drawer-card__wrapper--enter-done',
                                exit     : 'positions-drawer-card__wrapper--exit',
                            }}
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
                                toggleUnsupportedContractModal={toggleUnsupportedContractModal}
                                {...portfolio_position}
                            />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </React.Fragment>
        );

        return (
            <React.Fragment>
                <div className={classNames(
                    'positions-drawer__bg', {
                        'positions-drawer__bg--open': is_positions_drawer_on,
                    })}
                />
                <div
                    id='dt_positions_drawer'
                    className={classNames(
                        'positions-drawer', {
                            'positions-drawer--open': is_positions_drawer_on,
                        })}
                >
                    <div className='positions-drawer__header'>
                        <span className='positions-drawer__title'>{ is_multiplier ? localize('Multiplier options on ') + symbol_display_name :  localize('Recent Positions')}</span>
                        <div
                            id='dt_positions_drawer_close_icon'
                            className='positions-drawer__icon-close'
                            onClick={toggleDrawer}
                        >
                            <Icon icon='IcMinusBold' />
                        </div>
                    </div>
                    <div className='positions-drawer__body'>
                        <ThemedScrollbars
                            style={{ width: '100%', height: '100%' }}
                            autoHide
                        >
                            {(positions.length === 0 || error) ?
                                <EmptyPortfolioMessage error={error} />
                                :
                                body_content
                            }
                        </ThemedScrollbars>
                    </div>
                    <div className='positions-drawer__footer'>
                        <NavLink id='dt_positions_drawer_report_button' className='btn btn--secondary btn__large' to={routes.reports}>
                            <span className='btn__text'>
                                {localize('Go to Reports')}
                            </span>
                        </NavLink>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

PositionsDrawer.propTypes = {
    all_positions         : MobxPropTypes.arrayOrObservableArray,
    children              : PropTypes.any,
    currency              : PropTypes.string,
    error                 : PropTypes.string,
    is_empty              : PropTypes.bool,
    is_loading            : PropTypes.bool,
    is_multiplier         : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    onChangeContractUpdate: PropTypes.func,
    onClickContractUpdate : PropTypes.func,
    onClickRemove         : PropTypes.func,
    onClickSell           : PropTypes.func,
    onHoverPosition       : PropTypes.func,
    onMount               : PropTypes.func,
    onUnmount             : PropTypes.func,
    symbol                : PropTypes.string,
    symbol_display_name   : PropTypes.string,
    toggleDrawer          : PropTypes.func,
};

export default connect(
    ({ modules, client, ui }) => ({
        currency                      : client.currency,
        all_positions                 : modules.portfolio.all_positions,
        error                         : modules.portfolio.error,
        is_empty                      : modules.portfolio.is_empty,
        is_loading                    : modules.portfolio.is_loading,
        onClickCancel                 : modules.portfolio.onClickCancel,
        onClickSell                   : modules.portfolio.onClickSell,
        onClickRemove                 : modules.portfolio.removePositionById,
        onHoverPosition               : modules.portfolio.onHoverPosition,
        onMount                       : modules.portfolio.onMount,
        onUnmount                     : modules.portfolio.onUnmount,
        is_multiplier                 : modules.trade.is_multiplier,
        symbol                        : modules.trade.symbol,
        symbol_display_name           : modules.trade.symbol_display_name,
        is_positions_drawer_on        : ui.is_positions_drawer_on,
        toggleDrawer                  : ui.togglePositionsDrawer,
        toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
    })
)(PositionsDrawer);
