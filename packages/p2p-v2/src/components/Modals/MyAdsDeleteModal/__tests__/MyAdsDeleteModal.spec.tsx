import React from 'react';
import Modal from 'react-modal';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyAdsDeleteModal from '../MyAdsDeleteModal';

const mockProps = {
    error: '',
    id: '123',
    isModalOpen: true,
    onClickDelete: jest.fn(),
    onRequestClose: jest.fn(),
};

let element: HTMLElement;
const mockUseGet = {
    data: {
        active_orders: 0,
    },
    isLoading: false,
};

jest.mock('@deriv/api-v2', () => ({
    p2p: {
        advert: {
            useGet: jest.fn(() => mockUseGet),
        },
    },
    useAuthorize: () => ({
        data: {
            local_currencies: ['USD'],
        },
    }),
}));

describe('MyAdsDeleteModal', () => {
    beforeAll(() => {
        element = document.createElement('div');
        element.setAttribute('id', 'v2_modal_root');
        document.body.appendChild(element);
        Modal.setAppElement('#v2_modal_root');
    });
    afterAll(() => {
        document.body.removeChild(element);
    });
    it('should render the component as expected', () => {
        render(<MyAdsDeleteModal {...mockProps} />);
        expect(screen.getByText('Do you want to delete this ad?')).toBeInTheDocument();
        expect(screen.getByText('You will NOT be able to restore it.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
    it('should not allow deletion if there are active orders', () => {
        mockUseGet.data.active_orders = 1;
        render(<MyAdsDeleteModal {...mockProps} />);
        expect(
            screen.getByText('You have open orders for this ad. Complete all open orders before deleting this ad.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ok' })).toBeInTheDocument();
    });
    it('should display the error message if there is an error', () => {
        const newProps = {
            ...mockProps,
            error: 'An error occurred',
        };
        render(<MyAdsDeleteModal {...newProps} />);
        expect(screen.getByText('An error occurred')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ok' })).toBeInTheDocument();
    });
    it('should handle onclick Delete', () => {
        mockUseGet.data.active_orders = 0;
        render(<MyAdsDeleteModal {...mockProps} />);
        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        userEvent.click(deleteButton);
        expect(mockProps.onClickDelete).toHaveBeenCalled();
    });
});
