import { renderHook } from '@testing-library/react-hooks';
import useIsMt5LoginListStatusPresent from '../useIsMt5LoginListStatusPresent';

const mock_login_id = 'MOCK_LOGIN_ID';
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMT5LoginList: jest.fn(() => ({
        data: [{ login: mock_login_id, open_order_position_status: true }],
    })),
}));

describe('useIsMt5LoginListStatusPresent', () => {
    it('should return true when the given status is present for the given login id', () => {
        const { result } = renderHook(() =>
            useIsMt5LoginListStatusPresent(mock_login_id, 'open_order_position_status')
        );
        expect(result.current).toBeTruthy();
    });

    it('should return false when the given status is not present for the given login id', () => {
        const { result } = renderHook(() => useIsMt5LoginListStatusPresent(mock_login_id, 'leverage'));
        expect(result.current).toBeFalsy();
    });

    it('should return false when the given login id is empty', () => {
        const { result } = renderHook(() => useIsMt5LoginListStatusPresent('', 'open_order_position_status'));
        expect(result.current).toBeFalsy();
    });

    it('should return false when the given status is empty', () => {
        const { result } = renderHook(() => useIsMt5LoginListStatusPresent(mock_login_id, ''));
        expect(result.current).toBeFalsy();
    });
});
