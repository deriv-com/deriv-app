import { renderHook, act } from '@testing-library/react-hooks';
import useIsLiveChatWidgetAvailable from '../useIsLiveChatWidgetAvailable';
import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';

window.LiveChatWidget = {
    on: jest.fn(),
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
};

window.fcWidget = {
    user: {
        setProperties: jest.fn(),
        getUUID: jest.fn(),
    },
    show: jest.fn(),
    hide: jest.fn(),
    open: jest.fn(),
    destroy: jest.fn(),
    close: jest.fn(),
    on: jest.fn(),
    setConfig: jest.fn(),
    isLoaded: jest.fn(),
    authenticate: jest.fn(),
};

jest.mock('../useGrowthbookGetFeatureValue');

describe('useIsLiveChatWidgetAvailable', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    it('should return initial state correctly', () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false, true]);
        const { result } = renderHook(() => useIsLiveChatWidgetAvailable());

        expect(result.current.is_livechat_available).toBe(false);
    });

    it('should update state when LiveChatWidget.on is triggered', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false, true]);
        const { result } = renderHook(() => useIsLiveChatWidgetAvailable());

        act(() => {
            const callback = (window.LiveChatWidget.on as jest.Mock).mock.calls[0][1];
            callback({ state: { availability: 'online' } });
        });

        expect(result.current.is_livechat_available).toBe(true);
    });

    it('should update state when FF is true', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true, true]);
        const { result } = renderHook(() => useIsLiveChatWidgetAvailable());

        act(() => {
            const callback = (window.fcWidget.on as jest.Mock).mock.calls[0][1];
            callback();
        });

        expect(result.current.is_livechat_available).toBe(true);
    });
});
