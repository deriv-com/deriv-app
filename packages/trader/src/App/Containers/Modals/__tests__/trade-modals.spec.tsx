import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import TraderProviders from '../../../../trader-providers';
import TradeModals from '../trade-modals';

jest.mock('App/Components/Elements/Modals/MarketUnavailableModal', () =>
    jest.fn(props => (
        <div>
            <div>Market unavailable modal</div>
            <button onClick={props.onConfirm}>onConfirm market</button>
            <button onClick={props.onCancel}>onCancel market</button>
        </div>
    ))
);
jest.mock('App/Components/Elements/Modals/ServicesErrorModal', () =>
    jest.fn(props => (
        <div>
            <div>Services error modal</div>
            <button onClick={props.onConfirm}>onConfirm services</button>
        </div>
    ))
);

window.open = jest.fn();

describe('TradeModals', () => {
    const mockTradeModals = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <TradeModals />
            </TraderProviders>
        );
    };

    it('should render modal', () => {
        const mock_root_store = mockStore({
            modules: {
                trade: {
                    resetPreviousSymbol: jest.fn(),
                    clearPurchaseInfo: jest.fn(),
                    requestProposal: jest.fn(),
                },
            },
        });

        render(mockTradeModals(mock_root_store));

        expect(screen.getByText('Market unavailable modal')).toBeInTheDocument();
        expect(screen.getByText('Services error modal')).toBeInTheDocument();
    });
    it('should call function marketUnavailableOnConfirm if button onConfirm in MarketUnavailableModal component was clicked', () => {
        const mock_root_store = mockStore({
            modules: {
                trade: {
                    resetPreviousSymbol: jest.fn(),
                    clearPurchaseInfo: jest.fn(),
                    requestProposal: jest.fn(),
                },
            },
        });

        render(mockTradeModals(mock_root_store));
        userEvent.click(screen.getByText('onConfirm market'));

        expect(mock_root_store.ui.setHasOnlyForwardingContracts).toHaveBeenCalled();
        expect(mock_root_store.modules.trade.resetPreviousSymbol).toHaveBeenCalled();
    });
    it('should call function marketUnavailableOnCancel if button onCancel in MarketUnavailableModal component was clicked', () => {
        const mock_root_store = mockStore({
            modules: {
                trade: {
                    resetPreviousSymbol: jest.fn(),
                    clearPurchaseInfo: jest.fn(),
                    requestProposal: jest.fn(),
                },
            },
        });

        render(mockTradeModals(mock_root_store));
        userEvent.click(screen.getByText('onCancel market'));

        expect(mock_root_store.ui.setHasOnlyForwardingContracts).toHaveBeenCalled();
        expect(mock_root_store.modules.trade.resetPreviousSymbol).toHaveBeenCalled();
    });
    it('should call function servicesErrorModalOnConfirm if button onConfirm in ServicesErrorModal component was clicked', () => {
        const mock_root_store = mockStore({
            modules: {
                trade: {
                    resetPreviousSymbol: jest.fn(),
                    clearPurchaseInfo: jest.fn(),
                    requestProposal: jest.fn(),
                },
            },
        });

        render(mockTradeModals(mock_root_store));
        userEvent.click(screen.getByText('onConfirm services'));

        expect(mock_root_store.ui.toggleServicesErrorModal).toHaveBeenCalled();
        expect(mock_root_store.modules.trade.clearPurchaseInfo).not.toHaveBeenCalled();
        expect(mock_root_store.modules.trade.requestProposal).not.toHaveBeenCalled();
    });
    it('should call function servicesErrorModalOnConfirm and clearPurchaseInfo and requestProposal if button onConfirm in ServicesErrorModal component was clicked and type of services_error is equal to buy', () => {
        const mock_root_store = mockStore({
            modules: {
                trade: {
                    resetPreviousSymbol: jest.fn(),
                    clearPurchaseInfo: jest.fn(),
                    requestProposal: jest.fn(),
                },
            },
            common: {
                services_error: {
                    code: 'test',
                    message: 'test',
                    type: 'buy',
                },
            },
        });

        render(mockTradeModals(mock_root_store));
        userEvent.click(screen.getByText('onConfirm services'));

        expect(mock_root_store.ui.toggleServicesErrorModal).toHaveBeenCalled();
        expect(mock_root_store.modules.trade.clearPurchaseInfo).toHaveBeenCalled();
        expect(mock_root_store.modules.trade.requestProposal).toHaveBeenCalled();
    });
});
