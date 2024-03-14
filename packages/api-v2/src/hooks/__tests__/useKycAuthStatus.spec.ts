import { renderHook } from '@testing-library/react-hooks';
import useKycAuthStatus from '../useKycAuthStatus';
import useQuery from '../../useQuery';

jest.mock('../../useQuery');

jest.mock('../useAuthorize', () => jest.fn(() => ({ isSuccess: true })));

describe('useKycAuthStatus', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return kyc_auth_status', () => {
        const mock_response = {
            data: {
                kyc_auth_status: {
                    identity: {
                        status: 'none',
                    },
                    document: {
                        status: 'none',
                    },
                },
            },
        };
        (useQuery as jest.Mock).mockReturnValue(mock_response);

        const { result } = renderHook(() => useKycAuthStatus({ country: 'in' }));
        expect(result.current.kyc_auth_status).toEqual(mock_response.data.kyc_auth_status);
    });
});
