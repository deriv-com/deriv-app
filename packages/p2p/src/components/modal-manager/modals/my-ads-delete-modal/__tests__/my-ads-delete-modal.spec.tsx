import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { requestWS } from 'Utils/websocket';
import MyAdsDeleteErrorModal from '../my-ads-delete-modal';

const mock_modal_manager_context: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
    showModal: jest.fn(),
};

const mock_store = {
    my_ads_store: {
        adverts: [{ id: '123' }],
        selected_ad_id: '123',
        setAdverts: jest.fn(),
        setDeleteErrorMessage: jest.fn(),
        setSelectedAdId: jest.fn(),
    },
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager_context),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Utils/websocket', () => ({
    ...jest.requireActual('Utils/websocket'),
    requestWS: jest.fn(() =>
        Promise.resolve({
            error: undefined,
            p2p_advert_update: {
                id: '123',
            },
        })
    ),
}));

describe('<MyAdsDeleteErrorModal />', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render MyAdsDeleteErrorModal component', () => {
        render(<MyAdsDeleteErrorModal />);

        expect(screen.getByText('Do you want to delete this ad?')).toBeInTheDocument();
        expect(screen.getByText('You will NOT be able to restore it.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('should close modal when cancel button is clicked', () => {
        render(<MyAdsDeleteErrorModal />);

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);

        expect(mock_modal_manager_context.hideModal).toHaveBeenCalled();
    });

    it('should delete ad when delete button is clicked', async () => {
        render(<MyAdsDeleteErrorModal />);

        const delete_button = screen.getByRole('button', { name: 'Delete' });
        userEvent.click(delete_button);

        await Promise.resolve();

        expect(mock_modal_manager_context.hideModal).toHaveBeenCalled();
        expect(mock_store.my_ads_store.setAdverts).toHaveBeenCalled();
    });

    it('should show error modal when delete button is clicked and API call fails', async () => {
        (requestWS as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                error: {
                    message: 'some error',
                },
                p2p_advert_update: {
                    id: '123',
                },
            })
        );

        render(<MyAdsDeleteErrorModal />);

        const delete_button = screen.getByRole('button', { name: 'Delete' });
        userEvent.click(delete_button);

        await Promise.resolve();

        expect(mock_modal_manager_context.hideModal).toHaveBeenCalled();
        expect(mock_modal_manager_context.showModal).toHaveBeenCalledWith({
            key: 'MyAdsDeleteErrorModal',
            props: {},
        });
    });
});
