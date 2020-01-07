// import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { NavLink }                    from 'react-router-dom';
import { TransitionGroup,
    CSSTransition }                   from 'react-transition-group';
import {
    Drawer,
    Icon,
    ThemedScrollbars }                from '@deriv/components';
import { localize }                   from '@deriv/translations';
import routes                         from 'Constants/routes';
import EmptyPortfolioMessage          from 'Modules/Reports/Components/empty-portfolio-message.jsx';
import { connect }                    from 'Stores/connect';
import PositionsDrawerCard            from './positions-drawer-card.jsx';

const PositionsModal = ({
    all_positions,
    error,
    currency,
    is_empty,
    is_visible,
    onClickSell,
    onClickRemove,
    toggleDrawer,
    toggleUnsupportedContractModal,
}) => {
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
        <Drawer
            is_open={is_visible}
            toggleDrawer={toggleDrawer}
        >
            <div className='positions-drawer__bg' />
            <div
                id='dt_positions_drawer'
                className='positions-drawer'
            >
                <div className='positions-drawer__header'>
                    <span className='positions-drawer__title'>{localize('Recent Positions')}</span>
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
        </Drawer>
    );
};

PositionsModal.propTypes = {
    all_positions: MobxPropTypes.arrayOrObservableArray,
    currency     : PropTypes.string,
    error        : PropTypes.string,
    is_empty     : PropTypes.bool,
    is_loading   : PropTypes.bool,
    is_visible   : PropTypes.bool,
    onClickRemove: PropTypes.func,
    onClickSell  : PropTypes.func,
    toggleDrawer : PropTypes.func,
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
        toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
    })
)(PositionsModal);
