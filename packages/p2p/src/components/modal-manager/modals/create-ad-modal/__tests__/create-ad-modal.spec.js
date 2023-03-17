import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import CreateAdModal from '../create-ad-modal';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const el_modal = document.createElement('div');

jest.mock('../create-ad-modal-card', () => () => {
    return <div data-testid='create-ad-modal-card' />;
});

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn().mockReturnValue({
        hideModal: jest.fn(),
        is_modal_open: true,
    }),
}));

describe('<CreateAdModal/>', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the component', () => {
        render(<CreateAdModal />);
        expect(screen.getByText('Create new ad')).toBeInTheDocument();
    });

    it('should show the create ad modal card', () => {
        const { queryAllByTestId } = render(<CreateAdModal />);
        expect(queryAllByTestId('create-ad-modal-card')).toHaveLength(2);
    });
    it('should close modal on click close button', () => {
        const { hideModal } = useModalManagerContext();

        render(<CreateAdModal />);
        const buttons = screen.getAllByRole('button');
        const close_button = buttons[0];
        expect(close_button).toBeInTheDocument();
        fireEvent.click(close_button);

        expect(hideModal).toHaveBeenCalled();
    });
});
