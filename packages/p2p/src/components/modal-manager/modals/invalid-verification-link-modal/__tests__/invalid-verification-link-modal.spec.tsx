import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import InvalidVerificationLinkModal from '../invalid-verification-link-modal';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    order_store: {
        confirmOrderRequest: jest.fn(),
        error_code: 'ExcessiveVerificationRequests',
        setIsVerifyingEmail: jest.fn(),
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

    it('should render OK button and not show the Invalid verification link text', () => {
        render(<InvalidVerificationLinkModal {...mock_props} />);

        expect(screen.getByText('please wait 10 seconds before requesting a new link')).toBeInTheDocument();
        expect(screen.queryByText('Invalid verification link')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('should close modal when clicking "OK" button', () => {
        render(<InvalidVerificationLinkModal {...mock_props} />);

        const ok_button = screen.getByRole('button', { name: 'OK' });
        expect(ok_button).toBeInTheDocument();
        userEvent.click(ok_button);
        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
        expect(mocked_store_values.order_store.setIsVerifyingEmail).toHaveBeenCalledTimes(1);
    });

    it('should render Invalid verification link text and Get new link when error_code is InvalidVerificationToken', () => {
        mocked_store_values.order_store.error_code = 'InvalidVerificationToken';
        mock_props.error_message = 'The link that you used appears to be invalid. Please check and try again.';
        render(<InvalidVerificationLinkModal {...mock_props} />);

        expect(screen.getByText('Invalid verification link')).toBeInTheDocument();
        expect(
            screen.getByText('The link that you used appears to be invalid. Please check and try again.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Get new link' })).toBeInTheDocument();
    });

    it('should call confirmOrderRequest when clicking Get new link button', () => {
        render(<InvalidVerificationLinkModal {...mock_props} />);

        const get_new_link_button = screen.getByRole('button', { name: 'Get new link' });
        expect(get_new_link_button).toBeInTheDocument();
        userEvent.click(get_new_link_button);
        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
        expect(mocked_store_values.order_store.setIsVerifyingEmail).toHaveBeenCalledTimes(1);
        expect(mocked_store_values.order_store.confirmOrderRequest).toHaveBeenCalledTimes(1);
        expect(mocked_store_values.order_store.confirmOrderRequest).toHaveBeenCalledWith('1234');
    });

    it('should call hideModal and setIsVerifyingEmail when clicking on X icon', () => {
        render(<InvalidVerificationLinkModal {...mock_props} />);

        const close_icon = screen.getByTestId('dt_modal_close_icon');
        expect(close_icon).toBeInTheDocument();
        userEvent.click(close_icon);
        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
        expect(mocked_store_values.order_store.setIsVerifyingEmail).toHaveBeenCalledTimes(1);
    });
});
