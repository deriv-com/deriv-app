import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from '@deriv/api';
import useOAuthConnectedApps from '../useOAuthConnectedApps';

const mock_oauth_apps: ReturnType<typeof useOAuthConnectedApps>['data'] = [
    {
        app_id: 1010,
        app_markup_percentage: 0,
        last_used: '2023-10-05 14:27:17.373639',
        name: 'MOCK_NAME',
        official: 0,
        scopes: ['read', 'trade', 'payments'],
        appstore: '',
        github: '',
        googleplay: '',
        homepage: '',
        redirect_uri: '',
        verification_uri: '',
        active: 1,
    },
];
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useAuthorize: () => ({
        isSuccess: true,
    }),
    useQuery: jest.fn(),
}));

describe('useOAuthConnectedApps', () => {
    it('should fetch the oauth connected apps details using useQuery and return the response', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: { oauth_apps: mock_oauth_apps },
            isError: false,
            isSuccess: true,
        });
        const { data, isSuccess, isError } = renderHook(() => useOAuthConnectedApps()).result.current;

        expect(data).toEqual(mock_oauth_apps);
        expect(isSuccess).toEqual(true);
        expect(isError).toEqual(false);
    });

    it('should set isError to true if there were error in the response', async () => {
        (useQuery as jest.Mock).mockReturnValue({ data: { error: {} }, isError: true, isSuccess: false });
        const { isSuccess, isError } = renderHook(() => useOAuthConnectedApps()).result.current;

        expect(isError).toEqual(true);
        expect(isSuccess).toEqual(false);
    });
});
