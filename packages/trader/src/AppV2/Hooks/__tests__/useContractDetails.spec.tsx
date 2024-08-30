import { renderHook } from '@testing-library/react-hooks';
import { useLocation } from 'react-router';
import { useStore } from '@deriv/stores';
import useContractDetails from '../useContractDetails';

jest.mock('react-router', () => ({
    useLocation: jest.fn(),
}));

jest.mock('@deriv/stores', () => ({
    useStore: jest.fn(),
}));

describe('useContractDetails', () => {
    const mockOnMount = jest.fn();
    const mockOnUnMount = jest.fn();
    const mockGetContractById = jest.fn();
    const mockContractInfo = { contract_id: null };

    const setupMocks = (contractInfoOverride = {}) => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '/contract/12345',
        });

        (useStore as jest.Mock).mockReturnValue({
            contract_replay: {
                contract_store: {
                    contract_info: { ...mockContractInfo, ...contractInfoOverride },
                },
                onMount: mockOnMount,
                onUnmount: mockOnUnMount,
            },
            contract_trade: {
                getContractById: mockGetContractById,
            },
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call onMount with contract_id from URL when contract_id is not available', () => {
        setupMocks();

        renderHook(() => useContractDetails());

        expect(mockOnMount).toHaveBeenCalledWith(12345);
    });

    it('should not call onMount if contract_id is equal to id from the url', () => {
        setupMocks({ contract_id: 67890 });
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '//abc/contracts/67890',
        });

        renderHook(() => useContractDetails());

        expect(mockOnMount).not.toHaveBeenCalled();
    });

    it('should return the correct contract_info and contract', () => {
        const mockContract = { id: 67890 };
        mockGetContractById.mockReturnValue(mockContract);

        setupMocks({ contract_id: 67890 });

        const { result } = renderHook(() => useContractDetails());

        expect(result.current.contract_info.contract_id).toBe(67890);
        expect(result.current.contract).toBe(mockContract);
        expect(result.current.is_loading).toBe(false);
    });

    it('should return is_loading as true if contract_id is not available', () => {
        setupMocks();

        const { result } = renderHook(() => useContractDetails());

        expect(result.current.is_loading).toBe(true);
    });

    it('should update on location change', () => {
        const { rerender } = renderHook(() => useContractDetails(), {
            initialProps: { pathname: '/contract/12345' },
        });

        setupMocks();
        (useLocation as jest.Mock).mockReturnValue({ pathname: '/contract/67890' });

        rerender();

        expect(mockOnMount).toHaveBeenCalledWith(67890);
    });
});
