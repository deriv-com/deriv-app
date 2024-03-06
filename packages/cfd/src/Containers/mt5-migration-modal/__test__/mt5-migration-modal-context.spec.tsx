import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { MT5MigrationModalContext, useMT5MigrationModalContext } from '../mt5-migration-modal-context';

describe('useMT5MigrationModalContext', () => {
    it('should return default context values', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <MT5MigrationModalContext.Provider
                value={{
                    show_modal_front_side: false,
                    setShowModalFrontSide: () => null,
                }}
            >
                {children}
            </MT5MigrationModalContext.Provider>
        );
        const { result } = renderHook(() => useMT5MigrationModalContext(), { wrapper });

        expect(result.current.show_modal_front_side).toBe(false);
        expect(typeof result.current.setShowModalFrontSide).toBe('function');
    });

    it('should update context values', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <MT5MigrationModalContext.Provider
                value={{
                    show_modal_front_side: true,
                    setShowModalFrontSide: () => null,
                }}
            >
                {children}
            </MT5MigrationModalContext.Provider>
        );
        const { result } = renderHook(() => useMT5MigrationModalContext(), { wrapper });

        result.current.setShowModalFrontSide(true);

        expect(result.current.show_modal_front_side).toBe(true);
    });
});
