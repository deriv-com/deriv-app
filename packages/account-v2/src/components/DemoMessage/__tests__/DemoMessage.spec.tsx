import React from 'react';
import { useAuthorize } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import { DemoMessage } from '../DemoMessage';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useAuthorize: jest.fn(() => ({
        data: {
            account_list: [
                {
                    is_virtual: 0,
                },
            ],
        },
    })),
}));

describe('DemoMessage', () => {
    it('renders the demo message button if any real account', () => {
        render(<DemoMessage />);
        expect(screen.getByText('Switch to real account')).toBeInTheDocument();
    });

    it('renders the demo message button if no real account', () => {
        (useAuthorize as jest.Mock).mockImplementation(() => ({
            data: {
                account_list: [
                    {
                        is_virtual: 1,
                    },
                ],
            },
        }));
        render(<DemoMessage />);
        expect(screen.getByText('Add a real account')).toBeInTheDocument();
    });
});
