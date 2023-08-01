import React from 'react';
import { screen, render } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import ApiTokenContext from '../api-token-context';
import ApiTokenTable from '../api-token-table';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

describe('ApiTokenTable', () => {
    const mock_props = {
        api_tokens: [
            {
                display_name: 'Token 1',
                token: 'token_1',
                scopes: ['read', 'trade', 'payments', 'admin', 'trading_information', 'write'],
                last_used: '2023-07-28T12:00:00Z',
            },
        ],
        deleteToken: jest.fn(),
        footer_ref: document.createElement('div'),
        overlay_ref: document.createElement('div'),
        toggleOverlay: jest.fn(),
    };

    it('should render ApiTokenTable', () => {
        render(
            <ApiTokenContext.Provider value={mock_props}>
                <ApiTokenTable />
            </ApiTokenContext.Provider>
        );
        expect(screen.queryByTestId('dt_mobile_api_token_scope')).not.toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Token')).toBeInTheDocument();
        expect(screen.getByText('Scopes')).toBeInTheDocument();
        expect(screen.getByText('Last used')).toBeInTheDocument();
        expect(screen.getByText('Token 1')).toBeInTheDocument();
        expect(screen.getByText('Read')).toBeInTheDocument();
        expect(screen.getByText('Trade')).toBeInTheDocument();
        expect(screen.getByText('Payments')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('Trading information')).toBeInTheDocument();
        expect(screen.getByText('Write')).toBeInTheDocument();
        expect(screen.getByText('28/07/2023')).toBeInTheDocument();
    });

    it('should render in mobile view', () => {
        (isMobile as jest.Mock).mockImplementationOnce(() => true);
        render(
            <ApiTokenContext.Provider value={mock_props}>
                <ApiTokenTable />
            </ApiTokenContext.Provider>
        );
        expect(screen.getByTestId('dt_mobile_api_token_scope')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Token 1')).toBeInTheDocument();
        expect(screen.getByText('Token')).toBeInTheDocument();
        expect(screen.getByText('Scopes')).toBeInTheDocument();
        expect(screen.getByText('Read')).toBeInTheDocument();
        expect(screen.getByText('Trade')).toBeInTheDocument();
        expect(screen.getByText('Payments')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('Trading information')).toBeInTheDocument();
        expect(screen.getByText('Write')).toBeInTheDocument();
        expect(screen.getByText('Last Used')).toBeInTheDocument();
        expect(screen.getByText('28/07/2023')).toBeInTheDocument();
    });

    it('should display Never if last_used is undefined', () => {
        mock_props.api_tokens = [
            {
                display_name: 'Token 1',
                token: 'token_1',
                scopes: ['read', 'trade', 'payments', 'admin', 'trading_information', 'write'],
                last_used: '',
            },
        ];
        render(
            <ApiTokenContext.Provider value={mock_props}>
                <ApiTokenTable />
            </ApiTokenContext.Provider>
        );
        expect(screen.getByText('Never')).toBeInTheDocument();
    });
});
