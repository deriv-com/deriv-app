import { renderHook } from '@testing-library/react-hooks';
import { useMutation } from '@deriv/api';
import useGetPhoneNumberOTP from '../useGetPhoneNumberOTP';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMutation: jest.fn(),
}));

const mock_response = {
    data: {
        phone_number_challenge: 1,
    },
    mutate: jest.fn(),
};

describe('useGetPhoneNumberOTP', () => {
    it('should call mutate with correct payload for SMS request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useGetPhoneNumberOTP());

        result.current.requestOnSMS();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(result.current.mutate).toHaveBeenCalledWith({ payload: { carrier: 'sms' } });
        expect(result.current.data).toEqual(1);
    });

    it('should call mutate with correct payload for WhatsApp request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useGetPhoneNumberOTP());

        result.current.requestOnWhatsApp();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(result.current.mutate).toHaveBeenCalledWith({ payload: { carrier: 'whatsapp' } });
        expect(result.current.data).toEqual(1);
    });
});
