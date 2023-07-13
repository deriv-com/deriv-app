import React from 'react';
import { render, screen } from '@testing-library/react';
import { APIProvider } from '@deriv/api';
import FundsProtection from '../funds-protection';

describe('FundsProtection component tests', () => {
    it('should render the component', () => {
        render(<FundsProtection />, {
            wrapper: ({ children }) => <APIProvider>{children}</APIProvider>,
        });

        expect(screen.getByText('Funds protection level')).toBeInTheDocument();
        expect(screen.getByText('Deposit now')).toBeInTheDocument();
    });
});
