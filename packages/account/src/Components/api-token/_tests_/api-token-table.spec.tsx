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

    let expectedTexts = [''];

    beforeEach(() => {
        expectedTexts = [
            'Name',
            'Token',
            'Scopes',
            'Token 1',
            'Read',
            'Trade',
            'Payments',
            'Admin',
            'Trading information',
            'Write',
            '28/07/2023',
        ];
    });

    it('should render ApiTokenTable', () => {
        expectedTexts.push('Last used');
        render(
            <ApiTokenContext.Provider value={mock_props}>
                <ApiTokenTable />
            </ApiTokenContext.Provider>
        );
        expect(screen.getByText('Token 1')).not.toHaveClass('da-api-token__scope-item--name');
        expectedTexts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it('should render in mobile view', () => {
        expectedTexts.push('Last Used');
        (isMobile as jest.Mock).mockImplementationOnce(() => true);
        render(
            <ApiTokenContext.Provider value={mock_props}>
                <ApiTokenTable />
            </ApiTokenContext.Provider>
        );
        expect(screen.getByText('Token 1')).toHaveClass('da-api-token__scope-item--name');
        expectedTexts.forEach(text => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
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
