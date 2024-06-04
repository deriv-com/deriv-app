import React from 'react';
import { render, screen } from '@testing-library/react';
import ClosingAccountPendingContent from '../closing-account-pending-content';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => <div>mockedIcon</div>),
}));

describe('ClosingAccountPendingContent', () => {
    const mock_props: React.ComponentProps<typeof ClosingAccountPendingContent> = {
        currency_icon: 'USD',
        value: 100,
    };
    it('should render the ClosingAccountPendingContent component', () => {
        render(<ClosingAccountPendingContent {...mock_props} />);
        expect(screen.getByText('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should render  title and loginid', () => {
        const new_props: React.ComponentProps<typeof ClosingAccountPendingContent> = {
            ...mock_props,
            title: 'mock_title',
            loginid: 'CR123',
        };
        render(<ClosingAccountPendingContent {...new_props} />);
        expect(screen.getByText('mock_title')).toBeInTheDocument();
        expect(screen.getByText('CR123')).toBeInTheDocument();
    });
});
