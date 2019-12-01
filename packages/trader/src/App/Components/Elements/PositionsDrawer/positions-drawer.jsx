import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { NavLink }                    from 'react-router-dom';
import { TransitionGroup,
    CSSTransition }                   from 'react-transition-group';
import { ThemedScrollbars }           from 'deriv-components';
import { localize }                   from 'deriv-translations';
import Icon                           from 'Assets/icon.jsx';
import routes                         from 'Constants/routes';
import EmptyPortfolioMessage          from 'Modules/Reports/Components/empty-portfolio-message.jsx';
import { connect }                    from 'Stores/connect';
import PositionsDrawerCard            from './positions-drawer-card.jsx';

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
            is_positions_drawer_on,
            onClickSell,
            onClickRemove,
            toggleDrawer,
            toggleUnsupportedContractModal,
        } = this.props;

        // Show only 5 most recent open contracts
        const body_content = (
            <React.Fragment>
                <TransitionGroup component='div'>
                    {all_positions.slice(0, 5).map((portfolio_position) => (
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
                                onClickSell={onClickSell}
                                onClickRemove={onClickRemove}
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
                        <span className='positions-drawer__title'>{localize('Recent Positions')}</span>
                        <div
                            id='dt_positions_drawer_close_icon'
                            className='positions-drawer__icon-close'
                            onClick={toggleDrawer}
                        >
                            <Icon icon='IconMinimize' />
                        </div>
                    </div>
                    <div className='positions-drawer__body'>
                        <ThemedScrollbars
                            style={{ width: '100%', height: '100%' }}
                            autoHide
                        >
                            {(is_empty || error) ? <EmptyPortfolioMessage error={error} />  : body_content}
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
    is_positions_drawer_on: PropTypes.bool,
    onClickRemove         : PropTypes.func,
    onClickSell           : PropTypes.func,
    onMount               : PropTypes.func,
    onUnmount             : PropTypes.func,
    toggleDrawer          : PropTypes.func,
};

export default connect(
    ({ modules, client, ui }) => ({
        currency                      : client.currency,
        all_positions                 : modules.portfolio.all_positions,
        error                         : modules.portfolio.error,
        is_empty                      : modules.portfolio.is_empty,
        is_loading                    : modules.portfolio.is_loading,
        onClickSell                   : modules.portfolio.onClickSell,
        onClickRemove                 : modules.portfolio.removePositionById,
        onMount                       : modules.portfolio.onMount,
        onUnmount                     : modules.portfolio.onUnmount,
        is_positions_drawer_on        : ui.is_positions_drawer_on,
        toggleDrawer                  : ui.togglePositionsDrawer,
        toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
    })
)(PositionsDrawer);
