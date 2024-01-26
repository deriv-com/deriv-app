import React from 'react';
import { render, screen } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import InvalidVerificationLinkModal from '../invalid-verification-link-modal';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    order_store: {
        confirmOrderRequest: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

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
    error_message: 'please wait 10 seconds before requesting a new link',
    order_id: '1234',
};

describe('<InvalidVerificationLinkModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render InvalidVerificationLinkModal with given props', () => {
        render(<InvalidVerificationLinkModal {...mock_props} />);

        expect(screen.getByText('please wait 10 seconds before requesting a new link')).toBeInTheDocument();
    });
    it('should close modal and request for new link on clicking "get new link" button', () => {
        render(<InvalidVerificationLinkModal {...mock_props} />);

        const ok_button = screen.getByRole('button', { name: 'Get new link' });
        expect(ok_button).toBeInTheDocument();
        ok_button.click();
        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
        expect(mocked_store_values.order_store.confirmOrderRequest).toHaveBeenCalledTimes(1);
    });
});
