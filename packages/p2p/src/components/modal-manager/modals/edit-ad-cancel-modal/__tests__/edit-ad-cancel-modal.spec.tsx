import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import EditAdCancelModal from '../edit-ad-cancel-modal';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        setShowEditAdForm: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: () => mock_store,
}));

const mock_modal_manager = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context');
const mocked_useModalManagerContext = useModalManagerContext as jest.MockedFunction<
    () => Partial<ReturnType<typeof useModalManagerContext>>
>;

mocked_useModalManagerContext.mockImplementation(() => mock_modal_manager);

describe('<EditAdCancelModal/>', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    it('should render the EditAdCancelModal', () => {
        render(<EditAdCancelModal />);

        expect(screen.getByText('Cancel your edits?')).toBeInTheDocument();
    });
    it('should close modal on clicking cancel button', () => {
        render(<EditAdCancelModal />);

        const cancel_button = screen.getByText('Cancel');
        userEvent.click(cancel_button);
        expect(mock_modal_manager.hideModal).toBeCalledTimes(1);
        expect(mock_store.my_ads_store.setShowEditAdForm).toBeCalledTimes(1);
    });
});
