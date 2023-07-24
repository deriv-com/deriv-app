import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Icon, Div100vhContainer, Modal, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { NavLink } from 'react-router-dom';
import EmptyPortfolioMessage from '../EmptyPortfolioMessage';
import PositionsModalCard from 'App/Components/Elements/PositionsDrawer/positions-modal-card.jsx';
import { filterByContractType } from 'App/Components/Elements/PositionsDrawer/helpers';
import TogglePositions from './toggle-positions.jsx';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

const TogglePositionsMobile = observer(
    ({
        active_positions_count,
        all_positions,
        currency,
        disableApp,
        enableApp,
        error,
        is_empty,
        onClickSell,
        onClickCancel,
        toggleUnsupportedContractModal,
    }) => {
        const { portfolio, ui } = useStore();
        const { symbol, contract_type: trade_contract_type } = useTraderStore();
        const { removePositionById: onClickRemove } = portfolio;
        const { togglePositionsDrawer, is_positions_drawer_on } = ui;
        let filtered_positions = [];

        const closeModal = () => {
            filtered_positions.slice(0, 5).map(position => {
                const { contract_info } = position;
                if (contract_info?.is_sold) {
                    onClickRemove(contract_info.contract_id);
                }
            });
            togglePositionsDrawer();
        };

        filtered_positions = all_positions.filter(
            p =>
                p.contract_info &&
                symbol === p.contract_info.underlying &&
                filterByContractType(p.contract_info, trade_contract_type)
        );

        // Show only 5 most recent open contracts
        const body_content = (
            <React.Fragment>
                <TransitionGroup component='div'>
                    {filtered_positions.slice(0, 5).map(portfolio_position => (
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
                    is_open={is_positions_drawer_on}
                    togglePositions={togglePositionsDrawer}
                    positions_count={active_positions_count}
                />
                <Modal
                    is_open={is_positions_drawer_on}
                    toggleModal={closeModal}
                    id='dt_mobile_positions'
                    is_vertical_top
                    has_close_icon
                    enableApp={enableApp}
                    disableApp={disableApp}
                    width='calc(100vw - 32px)'
                >
                    <Div100vhContainer className='positions-modal' height_offset='48px'>
                        <div className='positions-modal__header'>
                            <Text size='xxxs' className='positions-modal__title'>
                                <Icon icon='IcPortfolio' className='positions-modal__title-icon' />
                                {localize('Recent positions')}
                            </Text>
                            <div className='positions-modal__close-btn' onClick={closeModal}>
                                <Icon icon='IcMinusBold' />
                            </div>
                        </div>
                        <div className='positions-modal__body'>
                            {is_empty || error ? <EmptyPortfolioMessage error={error} /> : body_content}
                        </div>
                        <div className='positions-modal__footer'>
                            <NavLink
                                onClick={closeModal}
                                className='dc-btn dc-btn--secondary dc-btn__large positions-modal__footer-btn'
                                to={routes.positions}
                            >
                                <Text size='xs' weight='bold'>
                                    {localize('Go to Reports')}
                                </Text>
                            </NavLink>
                        </div>
                    </Div100vhContainer>
                </Modal>
            </React.Fragment>
        );
    }
);

export default TogglePositionsMobile;
