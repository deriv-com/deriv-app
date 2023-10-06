import { act, renderHook } from '@testing-library/react-hooks';
import { useInvalidateQuery } from '@deriv/api';
import useOAuthRevokeConnectedApps from '../useOAuthRevokeConnectedApps';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useInvalidateQuery: jest.fn(),
    useMutation: () => ({
        mutate: jest.fn(),
    }),
}));
const mockedUseInvalidateQuery = useInvalidateQuery as jest.MockedFunction<typeof useInvalidateQuery>;

describe('useOAuthRevokeConnectedApps', () => {
    it('should return the revokeOAuthApp function to be invoked from component', async () => {
        const { revokeOAuthApp } = renderHook(() => useOAuthRevokeConnectedApps()).result.current;

        expect(typeof revokeOAuthApp).toBe('function');
    });

    it('should invoke the invalidation hook to refetch oauth apps list', async () => {
        mockedUseInvalidateQuery.mockReturnValue(() => Promise.resolve());
        const { revokeOAuthApp } = renderHook(() => useOAuthRevokeConnectedApps()).result.current;

        act(() => {
            revokeOAuthApp(10);
        });
        expect(mockedUseInvalidateQuery).toBeCalled();
    });
});
