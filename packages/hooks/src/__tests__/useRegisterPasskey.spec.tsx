import { renderHook } from '@testing-library/react-hooks';
import { useMutation, useQuery } from '@deriv/api';
import { startRegistration } from '@simplewebauthn/browser';
import useRegisterPasskey from '../useRegisterPasskey';

jest.mock('@deriv/api', () => ({
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useInvalidateQuery: jest.fn(),
}));

jest.mock('@simplewebauthn/browser', () => ({
    startRegistration: jest.fn(),
}));

describe('useRegisterPasskey', () => {
    it('should initiate passkey registration', async () => {
        const mock_publicKey = 'mock_publicKey';
        const mock_attResp = 'mock_attResp';
        const mockRefetch = jest.fn();

        (useQuery as jest.Mock).mockReturnValue({
            data: { passkeys_register_options: { publicKey: mock_publicKey } },
            refetch: mockRefetch,
            error: null,
            isFetching: false,
        });

        (useMutation as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
            error: null,
            isLoading: false,
        });

        (startRegistration as jest.Mock).mockResolvedValue(mock_attResp);

        const { result } = renderHook(() => useRegisterPasskey());

        result.current.createPasskey();

        expect(useQuery).toHaveBeenCalledWith('passkeys_register_options', expect.any(Object));
        expect(mockRefetch).toHaveBeenCalled();
        expect(startRegistration).toHaveBeenCalledWith(mock_publicKey);
        expect(useMutation).toHaveBeenCalledWith('passkeys_register', expect.any(Object));
    });
});
