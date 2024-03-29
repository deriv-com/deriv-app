import { useHistory, useLocation } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useQueryParams from '../useQueryParams';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useHistory: jest.fn(),
}));

describe('useQueryParams', () => {
    const mockHistoryPush = jest.fn();

    beforeEach(() => {
        (useLocation as jest.Mock).mockReturnValue({ search: '' });
        (useHistory as jest.Mock).mockReturnValue({
            push: mockHistoryPush,
            location: { pathname: '/' },
            action: 'PUSH',
        });
    });

    it('should open the modal when openModal is called', async () => {
        const { result } = renderHook(() => useQueryParams());

        expect(result.current.isModalOpen('GetADerivAccountDialog')).toBe(false);

        result.current.openModal('GetADerivAccountDialog');

        await waitFor(() => expect(result.current.isModalOpen('GetADerivAccountDialog')).toBe(true));
    });

    it('should close the modal when closeModal is called', async () => {
        const { result } = renderHook(() => useQueryParams());

        result.current.openModal('GetADerivAccountDialog');

        result.current.closeModal();

        await waitFor(() => expect(result.current.isModalOpen('GetADerivAccountDialog')).toBe(false));
    });

    it('should not open the modal for an invalid modal id', async () => {
        const { result } = renderHook(() => useQueryParams());

        result.current.openModal('InvalidModalId');

        await waitFor(() => expect(result.current.isModalOpen('GetADerivAccountDialog')).toBe(false));
    });

    it('should update the URL parameters when openModal is called', async () => {
        const { result } = renderHook(() => useQueryParams());

        result.current.openModal('GetADerivAccountDialog');

        await waitFor(() =>
            expect(mockHistoryPush).toHaveBeenCalledWith({
                pathname: '/',
                search: 'modal=GetADerivAccountDialog',
                state: {
                    modal: 'GetADerivAccountDialog',
                },
            })
        );
    });

    it('should close the modal when history action is POP', async () => {
        (useHistory as jest.Mock).mockReturnValue({
            action: 'POP',
            push: mockHistoryPush,
            location: { pathname: '/' },
        });

        const { result } = renderHook(() => useQueryParams());

        await waitFor(() => expect(result.current.isModalOpen('GetADerivAccountDialog')).toBe(false));
    });

    it('should open the latest modal when openModal is called multiple times', async () => {
        const { result } = renderHook(() => useQueryParams());

        result.current.openModal('GetADerivAccountDialog');
        result.current.openModal('AddOrManageAccount');

        await waitFor(() => expect(result.current.isModalOpen('AddOrManageAccount')).toBe(true));
        await waitFor(() => expect(result.current.isModalOpen('GetADerivAccountDialog')).toBe(false));

        await waitFor(() =>
            expect(mockHistoryPush).toHaveBeenCalledWith({
                pathname: '/',
                search: 'modal=AddOrManageAccount',
                state: {
                    modal: 'AddOrManageAccount',
                },
            })
        );
    });
});
