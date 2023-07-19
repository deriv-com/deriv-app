import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import BlockUserModal from '../block-user-modal';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        block_unblock_user_error: '',
    },
};

const el_modal = document.createElement('div');

const block_user_modal_props = {
    advertiser_name: 'test',
    is_advertiser_blocked: false,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        is_modal_open: true,
    })),
}));

describe('<BlockUserModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should show Block message if advertiser is not blocked by user', () => {
        render(<BlockUserModal {...block_user_modal_props} />);

        expect(screen.getByText('Block test?')).toBeInTheDocument();
        expect(
            screen.getByText(/You won't see test's ads anymore and they won't be able to place orders on your ads./)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Block' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should show Unblock message if advertiser is blocked by user', () => {
        render(<BlockUserModal {...block_user_modal_props} is_advertiser_blocked={true} />);

        expect(screen.getByText('Unblock test?')).toBeInTheDocument();
        expect(
            screen.getByText(/You will be able to see test's ads. They'll be able to place orders on your ads, too./)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Unblock' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
});
