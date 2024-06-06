import { renderHook } from '@testing-library/react-hooks';
import { useMutation } from '@deriv/api';
import useGetPhoneNumberOTP from '../useGetPhoneNumberOTP';
import { VERIFICATION_SERVICES } from '@deriv/shared';

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
        expect(result.current.mutate).toHaveBeenCalledWith({
            payload: { carrier: VERIFICATION_SERVICES.SMS, email_code: '' },
        });
        expect(result.current.data).toEqual(1);
    });

    it('should call mutate with correct payload for WhatsApp request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useGetPhoneNumberOTP());

        result.current.requestOnWhatsApp();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(result.current.mutate).toHaveBeenCalledWith({
            payload: { carrier: VERIFICATION_SERVICES.WHATSAPP, email_code: '' },
        });
        expect(result.current.data).toEqual(1);
    });

    it('should call mutate with correct payload for sendEmailOTPVerification request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useGetPhoneNumberOTP());

        result.current.sendEmailOTPVerification('123456');

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(result.current.mutate).toHaveBeenCalledWith({
            payload: { email_code: '123456' },
        });
        expect(result.current.data).toEqual(1);
    });
});
