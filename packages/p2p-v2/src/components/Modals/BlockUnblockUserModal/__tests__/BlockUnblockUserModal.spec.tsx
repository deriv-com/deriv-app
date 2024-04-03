import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlockUnblockUserModal from '../BlockUnblockUserModal';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>
            <div id='v2_modal_root' />
            {children}
        </AuthProvider>
    </APIProvider>
);

const mockOnRequestClose = jest.fn();
const mockUseBlockMutate = jest.fn();
const mockUseUnblockMutate = jest.fn();

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        counterparty: {
            useBlock: jest.fn(() => ({
                mutate: mockUseBlockMutate,
            })),
            useUnblock: jest.fn(() => ({
                mutate: mockUseUnblockMutate,
            })),
        },
    },
}));

describe('BlockUnblockUserModal', () => {
    it('should render the modal with correct title and behaviour for blocking user', () => {
        render(
            <BlockUnblockUserModal
                advertiserName='Jane Doe'
                id='1'
                isBlocked={false}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />,
            {
                wrapper,
            }
        );

        expect(
            screen.queryByText(
                `You won't see Jane Doe's ads anymore and they won't be able to place orders on your ads.`
            )
        ).toBeVisible();

        const blockBtn = screen.getByRole('button', {
            name: 'Block',
        });
        userEvent.click(blockBtn);

        expect(mockUseBlockMutate).toBeCalledWith([1]);
    });
    it('should render the modal with correct title and behaviour for unblocking user', () => {
        render(
            <BlockUnblockUserModal
                advertiserName='Hu Tao'
                id='2'
                isBlocked={true}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />,
            {
                wrapper,
            }
        );

        expect(
            screen.queryByText(
                `You will be able to see Hu Tao's ads. They'll be able to place orders on your ads, too.`
            )
        ).toBeVisible();

        const unblockBtn = screen.getByRole('button', {
            name: 'Unblock',
        });
        userEvent.click(unblockBtn);

        expect(mockUseUnblockMutate).toBeCalledWith([2]);
    });
    it('should hide the modal when user clicks cancel', () => {
        render(
            <BlockUnblockUserModal
                advertiserName='Hu Tao'
                id='2'
                isBlocked={true}
                isModalOpen={true}
                onRequestClose={mockOnRequestClose}
            />,
            {
                wrapper,
            }
        );

        const cancelBtn = screen.getByRole('button', {
            name: 'Cancel',
        });
        userEvent.click(cancelBtn);

        expect(mockOnRequestClose).toBeCalled();
    });
});
