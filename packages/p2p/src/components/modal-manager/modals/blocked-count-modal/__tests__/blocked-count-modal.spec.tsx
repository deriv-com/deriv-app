import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import BlockedCountModal from '../blocked-count-modal';

const el_modal = document.createElement('div');

const mock_modal_manager = {
    showModal: jest.fn(),
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context');
const mocked_useModalManagerContext = useModalManagerContext as jest.MockedFunction<
    () => Partial<ReturnType<typeof useModalManagerContext>>
>;

mocked_useModalManagerContext.mockImplementation(() => mock_modal_manager);

describe('<BlockedCountModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render BlockedCountModal', () => {
        render(<BlockedCountModal />);

        expect(screen.getByText('Nobody has blocked you. Yay!')).toBeInTheDocument();
    });

    it('should call hideModal when clicking on the OK button', () => {
        render(<BlockedCountModal />);

        const ok_button = screen.getByRole('button', { name: 'Ok' });

        userEvent.click(ok_button);

        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
    });
});
