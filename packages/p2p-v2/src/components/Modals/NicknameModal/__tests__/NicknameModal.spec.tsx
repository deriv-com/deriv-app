import React from 'react';
import { APIProvider, p2p } from '@deriv/api';
import { render, screen, act } from '@testing-library/react';
import NicknameModal from '../NicknameModal';
import userEvent from '@testing-library/user-event';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <div id='v2_modal_root' />
        {children}
    </APIProvider>
);

// const mockUseForm = useForm as jest.MockedFunction<typeof useForm>;
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    p2p: {
        advertiser: {
            useCreate: jest.fn().mockReturnValue({
                error: undefined,
                isError: false,
                isSuccess: true,
                mutate: jest.fn(),
                reset: jest.fn(),
            }),
        },
    },
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useDevice: jest.fn().mockReturnValue({
        isDesktop: true,
        isMobile: false,
    }),
    useSwitchTab: jest.fn().mockReturnValue(jest.fn),
}));
const mockUseAdvertiserCreate = p2p.advertiser.useCreate as jest.MockedFunction<typeof p2p.advertiser.useCreate>;

describe('NicknameModal', () => {
    it('should render title and description correctly', () => {
        render(<NicknameModal isModalOpen setIsModalOpen={jest.fn()} />, { wrapper });
        expect(screen.getByText('Choose your nickname')).toBeVisible();
        expect(screen.getByText('This nickname will be visible to other Deriv P2P users.')).toBeVisible();
    });
    it('should allow users to type and submit nickname', async () => {
        const mockSetIsModalOpen = jest.fn();
        const mockMutate = jest.fn();
        mockUseAdvertiserCreate.mockImplementation(() => ({
            error: undefined,
            isError: false,
            isSuccess: true,
            mutate: mockMutate,
            reset: jest.fn(),
        }));

        render(<NicknameModal isModalOpen setIsModalOpen={mockSetIsModalOpen} />, { wrapper });

        const nicknameInput = screen.getByLabelText('Your nickname');

        await userEvent.type(nicknameInput, 'Nahida');

        const confirmBtn = screen.getByRole('button', {
            name: 'Confirm',
        });
        await userEvent.click(confirmBtn);
        expect(mockMutate).toBeCalled();
    });
});
