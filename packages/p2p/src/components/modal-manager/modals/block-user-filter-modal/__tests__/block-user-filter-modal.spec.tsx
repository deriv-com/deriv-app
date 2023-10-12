import React from 'react';
import { screen, render } from '@testing-library/react';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores/index';
import BlockUserFilterModal from '../block-user-filter-modal';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_profile_store: {
        block_user_sort_list: [
            {
                text: localize('All'),
                value: 'all_users',
            },
            {
                text: localize('Blocked'),
                value: 'blocked_users',
            },
        ],
        handleChange: jest.fn(),
        selected_sort_value: 'all_users',
    },
};

const el_modal = document.createElement('div');

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        hideModal: jest.fn(),
        is_modal_open: true,
    })),
}));

describe('<BlockUserFilterModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the BlockUserFilterModal', () => {
        render(<BlockUserFilterModal />);

        expect(screen.getByText('All')).toBeInTheDocument();
        expect(screen.getByText('Blocked')).toBeInTheDocument();
    });
});
