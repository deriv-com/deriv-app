import { renderHook } from '@testing-library/react-hooks';
import useAuthorize from '../useAuthorize';
import useQuery from '../../useQuery';
import useFetchConnectedApps from '../useFetchConnectedApps';

jest.mock('../../useQuery');
jest.mock('../useAuthorize');

describe('useFetchConnectedApps', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const mock_response = {
        data: {
            oauth_apps: [
                {
                    app_id: 31063,
                    app_markup_percentage: 0,
                    last_used: '2023-03-17 07:43:10.238918',
                    name: 'API Developers Deriv',
                    official: 0,
                    scopes: ['read', 'trade', 'trading_information', 'payments', 'admin'],
                },
            ],
        },
    };

    it('should return fetched connected apps', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useQuery as jest.Mock).mockReturnValueOnce(mock_response);

        const { result } = renderHook(() => useFetchConnectedApps());
        expect(result.current.data).toEqual(mock_response.data.oauth_apps);
    });

    it('should not call hook automatically if app is not authorised ', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: false });

        renderHook(() => useFetchConnectedApps());
        expect(useQuery as jest.Mock).toHaveBeenCalledWith('oauth_apps', {
            options: { enabled: false },
        });
    });
});
