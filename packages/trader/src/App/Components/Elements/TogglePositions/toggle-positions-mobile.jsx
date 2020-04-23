import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Icon, Div100vhContainer, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import routes from 'Constants/routes';
import { BinaryLink } from 'App/Components/Routes';
import EmptyPortfolioMessage from 'Modules/Reports/Components/empty-portfolio-message.jsx';
import PositionsModalCard from 'App/Components/Elements/PositionsDrawer/positions-modal-card.jsx';
import TogglePositions from './toggle-positions.jsx';

const TogglePositionsMobile = ({
    active_positions_count,
    all_positions,
    disableApp,
    enableApp,
    error,
    currency,
    is_empty,
    is_positions_drawer_on,
    onClickSell,
    onClickRemove,
    togglePositionsDrawer,
    toggleUnsupportedContractModal,
    server_time,
}) => {
    // Show only 5 most recent open contracts
    const body_content = (
        <React.Fragment>
            <TransitionGroup component='div'>
                {all_positions.slice(0, 5).map(portfolio_position => (
                    <CSSTransition
                        appear
                        key={portfolio_position.id}
                        in={true}
                        timeout={150}
                        classNames={{
                            appear: 'positions-drawer-card__wrapper--enter',
                            enter: 'positions-drawer-card__wrapper--enter',
                            enterDone: 'positions-drawer-card__wrapper--enter-done',
                            exit: 'positions-drawer-card__wrapper--exit',
                        }}
                        unmountOnExit
                    >
                        <PositionsModalCard
                            onClickSell={onClickSell}
                            onClickRemove={onClickRemove}
                            key={portfolio_position.id}
                            currency={currency}
                            toggleUnsupportedContractModal={toggleUnsupportedContractModal}
                            togglePositions={togglePositionsDrawer}
                            {...portfolio_position}
                            server_time={server_time}
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
                toggleModal={togglePositionsDrawer}
                id='dt_mobile_positions'
                is_vertical_top
                has_close_icon
                enableApp={enableApp}
                disableApp={disableApp}
                width='calc(100vw - 32px)'
            >
                <Div100vhContainer className='positions-modal' height_offset='48px'>
                    <div className='positions-modal__header'>
                        <span className='positions-modal__title'>
                            <Icon icon='IcPortfolio' className='positions-modal__title-icon' />
                            {localize('Recent Positions')}
                        </span>
                        <div className='positions-modal__close-btn' onClick={togglePositionsDrawer}>
                            <Icon icon='IcMinusBold' />
                        </div>
                    </div>
                    <div className='positions-modal__body'>
                        {is_empty || error ? <EmptyPortfolioMessage error={error} /> : body_content}
                    </div>
                    <div className='positions-modal__footer'>
                        <BinaryLink
                            onClick={togglePositionsDrawer}
                            className='dc-btn dc-btn--secondary dc-btn__large positions-modal__footer-btn'
                            to={routes.positions}
                        >
                            <span className='dc-btn__text'>{localize('View more')}</span>
                        </BinaryLink>
                    </div>
                </Div100vhContainer>
            </Modal>
        </React.Fragment>
    );
};

export default TogglePositionsMobile;
