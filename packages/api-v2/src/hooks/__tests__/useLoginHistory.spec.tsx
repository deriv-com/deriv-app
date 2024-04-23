import { renderHook } from '@testing-library/react-hooks';
import useLoginHistory from '../useLoginHistory';
import useQuery from '../../useQuery';
import useAuthorize from '../useAuthorize';

jest.mock('../../useQuery');
jest.mock('../useAuthorize');
describe('useLoginHistory', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    const mockResponse = {
        data: {
            login_history: [
                {
                    action: 'logedewin',
                    environment:
                        '2-Apr-24 05:18:38GMT IP=94.201.147.222 IP_COUNTRY=AE User_AGENT=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 LANG=EN',
                    status: 1,
                    time: 712035118,
                },
            ],
        },
    };
    const limitValue = 25;

    it('should return login history data when authorized', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useQuery as jest.Mock).mockReturnValueOnce(mockResponse);
        const { result } = renderHook(() => useLoginHistory(limitValue));
        expect(result.current.loginHistory).toEqual(mockResponse.data.login_history);
    });

    it('should call the hook with proper config', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: false });
        renderHook(() => useLoginHistory(limitValue));

        expect(useQuery).toBeCalledWith('login_history', {
            options: { enabled: false },
            payload: { limit: 25 },
        });
    });
});
