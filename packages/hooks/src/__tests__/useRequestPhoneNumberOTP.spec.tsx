import { act, renderHook } from '@testing-library/react-hooks';
import { useMutation } from '@deriv/api';
import useRequestPhoneNumberOTP from '../useRequestPhoneNumberOTP';
import React from 'react';
import useSetSettings from '../useSetSettings';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMutation: jest.fn(),
}));

jest.mock('../useSetSettings');

const mock_response = {
    data: {
        phone_number_challenge: 1,
    },
    mutate: jest.fn(),
    isSuccess: true,
};

const mockSetSettingsResponse = {
    error: null,
};

const mock_set_settings = jest.fn().mockResolvedValue(mockSetSettingsResponse);

describe('useRequestPhoneNumberOTP', () => {
    beforeEach(() => {
        (useSetSettings as jest.Mock).mockReturnValue({
            setSettings: mock_set_settings,
        });
    });

    it('should call mutate with correct payload for SMS request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP());

        result.current.requestOnSMS();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(result.current.mutate).toHaveBeenCalledWith({ payload: { carrier: 'sms' } });
        expect(result.current.data).toEqual(1);
    });

    it('should call mutate with correct payload for WhatsApp request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP());

        result.current.requestOnWhatsApp();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(result.current.mutate).toHaveBeenCalledWith({ payload: { carrier: 'whatsapp' } });
        expect(result.current.data).toEqual(1);
    });

    it('should return Localized error message when PhoneNumberTaken error code is passed inside', () => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP());

        act(() => {
            result.current.handleError({ code: 'PhoneNumberTaken', message: '' });
        });

        if (result.current?.error_message && React.isValidElement(result.current?.error_message))
            expect(result.current?.error_message?.props.i18n_default_text).toBe(
                "This number is in use. Enter a new one or contact <0>live chat</0> if you think there's a mistake."
            );
    });

    it('should return given error message when Other error code is passed inside', () => {
        const { result } = renderHook(() => useRequestPhoneNumberOTP());

        act(() => {
            result.current.handleError({ code: 'OtherError', message: 'This is an error message' });
        });

        if (result.current?.error_message) expect(result.current?.error_message).toBe('This is an error message');
    });

    it('should call setSettings with correct payload and handle success response', async () => {
        const { result } = renderHook(() => useRequestPhoneNumberOTP());

        await act(async () => {
            const response = await result.current.setUsersPhoneNumber({ phone: '+1234567890' });
            expect(response.error).toBe(null);
        });

        expect(mock_set_settings).toHaveBeenCalledWith({ phone: '+1234567890' });
    });

    it('should handle error response from setSettings', async () => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        const mock_set_settings_error_response = {
            error: { code: 'SomeError', message: 'An error occurred' },
        };
        (useSetSettings as jest.Mock).mockReturnValueOnce({
            setSettings: jest.fn().mockResolvedValue(mock_set_settings_error_response),
        });

        const { result } = renderHook(() => useRequestPhoneNumberOTP());
        const mock_set_settings = (useSetSettings as jest.Mock).mock.results[0].value.setSettings;

        await act(async () => {
            const response = await result.current.setUsersPhoneNumber({ phone: '+1234567890' });
            expect(response.error).toEqual(mock_set_settings_error_response.error);
        });

        expect(mock_set_settings).toHaveBeenCalledWith({ phone: '+1234567890' });
        expect(result.current.error_message).toEqual('An error occurred');
    });
});
