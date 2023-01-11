import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FundsProtection from '../funds-protection';
import { StoreProvider } from '@deriv/stores';
import { TRootStore } from 'Types';

const mockRootStore: DeepPartial<TRootStore> = {
    modules: {
        cashier: {
            deposit: { submitFundsProtection: jest.fn() },
        },
    },
};

describe('FundsProtection component tests', () => {
    it('should render the component', () => {
        render(<FundsProtection />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Funds protection level')).toBeInTheDocument();
        expect(screen.getByText('Deposit now')).toBeInTheDocument();
    });

    it('onClick function should be triggered', () => {
        render(<FundsProtection />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        const btn = screen.getByRole('button');
        fireEvent.click(btn);

        expect(mockRootStore.modules?.cashier?.deposit?.submitFundsProtection).toHaveBeenCalledTimes(1);
    });
});
