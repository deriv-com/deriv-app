import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import APIProvider from '@deriv/api/src/APIProvider';
import { WS } from '@deriv/shared';
import useRemovePasskey from '../useRemovePasskey';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        send: jest.fn(() => ({
            passkeys_revoke: 1,
        })),
    },
}));

describe('useRemovePasskey', () => {
    const ws_error = { message: 'Test error' };
    const mockOnSuccess = jest.fn();

    const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should remove passkey', async () => {
        const { result } = renderHook(() => useRemovePasskey({ onSuccess: mockOnSuccess }), {
            wrapper,
        });

        expect(mockOnSuccess).not.toHaveBeenCalled();

        await act(async () => {
            result.current.removePasskey(123);
        });

        expect(WS.send).toHaveBeenCalledWith({
            passkeys_revoke: 1,
            id: 123,
        });
        expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should throw passkey removing error', async () => {
        (WS.send as jest.Mock).mockRejectedValue(ws_error);

        const { result } = renderHook(() => useRemovePasskey({ onSuccess: mockOnSuccess }), { wrapper });

        expect(mockOnSuccess).not.toHaveBeenCalled();

        await act(async () => {
            result.current.removePasskey(123);
        });

        expect(WS.send).toHaveBeenCalledWith({ passkeys_revoke: 1, id: 123 });
        expect(result.current.passkey_removing_error).toBe(ws_error);
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });
});
