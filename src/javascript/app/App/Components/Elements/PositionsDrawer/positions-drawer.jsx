import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { NavLink }           from 'react-router-dom';
import { CSSTransition }     from 'react-transition-group';
import { Scrollbars }        from 'tt-react-custom-scrollbars';
import { localize }          from '_common/localize';
import Icon                  from 'Assets/icon.jsx';
import routes                from 'Constants/routes';
import EmptyPortfolioMessage from 'Modules/Portfolio/Components/empty-portfolio-message.jsx';
import { connect }           from 'Stores/connect';
import PositionsDrawerCard   from './positions-drawer-card.jsx';

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
            active_contract_id,
            error,
            currency,
            is_contract_mode,
            is_empty,
            is_positions_drawer_on,
            onClickSell,
            onClickRemove,
            openContract,
            toggleDrawer,
            toggleUnsupportedContractModal,
        } = this.props;

        // Show only 5 most recent open contracts
        const body_content = all_positions.slice(0, 5).map((portfolio_position) => (
            <CSSTransition
                key={portfolio_position.id}
                in={!!(portfolio_position.id)}
                timeout={150}
                classNames={{
                    enter    : 'positions-drawer-card__wrapper--enter',
                    enterDone: 'positions-drawer-card__wrapper--enter-done',
                    exit     : 'positions-drawer-card__wrapper--exit',
                }}
                unmountOnExit
            >
                <PositionsDrawerCard
                    active_position={active_contract_id}
                    onClickSell={onClickSell}
                    onClickRemove={onClickRemove}
                    openContract={openContract}
                    key={portfolio_position.id}
                    currency={currency}
                    toggleUnsupportedContractModal={toggleUnsupportedContractModal}
                    {...portfolio_position}
                />
            </CSSTransition>
        ));

        return (
            <div className={classNames(
                'positions-drawer', {
                    'positions-drawer--open'         : is_positions_drawer_on,
                    'positions-drawer--contract-mode': is_contract_mode,
                })}
            >
                <div className='positions-drawer__header'>
                    <span className='positions-drawer__title'>{localize('Recent Positions')}</span>
                    <div
                        className='positions-drawer__icon-close'
                        onClick={toggleDrawer}
                    >
                        <Icon icon='IconMinimize' />
                    </div>
                </div>
                <div className='positions-drawer__body'>
                    <Scrollbars
                        style={{ width: '100%', height: '100%' }}
                        autoHide
                    >
                        {(is_empty || error) ? <EmptyPortfolioMessage error={error} />  : body_content}
                    </Scrollbars>
                </div>
                <div className='positions-drawer__footer'>
                    <NavLink className='btn btn--link btn--alternate' to={routes.reports}>
                        <span className='btn__text'>
                            {localize('Go to Reports')}
                        </span>
                    </NavLink>
                </div>
            </div>
        );
    }
}

PositionsDrawer.propTypes = {
    active_contract_id    : PropTypes.number,
    all_positions         : MobxPropTypes.arrayOrObservableArray,
    children              : PropTypes.any,
    currency              : PropTypes.string,
    error                 : PropTypes.string,
    is_contract_mode      : PropTypes.bool,
    is_empty              : PropTypes.bool,
    is_loading            : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    onClickRemove         : PropTypes.func,
    onClickSell           : PropTypes.func,
    onMount               : PropTypes.func,
    onUnmount             : PropTypes.func,
    openContract          : PropTypes.func,
    toggleDrawer          : PropTypes.func,
};

export default connect(
    ({ modules, client, ui }) => ({
        currency                      : client.currency,
        active_contract_id            : modules.contract.contract_id,
        all_positions                 : modules.portfolio.all_positions,
        error                         : modules.portfolio.error,
        is_contract_mode              : modules.smart_chart.is_contract_mode,
        is_empty                      : modules.portfolio.is_empty,
        is_loading                    : modules.portfolio.is_loading,
        onClickSell                   : modules.portfolio.onClickSell,
        onClickRemove                 : modules.portfolio.removePositionById,
        openContract                  : modules.contract.onMount,
        onMount                       : modules.portfolio.onMount,
        onUnmount                     : modules.portfolio.onUnmount,
        is_positions_drawer_on        : ui.is_positions_drawer_on,
        toggleDrawer                  : ui.togglePositionsDrawer,
        toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
    })
)(PositionsDrawer);
