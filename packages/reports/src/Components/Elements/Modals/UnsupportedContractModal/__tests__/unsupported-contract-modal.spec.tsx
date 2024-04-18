import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import UnsupportedContractModal from '../unsupported-contract-modal';
import { mockStore } from '@deriv/stores';
import ReportsProviders from '../../../../../reports-providers';

const mock_props = {
    onClose: jest.fn(),
    onConfirm: jest.fn(),
};

describe('UnsupportedContractModal', () => {
    it('should render modal component', () => {
        const mock_root_store = mockStore({ ui: { is_unsupported_contract_modal_visible: true } });

        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => {
            return component;
        });

        render(<UnsupportedContractModal {...mock_props} />, {
            wrapper: ({ children }) => <ReportsProviders store={mock_root_store}>{children}</ReportsProviders>,
        });

        expect(screen.getByText(/You’ve selected a trade type that is currently unsupported/i)).toBeInTheDocument();
        expect(screen.getByText(/Go to Deriv.com/i)).toBeInTheDocument();
    });
});
