import * as React from 'react';
import { StoreProvider } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
// Todo: After upgrading to react 18 we should use @testing-library/react-hooks instead.
import { render, screen } from '@testing-library/react';
import useNeedAuthentication from '../useNeedAuthentication';

const UseNeedAuthenticationExample = () => {
    const is_need_authentication = useNeedAuthentication();

    return (
        <>
            <p data-testid={'dt_is_need_authentication'}>{is_need_authentication ? 'true' : 'false'}</p>
        </>
    );
};

describe('useNeedAuthentication', () => {
    test('should be false if is_authentication_needed and is_eu both are false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_authentication_needed: false,
                is_eu: false,
            },
        };

        render(<UseNeedAuthenticationExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_authentication = screen.getByTestId('dt_is_need_authentication');
        expect(is_need_authentication).toHaveTextContent('false');
    });

    test('should be false if is_authentication_needed is false and is_eu is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_authentication_needed: false,
                is_eu: true,
            },
        };

        render(<UseNeedAuthenticationExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_authentication = screen.getByTestId('dt_is_need_authentication');
        expect(is_need_authentication).toHaveTextContent('false');
    });

    test('should be false if is_authentication_needed is true and is_eu is false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_authentication_needed: true,
                is_eu: false,
            },
        };

        render(<UseNeedAuthenticationExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_authentication = screen.getByTestId('dt_is_need_authentication');
        expect(is_need_authentication).toHaveTextContent('false');
    });

    test('should be true if is_authentication_needed and is_eu both are true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_authentication_needed: true,
                is_eu: true,
            },
        };

        render(<UseNeedAuthenticationExample />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>,
        });

        const is_need_authentication = screen.getByTestId('dt_is_need_authentication');
        expect(is_need_authentication).toHaveTextContent('true');
    });
});
