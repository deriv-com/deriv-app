import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from '@deriv/api';
import useAuthorize from '../useAuthorize';
import useGetPasskeysList from '../useGetPasskeysList';

jest.mock('@deriv/api', () => ({
    useQuery: jest.fn(),
}));

jest.mock('../useAuthorize', () => jest.fn());

describe('useGetPasskeysList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls useQuery with the correct arguments when isSuccess is true', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useQuery as jest.Mock).mockReturnValue({ data: { passkeys_list: [] } });

        const { result } = renderHook(() => useGetPasskeysList(true));

        expect(useQuery).toHaveBeenCalledWith('passkeys_list', { options: { enabled: true } });
        expect(result.current.passkeys_list).toEqual([]);
    });
    it('calls useQuery with enabled set to false when isSuccess is false', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: false });
        (useQuery as jest.Mock).mockReturnValue({ data: { passkeys_list: undefined } });

        const { result } = renderHook(() => useGetPasskeysList(true));

        expect(useQuery).toHaveBeenCalledWith('passkeys_list', { options: { enabled: false } });
        expect(result.current.passkeys_list).toEqual(undefined);
    });
    it('does not call useQuery with false parameter and when isSuccess is true', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useQuery as jest.Mock).mockReturnValue({ data: { passkeys_list: undefined } });

        const { result } = renderHook(() => useGetPasskeysList(false));

        expect(useQuery).toHaveBeenCalledWith('passkeys_list', { options: { enabled: false } });
        expect(result.current.passkeys_list).toEqual(undefined);
    });
});
