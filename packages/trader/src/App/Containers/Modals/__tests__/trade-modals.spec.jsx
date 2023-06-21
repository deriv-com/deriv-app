import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import TradeModals from '../trade-modals';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    const Modal = jest.fn(() => <div data-testid='modal'>test</div>);
    Modal.Body = jest.fn(() => <div>test</div>);
    Modal.Footer = jest.fn(() => <div>test</div>);
    return {
        ...original_module,
        Icon: jest.fn(({ icon, onClick }) => <div onClick={onClick}>{icon}</div>),
        Modal,
    };
});

describe('TradeModals', () => {
    it('should render modal', () => {
        const mock_root_store = {
            modules: {
                ui: { has_only_forward_starting_contracts: true, is_services_error_visible: true },
                trade: {
                    resetPreviousSymbol: jest.fn(),
                    clearPurchaseInfo: jest.fn(),
                    requestProposal: jest.fn(),
                },
                common: {
                    services_error: { code: 'test', message: 'test', type: 'test' },
                },
            },
        };

        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
        // const modal_root_el = document.createElement('div');
        // modal_root_el.setAttribute('id', 'modal_root');
        // document.body.appendChild(modal_root_el);

        render(<TradeModals />, {
            wrapper: ({ children }) => <TraderProviders store={mockStore(mock_root_store)}>{children}</TraderProviders>,
        });

        expect(screen.getByText(/test/i)).toBeInTheDocument();
    });
});
