import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import TradeModals from '../trade-modals';

jest.mock('App/Components/Elements/Modals/UnsupportedContractModal', () =>
    jest.fn(props => (
        <div>
            <div>Unsupported contract modal</div>
            <button onClick={props.onConfirm}>onConfirm unsupported</button>
            <button onClick={props.onClose}>onClose unsupported</button>
        </div>
    ))
);
jest.mock('App/Components/Elements/Modals/MarketUnavailableModal', () =>
    jest.fn(props => (
        <div>
            <div>Market unavailable modal</div>
            <button onClick={props.onConfirm}>onConfirm market</button>
            <button onClick={props.onCancel}>onCansel market</button>
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
    let mock_root_store = mockStore({});

    beforeEach(() => {
        mock_root_store = mockStore({
            modules: {
                trade: {
                    resetPreviousSymbol: jest.fn(),
                    clearPurchaseInfo: jest.fn(),
                    requestProposal: jest.fn(),
                },
            },
        });
    });

    it('should render modal', () => {
        render(<TradeModals />, {
            wrapper: ({ children }) => <TraderProviders store={mock_root_store}>{children}</TraderProviders>,
        });

        expect(screen.getByText('Unsupported contract modal')).toBeInTheDocument();
        expect(screen.getByText('Market unavailable modal')).toBeInTheDocument();
        expect(screen.getByText('Services error modal')).toBeInTheDocument();
    });
    it('should call function unsupportedContractOnConfirm if button onConfirm in UnsupportedContractModal component was clicked', () => {
        render(<TradeModals />, {
            wrapper: ({ children }) => <TraderProviders store={mock_root_store}>{children}</TraderProviders>,
        });
        userEvent.click(screen.getByText('onConfirm unsupported'));

        expect(mock_root_store.ui.toggleUnsupportedContractModal).toHaveBeenCalled();
    });
    it('should call function unsupportedContractOnClose if button onClose in UnsupportedContractModal component was clicked', () => {
        render(<TradeModals />, {
            wrapper: ({ children }) => <TraderProviders store={mock_root_store}>{children}</TraderProviders>,
        });
        userEvent.click(screen.getByText('onClose unsupported'));

        expect(mock_root_store.ui.toggleUnsupportedContractModal).toHaveBeenCalled();
    });
    it('should call function marketUnavailableOnConfirm if button onConfirm in MarketUnavailableModal component was clicked', () => {
        render(<TradeModals />, {
            wrapper: ({ children }) => <TraderProviders store={mock_root_store}>{children}</TraderProviders>,
        });
        userEvent.click(screen.getByText('onConfirm market'));

        expect(mock_root_store.ui.setHasOnlyForwardingContracts).toHaveBeenCalled();
        expect(mock_root_store.modules.trade.resetPreviousSymbol).toHaveBeenCalled();
    });
    it('should call function marketUnavailableOnCancel if button onCansel in MarketUnavailableModal component was clicked', () => {
        render(<TradeModals />, {
            wrapper: ({ children }) => <TraderProviders store={mock_root_store}>{children}</TraderProviders>,
        });
        userEvent.click(screen.getByText('onCansel market'));

        expect(mock_root_store.ui.setHasOnlyForwardingContracts).toHaveBeenCalled();
        expect(mock_root_store.modules.trade.resetPreviousSymbol).toHaveBeenCalled();
    });
    it('should call function servicesErrorModalOnConfirm if button onConfirm in ServicesErrorModal component was clicked', () => {
        render(<TradeModals />, {
            wrapper: ({ children }) => <TraderProviders store={mock_root_store}>{children}</TraderProviders>,
        });
        userEvent.click(screen.getByText('onConfirm services'));

        expect(mock_root_store.ui.toggleServicesErrorModal).toHaveBeenCalled();
        expect(mock_root_store.modules.trade.clearPurchaseInfo).not.toHaveBeenCalled();
        expect(mock_root_store.modules.trade.requestProposal).not.toHaveBeenCalled();
    });
    it('should call function servicesErrorModalOnConfirm and clearPurchaseInfo and requestProposal if button onConfirm in ServicesErrorModal component was clicked and type of services_error is equal to buy', () => {
        mock_root_store = mockStore({
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
        render(<TradeModals />, {
            wrapper: ({ children }) => <TraderProviders store={mock_root_store}>{children}</TraderProviders>,
        });
        userEvent.click(screen.getByText('onConfirm services'));

        expect(mock_root_store.ui.toggleServicesErrorModal).toHaveBeenCalled();
        expect(mock_root_store.modules.trade.clearPurchaseInfo).toHaveBeenCalled();
        expect(mock_root_store.modules.trade.requestProposal).toHaveBeenCalled();
    });
});
