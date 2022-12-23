import * as React from 'react';
// Todo: After upgrading to react 18 we should use @testing-library/react-hooks instead.
import { render, screen } from '@testing-library/react';
import { StoreProvider, useStore } from '../useStore';
import { TRootStore } from '../../types';

const UseStoreExample = () => {
    const store = useStore();

    return (
        <>
            <p data-testid={'dt_email'}>{store.client.email}</p>
            <p data-testid={'dt_is_dark_mode_on'}>{store.ui.is_dark_mode_on ? 'true' : 'false'}</p>
        </>
    );
};

describe('useStore', () => {
    test('should throw an error if StoreContext has not been provided', async () => {
        expect(() => render(<UseStoreExample />)).toThrowError('useStore must be used within StoreContext');
    });

    test('should be able to access store data if StoreContext has been provided', async () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            client: {
                email: 'john@company.com',
            },
            ui: {
                is_dark_mode_on: true,
            },
        };

        render(<UseStoreExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TRootStore}>{children}</StoreProvider>,
        });

        const email = screen.getByTestId('dt_email');
        const is_dark_mode_on = screen.getByTestId('dt_is_dark_mode_on');
        expect(email).toHaveTextContent('john@company.com');
        expect(is_dark_mode_on).toHaveTextContent('true');
    });
});
