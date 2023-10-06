import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountInfoWrapper from '../account-info-wrapper';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Popover: jest.fn(({ children }) => <div>Popover: {children}</div>),
}));

describe('AccountInfoWrapper component', () => {
    it('should render children when is_disabled and disabled_message are undefined', () => {
        render(<AccountInfoWrapper>children</AccountInfoWrapper>);
        expect(screen.queryByText(/children/i)).toBeInTheDocument();
        expect(screen.queryByText(/Popover: children/i)).not.toBeInTheDocument();
    });

    it('should render children when is_disabled = true and disabled_message is undefined', () => {
        render(<AccountInfoWrapper is_disabled={true}>children</AccountInfoWrapper>);
        expect(screen.queryByText(/children/i)).toBeInTheDocument();
        expect(screen.queryByText(/Popover: children/i)).not.toBeInTheDocument();
    });

    it('should render children when is_disabled = false and disabled_message is test', () => {
        render(
            <AccountInfoWrapper is_disabled={false} disabled_message='test'>
                children
            </AccountInfoWrapper>
        );
        expect(screen.queryByText(/children/i)).toBeInTheDocument();
        expect(screen.queryByText(/Popover: children/i)).not.toBeInTheDocument();
    });

    it('should render children inside of Popover when is_disabled = true and disabled_message is test', () => {
        render(
            <AccountInfoWrapper is_disabled={true} disabled_message='test'>
                children
            </AccountInfoWrapper>
        );
        expect(screen.queryByText(/Popover: children/i)).toBeInTheDocument();
    });
});
