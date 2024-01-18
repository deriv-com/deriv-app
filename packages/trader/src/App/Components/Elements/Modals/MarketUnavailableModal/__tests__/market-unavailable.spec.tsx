import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import MarketUnavailableModal from '../market-unavailable';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../trader-providers';

const mock_props = {
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
};

describe('MarketUnavailableModal', () => {
    it('should render modal component', () => {
        const mock_root_store = mockStore({ ui: { has_only_forward_starting_contracts: true } });

        (ReactDOM.createPortal as jest.Mock) = jest.fn(component => {
            return component;
        });

        render(<MarketUnavailableModal {...mock_props} />, {
            wrapper: ({ children }) => <TraderProviders store={mock_root_store}>{children}</TraderProviders>,
        });

        expect(screen.getByText(/This market is not yet/i)).toBeInTheDocument();
    });
});
