import React from 'react';
import { render, screen } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import RecommendedModal from '../recommended-modal';

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const el_modal = document.createElement('div');

const mock_props = {
    message: 'You are recommended by 1 trader',
};

describe('<RecommendedModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render RecommendedModal with the given message', () => {
        render(<RecommendedModal {...mock_props} />);

        expect(screen.getByText('You are recommended by 1 trader')).toBeInTheDocument();
    });
    it('should close the modal on clicking ok button', () => {
        render(<RecommendedModal {...mock_props} />);

        const ok_button = screen.getByRole('button', { name: 'Ok' });
        ok_button.click();
        expect(mock_modal_manager.hideModal).toBeCalledTimes(1);
    });
});
