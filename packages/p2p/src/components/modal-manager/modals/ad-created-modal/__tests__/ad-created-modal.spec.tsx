import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AdCreatedModal from '../ad-created-modal';

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

Object.defineProperty(window, 'localStorage', {
    value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
    },
});

const el_modal = document.createElement('div');

describe('<AdCreatedModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render AdCreatedModal', () => {
        render(<AdCreatedModal />);

        expect(screen.getByText("You've created an ad")).toBeInTheDocument();
    });
    it('should close the modal on clicking ok', () => {
        render(<AdCreatedModal />);

        const ok_button = screen.getByRole('button', { name: 'Ok' });
        userEvent.click(ok_button);
        expect(mock_modal_manager.hideModal).toBeCalledTimes(1);
    });
});
