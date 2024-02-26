import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useResidenceSelfDeclaration from '../useResidenceSelfDeclaration';

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
    test('should return false if client residence is spain', async () => {
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
