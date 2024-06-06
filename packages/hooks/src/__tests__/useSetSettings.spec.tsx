import { renderHook, act } from '@testing-library/react-hooks';
import useSetSettings from '../useSetSettings';
import { WS } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            setSettings: jest.fn(),
        },
    },
}));

describe('useSetSettings', () => {
    it('should return data on successful setSettings call', async () => {
        const mockResponse = { success: true };
        (WS.authorized.setSettings as jest.Mock).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useSetSettings());

        let response;
        await act(async () => {
            response = await result.current.setSettings({ phone: '+1234567890' });
        });

        expect(WS.authorized.setSettings).toHaveBeenCalledWith({ phone: '+1234567890' });
        expect(response).toEqual(mockResponse);
    });

    it('should handle error on setSettings call', async () => {
        const mockError = { error: 'Some error' };
        (WS.authorized.setSettings as jest.Mock).mockRejectedValueOnce(mockError);

        const { result } = renderHook(() => useSetSettings());

        let error;
        await act(async () => {
            try {
                await result.current.setSettings({ phone: '+1234567890' });
            } catch (e) {
                error = e;
            }
        });

        expect(WS.authorized.setSettings).toHaveBeenCalledWith({ phone: '+1234567890' });
        expect(error).toEqual(mockError);
    });
});
