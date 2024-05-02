import useMutation from '../../useMutation';
import useAuthorize from '../useAuthorize';
import useRevokeConnectedApps from '../useRevokeConnectedApps';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('../useAuthorize');
jest.mock('../../useMutation');
jest.mock('../../useInvalidateQuery');

describe('useRevokeConnectedApps', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const mock_response = {
        data: {
            revoke_oauth_app: 1,
        },
        mutate: jest.fn(),
    };

    it('should return fetched connected apps', async () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: false });
        (useMutation as jest.Mock).mockReturnValue(mock_response);

        const { result } = renderHook(() => useRevokeConnectedApps());
        result.current.mutate(1234);

        expect(result.current.data?.revoke_oauth_app).toEqual(1);
    });
});
