import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import APIProvider from '@deriv/api/src/APIProvider';
import { WS } from '@deriv/shared';
import useRenamePasskey from '../useRenamePasskey';

const mockInvalidate = jest.fn();
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useInvalidateQuery: jest.fn(() => mockInvalidate),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        send: jest.fn(),
    },
}));

describe('useRenamePasskey', () => {
    const ws_error = { message: 'Test error' };
    const test_passkey_data = {
        id: 123,
        name: 'test name',
    };

    const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

    it('should rename passkey', async () => {
        (WS.send as jest.Mock).mockResolvedValue({ passkeys_rename: 1 });

        const { result } = renderHook(() => useRenamePasskey(), { wrapper });

        expect(result.current.is_passkey_renamed).toBe(false);

        await act(async () => {
            await result.current.renamePasskey(test_passkey_data.id, test_passkey_data.name);
        });

        expect(WS.send).toHaveBeenCalledWith({ passkeys_rename: 1, ...test_passkey_data });
        expect(mockInvalidate).toHaveBeenCalled();
        expect(result.current.is_passkey_renamed).toBe(true);
    });

    it('should handle passkey registration error', async () => {
        (WS.send as jest.Mock).mockRejectedValue(ws_error);

        const { result } = renderHook(() => useRenamePasskey(), { wrapper });

        await act(async () => {
            await result.current.renamePasskey(test_passkey_data.id, test_passkey_data.name);
        });

        expect(WS.send).toHaveBeenCalledWith({ passkeys_rename: 1, ...test_passkey_data });
        expect(result.current.passkey_renaming_error).toBe(ws_error);
        expect(result.current.is_passkey_renamed).toBe(false);
    });
});
