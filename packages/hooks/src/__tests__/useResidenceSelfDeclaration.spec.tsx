import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useResidenceSelfDeclaration from '../useResidenceSelfDeclaration';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useResidenceList: jest.fn(() => ({
        data: [
            {
                value: 'es',
                account_opening_signup_declaration_required: true,
            },
            {
                value: 'id',
                account_opening_signup_declaration_required: false,
            },
        ],
    })),
}));

describe('useResidenceSelfDeclaration', () => {
    test('should return true if client residence is spain', async () => {
        const mock = mockStore({
            client: {
                residence: 'es',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useResidenceSelfDeclaration(), { wrapper });
        expect(result.current.is_residence_self_declaration_required).toBe(true);
    });

    test('should return false if client residence is not spain', async () => {
        const mock = mockStore({
            client: {
                residence: 'id',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useResidenceSelfDeclaration(), { wrapper });
        expect(result.current.is_residence_self_declaration_required).toBe(false);
    });
});
