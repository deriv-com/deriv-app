import React from 'react';
import { useAdvertiserInfoState } from '@/providers/AdvertiserInfoStateProvider';
import { APIProvider, AuthProvider, p2p } from '@deriv/api-v2';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NicknameModal from '../NicknameModal';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider standalone>
        <AuthProvider>
            <div id='v2_modal_root' />
            {children}
        </AuthProvider>
    </APIProvider>
);

const mockedMutate = jest.fn();
const mockedReset = jest.fn();
const mockedUseAdvertiserCreate = p2p.advertiser.useCreate as jest.MockedFunction<typeof p2p.advertiser.useCreate>;
const mockPush = jest.fn();
const mockUseAdvertiserInfoState = useAdvertiserInfoState as jest.MockedFunction<typeof useAdvertiserInfoState>;

jest.mock('lodash', () => ({
    ...jest.requireActual('lodash'),
    debounce: jest.fn(f => f),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: mockPush,
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        advertiser: {
            useCreate: jest.fn(() => ({
                error: undefined,
                isError: false,
                isSuccess: true,
                mutate: mockedMutate,
                reset: mockedReset,
            })),
        },
    },
}));

jest.mock('@/providers/AdvertiserInfoStateProvider', () => ({
    useAdvertiserInfoState: jest.fn().mockReturnValue({
        setHasCreatedAdvertiser: jest.fn(),
    }),
}));

describe('NicknameModal', () => {
    it('should render title and description correctly', () => {
        render(<NicknameModal isModalOpen setIsModalOpen={jest.fn()} />, { wrapper });
        expect(screen.getByText('What’s your nickname?')).toBeVisible();
        expect(screen.getByText('Others will see this on your profile, ads and charts.')).toBeVisible();
    });
    it('should allow users to type and submit nickname', async () => {
        render(<NicknameModal isModalOpen setIsModalOpen={jest.fn()} />, { wrapper });

        const nicknameInput = screen.getByTestId('dt_p2p_v2_nickname_modal_input');

        await userEvent.type(nicknameInput, 'Nahida');

        await waitFor(() => {
            const confirmBtn = screen.getByRole('button', {
                name: 'Confirm',
            });
            userEvent.click(confirmBtn);
        });

        expect(mockedMutate).toHaveBeenCalledWith({
            name: 'Nahida',
        });
        expect(mockUseAdvertiserInfoState().setHasCreatedAdvertiser).toBeCalledWith(true);
    });
    it('should invoke reset when there is an error from creating advertiser', async () => {
        (mockedUseAdvertiserCreate as jest.Mock).mockImplementationOnce(() => ({
            error: undefined,
            isError: true,
            isSuccess: false,
            mutate: mockedMutate,
            reset: mockedReset,
        }));

        await act(() => {
            render(<NicknameModal isModalOpen setIsModalOpen={jest.fn()} />, { wrapper });
        });

        expect(mockedReset).toBeCalled();
    });
    it('should close the modal when Cancel button is clicked', async () => {
        (mockedUseAdvertiserCreate as jest.Mock).mockImplementationOnce(() => ({
            error: undefined,
            isError: false,
            isSuccess: true,
            mutate: mockedMutate,
            reset: mockedReset,
        }));
        const mockIsModalOpen = jest.fn();
        render(<NicknameModal isModalOpen setIsModalOpen={mockIsModalOpen} />, { wrapper });

        const cancelBtn = screen.getByRole('button', {
            name: 'Cancel',
        });
        userEvent.click(cancelBtn);

        expect(mockPush).toBeCalledWith('/cashier/p2p-v2/buy-sell');
        expect(mockIsModalOpen).toBeCalledWith(false);
    });
});
