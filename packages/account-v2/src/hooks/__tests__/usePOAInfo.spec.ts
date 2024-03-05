import { useAuthentication, useMT5AccountsList } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import { usePOAInfo } from '../usePOAInfo';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useAuthentication: jest.fn(),
    useMT5AccountsList: jest.fn(),
}));

describe('usePOAInfo', () => {
    it('should return the correct values', () => {
        (useAuthentication as jest.Mock).mockReturnValue({
            data: {
                document: {
                    status: 'none',
                },
                is_age_verified: true,
                is_allow_document_upload: true,
                is_poa_address_mismatch: true,
                is_poa_resubmission_allowed: true,
                is_poi_needed: true,
            },
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    status: 'poa_failed',
                },
            ],
        });

        const { result } = renderHook(() => usePOAInfo());
        const { data } = result.current;

        expect(data.documentNotRequired).toBe(false);
        expect(data.documentStatus).toBe('none');
        expect(data.documentSubmitted).toBe(false);
        expect(data.isPOAResubmission).toBe(true);
        expect(data.isPOINeeded).toBe(true);
    });

    it('should return the correct values for no restricted mt5 account', () => {
        (useAuthentication as jest.Mock).mockReturnValue({
            data: {
                document: {
                    status: 'none',
                },
                is_age_verified: true,
                is_allow_document_upload: true,
                is_poa_address_mismatch: true,
                is_poa_resubmission_allowed: true,
                is_poi_needed: true,
            },
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    status: 'none',
                },
            ],
        });

        const { result } = renderHook(() => usePOAInfo());
        const { data } = result.current;

        expect(data.documentNotRequired).toBe(false);
        expect(data.documentStatus).toBe('none');
        expect(data.documentSubmitted).toBe(false);
        expect(data.isPOAResubmission).toBe(true);
        expect(data.isPOINeeded).toBe(true);
    });

    it('should return the correct values for document rejected', () => {
        (useAuthentication as jest.Mock).mockReturnValue({
            data: {
                document: {
                    status: 'rejected',
                },
                is_age_verified: true,
                is_allow_document_upload: true,
                is_poa_address_mismatch: false,
                is_poa_resubmission_allowed: false,
                is_poi_needed: true,
            },
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    status: 'none',
                },
            ],
        });

        const { result } = renderHook(() => usePOAInfo());
        const { data } = result.current;

        expect(data.documentNotRequired).toBe(false);
        expect(data.documentStatus).toBe('rejected');
        expect(data.documentSubmitted).toBe(false);
        expect(data.isPOAResubmission).toBe(false);
        expect(data.isPOINeeded).toBe(true);
    });

    it('should return the correct values for document suspected', () => {
        (useAuthentication as jest.Mock).mockReturnValue({
            data: {
                document: {
                    status: 'suspected',
                },
                is_age_verified: true,
                is_allow_document_upload: true,
                is_poa_address_mismatch: false,
                is_poa_resubmission_allowed: false,
                is_poi_needed: true,
            },
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    status: 'none',
                },
            ],
        });

        const { result } = renderHook(() => usePOAInfo());
        const { data } = result.current;

        expect(data.documentNotRequired).toBe(false);
        expect(data.documentStatus).toBe('suspected');
        expect(data.documentSubmitted).toBe(false);
        expect(data.isPOAResubmission).toBe(false);
        expect(data.isPOINeeded).toBe(true);
    });

    it('should return the correct values for document expired', () => {
        (useAuthentication as jest.Mock).mockReturnValue({
            data: {
                document: {
                    status: 'expired',
                },
                is_age_verified: true,
                is_allow_document_upload: true,
                is_poa_address_mismatch: false,
                is_poa_resubmission_allowed: false,
                is_poi_needed: true,
            },
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    status: 'none',
                },
            ],
        });

        const { result } = renderHook(() => usePOAInfo());
        const { data } = result.current;

        expect(data.documentNotRequired).toBe(false);
        expect(data.documentStatus).toBe('expired');
        expect(data.documentSubmitted).toBe(false);
        expect(data.isPOAResubmission).toBe(false);
        expect(data.isPOINeeded).toBe(true);
    });

    it('should return the correct values for document pending', () => {
        (useAuthentication as jest.Mock).mockReturnValue({
            data: {
                document: {
                    status: 'pending',
                },
                is_age_verified: true,
                is_allow_document_upload: true,
                is_poa_address_mismatch: false,
                is_poa_resubmission_allowed: false,
                is_poi_needed: true,
            },
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    status: 'none',
                },
            ],
        });

        const { result } = renderHook(() => usePOAInfo());
        const { data } = result.current;

        expect(data.documentNotRequired).toBe(false);
        expect(data.documentStatus).toBe('pending');
        expect(data.documentSubmitted).toBe(true);
        expect(data.isPOAResubmission).toBe(false);
        expect(data.isPOINeeded).toBe(true);
    });

    it('should return the correct values for document upload not allowed', () => {
        (useAuthentication as jest.Mock).mockReturnValue({
            data: {
                document: {
                    status: 'none',
                },
                is_age_verified: true,
                is_allow_document_upload: false,
                is_poa_address_mismatch: false,
                is_poa_resubmission_allowed: false,
                is_poi_needed: true,
            },
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    status: 'none',
                },
            ],
        });

        const { result } = renderHook(() => usePOAInfo());
        const { data } = result.current;

        expect(data.documentNotRequired).toBe(true);
        expect(data.documentStatus).toBe('none');
        expect(data.documentSubmitted).toBe(false);
        expect(data.isPOAResubmission).toBe(false);
        expect(data.isPOINeeded).toBe(true);
    });
});
