import { act, renderHook } from '@testing-library/react-hooks';
import useOnfido from '../useOnfido';
import { useSettings, useResidenceList, useOnfidoServiceToken, useOnfidoNotificationEvent } from '..';
import { fireEvent } from '@testing-library/react';

jest.mock('../useSettings');
jest.mock('../useResidenceList');
jest.mock('../useOnfidoServiceToken');
jest.mock('../useOnfidoNotificationEvent');

const mockSettings = { country_code: 'US' };
const mockResidenceList = [
    {
        value: 'US',
        identity: {
            services: {
                onfido: {
                    is_country_supported: true,
                    documents_supported: {
                        passport: { display_name: 'Passport' },
                        driving_licence: { display_name: 'Driving Licence' },
                    },
                },
            },
        },
    },
];

const mockServiceToken = { token: 'mock_token' };

describe('useOnfido', () => {
    it('should return the necessary data', async () => {
        const mockSubmitDocuments = jest.fn();

        (useSettings as jest.Mock).mockReturnValue({ data: mockSettings });
        (useResidenceList as jest.Mock).mockReturnValue({ data: mockResidenceList });
        (useOnfidoServiceToken as jest.Mock).mockReturnValue({ data: mockServiceToken, isLoading: false, error: null });
        (useOnfidoNotificationEvent as jest.Mock).mockReturnValue({ mutate: mockSubmitDocuments });

        const { result, waitForNextUpdate } = renderHook(() => useOnfido('US'));

        // eslint-disable-next-line testing-library/no-node-access
        const scriptNode = document.getElementById('onfido_sdk');
        expect(scriptNode).not.toBeNull();

        // Manually trigger the load event
        act(() => {
            fireEvent.load(scriptNode as HTMLElement);
        });

        await waitForNextUpdate();

        // Assert that the necessary data is returned
        expect(result.current.isOnfidoInitialized).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.serviceTokenError).toBeNull();
        expect(result.current.onfidoInitializationError).toBeNull();
        expect(result.current.data.onfidoRef.current).not.toBeNull();
        expect(result.current.data.onfidoContainerId).toBeDefined();
        expect(result.current.data.hasSubmitted).toBe(false);

        // Assert that the necessary functions are called
        expect(mockSubmitDocuments).not.toHaveBeenCalled(); // submitDocuments should not be called yet
    });

    it('should initialize Onfido with correct values', async () => {
        const mockSubmitDocuments = jest.fn();

        (useSettings as jest.Mock).mockReturnValue({ data: mockSettings });
        (useResidenceList as jest.Mock).mockReturnValue({ data: mockResidenceList });
        (useOnfidoServiceToken as jest.Mock).mockReturnValue({ data: mockServiceToken, isLoading: false, error: null });
        (useOnfidoNotificationEvent as jest.Mock).mockReturnValue({ mutate: mockSubmitDocuments });

        const mockOnfidoInit = jest.fn();
        window.Onfido.init = mockOnfidoInit;

        const { waitForNextUpdate } = renderHook(() => useOnfido());

        // eslint-disable-next-line testing-library/no-node-access
        const scriptNode = document.getElementById('onfido_sdk');
        expect(scriptNode).not.toBeNull();

        // Manually trigger the load event
        act(() => {
            fireEvent.load(scriptNode as HTMLElement);
        });

        await waitForNextUpdate();

        expect(mockOnfidoInit).toHaveBeenLastCalledWith(
            expect.objectContaining({
                token: 'mock_token',
                useModal: false,
                useMemoryHistory: true,
                steps: [
                    {
                        type: 'document',
                        options: {
                            documentTypes: {
                                passport: true,
                                driving_licence: { country: 'USA' },
                                national_identity_card: false,
                            },
                            hideCountrySelection: true,
                        },
                    },
                    'face',
                ],
            })
        );
    });

    it('should return error if Onfido initialization throws error', async () => {
        (useSettings as jest.Mock).mockReturnValue({ data: mockSettings });
        (useResidenceList as jest.Mock).mockReturnValue({ data: mockResidenceList });
        (useOnfidoServiceToken as jest.Mock).mockReturnValue({ data: mockServiceToken, isLoading: false, error: null });
        (useOnfidoNotificationEvent as jest.Mock).mockReturnValue({ mutate: jest.fn() });

        const onfidoError = new Error('Failed to initialize Onfido');
        const mockOnfidoInit = jest.fn(() => {
            throw onfidoError;
        });
        window.Onfido.init = mockOnfidoInit;

        const { result } = renderHook(() => useOnfido('US'));

        expect(result.current.onfidoInitializationError).toEqual(onfidoError);
    });
});
