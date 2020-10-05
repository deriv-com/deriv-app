import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Icon, Div100vhContainer, Modal } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { BinaryLink } from 'App/Components/Routes';
import EmptyPortfolioMessage from 'Modules/Reports/Components/empty-portfolio-message.jsx';
import PositionsModalCard from 'App/Components/Elements/PositionsDrawer/positions-modal-card.jsx';
import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers';
import { connect } from 'Stores/connect';
import TogglePositions from './toggle-positions.jsx';

class TogglePositionsMobile extends React.Component {
    filtered_positions = [];

    closeModal = () => {
        const { togglePositionsDrawer, onClickRemove } = this.props;

        this.filtered_positions.slice(0, 5).map(position => {
            const { contract_info } = position;
            if (contract_info?.is_sold) {
                onClickRemove(contract_info.contract_id);
            }
        });
        togglePositionsDrawer();
    };

    render() {
        const {
            all_positions,
            error,
            currency,
            is_empty,
            onClickSell,
            onClickRemove,
            onClickCancel,
            symbol,
            togglePositionsDrawer,
            toggleUnsupportedContractModal,
            trade_contract_type,
        } = this.props;

        this.filtered_positions = all_positions.filter(
            p =>
                p.contract_info &&
                symbol === p.contract_info.underlying &&
                filterByContractType(p.contract_info, trade_contract_type)
        );

        // Show only 5 most recent open contracts
        const body_content = (
            <React.Fragment>
                <TransitionGroup component='div'>
                    {this.filtered_positions.slice(0, 5).map(portfolio_position => (
                        <CSSTransition
                            appear
                            key={portfolio_position.id}
                            in={true}
                            timeout={150}
                            classNames={{
                                appear: 'dc-contract-card__wrapper--enter',
                                enter: 'dc-contract-card__wrapper--enter',
                                enterDone: 'dc-contract-card__wrapper--enter-done',
                                exit: 'dc-contract-card__wrapper--exit',
                            }}
                            unmountOnExit
                        >
                            <PositionsModalCard
                                onClickSell={onClickSell}
                                onClickCancel={onClickCancel}
                                onClickRemove={onClickRemove}
                                key={portfolio_position.id}
                                currency={currency}
                                toggleUnsupportedContractModal={toggleUnsupportedContractModal}
                                togglePositions={togglePositionsDrawer}
                                {...portfolio_position}
                            />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </React.Fragment>
        );

        return (
            <React.Fragment>
                <TogglePositions
                    is_open={this.props.is_positions_drawer_on}
                    togglePositions={this.props.togglePositionsDrawer}
                    positions_count={this.props.active_positions_count}
                />
                <Modal
                    is_open={this.props.is_positions_drawer_on}
                    toggleModal={this.closeModal}
                    id='dt_mobile_positions'
                    is_vertical_top
                    has_close_icon
                    enableApp={this.props.enableApp}
                    disableApp={this.props.disableApp}
                    width='calc(100vw - 32px)'
                >
                    <Div100vhContainer className='positions-modal' height_offset='48px'>
                        <div className='positions-modal__header'>
                            <span className='positions-modal__title'>
                                <Icon icon='IcPortfolio' className='positions-modal__title-icon' />
                                {localize('Recent positions')}
                            </span>
                            <div className='positions-modal__close-btn' onClick={this.closeModal}>
                                <Icon icon='IcMinusBold' />
                            </div>
                        </div>
                        <div className='positions-modal__body'>
                            {is_empty || error ? <EmptyPortfolioMessage error={error} /> : body_content}
                        </div>
                        <div className='positions-modal__footer'>
                            <BinaryLink
                                onClick={this.closeModal}
                                className='dc-btn dc-btn--secondary dc-btn__large positions-modal__footer-btn'
                                to={routes.positions}
                            >
                                <span className='dc-btn__text'>{localize('Go to Reports')}</span>
                            </BinaryLink>
                        </div>
                    </Div100vhContainer>
                </Modal>
            </React.Fragment>
        );
    }
}
// TODO: Needs to be connected to store due to issue with trade-header-extensions not updating all_positions prop
// Fixes issue with positions not updated in positions modal
export default connect(({ modules, ui }) => ({
    symbol: modules.trade.symbol,
    trade_contract_type: modules.trade.contract_type,
    onClickRemove: modules.portfolio.removePositionById,
    togglePositionsDrawer: ui.togglePositionsDrawer,
    is_positions_drawer_on: ui.is_positions_drawer_on,
}))(TogglePositionsMobile);
