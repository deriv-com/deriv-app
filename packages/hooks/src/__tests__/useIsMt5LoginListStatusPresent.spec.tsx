import { renderHook } from '@testing-library/react-hooks';
import useIsMt5LoginListStatusPresent from '../useIsMt5LoginListStatusPresent';

const mock_login_id = 'MOCK_LOGIN_ID';
const mock_landing_company_short_code = 'MOCK_LANDING_COMPANY_SHORT_CODE';
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMT5AccountsList: jest.fn(() => ({
        data: [{ login: mock_login_id, landing_company_short: mock_landing_company_short_code }],
    })),
}));

describe('useIsMt5LoginListStatusPresent', () => {
    it('should return true when the given status is present for the given login id', () => {
        const { flag_value, is_flag_present } = renderHook(() =>
            useIsMt5LoginListStatusPresent('landing_company_short', mock_login_id)
        ).result.current;

        expect(is_flag_present).toBeTruthy();
        expect(flag_value).toEqual(mock_landing_company_short_code);
    });

    it('should return false when the given status is not present for the given login id', () => {
        const { flag_value, is_flag_present } = renderHook(() =>
            useIsMt5LoginListStatusPresent('balance', mock_login_id)
        ).result.current;
        expect(is_flag_present).toBeFalsy();
        expect(flag_value).toEqual(undefined);
    });

    it('should return false when the given login id is empty', () => {
        const { flag_value, is_flag_present } = renderHook(() => useIsMt5LoginListStatusPresent('account_type', ''))
            .result.current;
        expect(is_flag_present).toBeFalsy();
        expect(flag_value).toEqual(undefined);
    });
});
