import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import BlockUserRow from '../block-user-row';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        setSelectedAdState: jest.fn(),
    },
    general_store: {
        is_barred: false,
    },
    my_profile_store: {
        getCounterpartyAdvertiserInfo: jest.fn(),
        onClickUnblock: jest.fn(),
    },
};

const block_user_row_props = {
    row: {
        id: '1',
        is_blocked: 0,
        name: 'test',
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<BlockUserRow/>', () => {
    it('should render BlockUserRow component', () => {
        render(<BlockUserRow {...block_user_row_props} />);

        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Block' })).toBeInTheDocument();
    });

    it('should allow user to click on advertiser name if the user is not barred', () => {
        const { id, name } = block_user_row_props.row;

        render(<BlockUserRow {...block_user_row_props} />);

        const advertiser_name = screen.getByText('test');

        userEvent.click(advertiser_name);

        expect(mock_store.my_profile_store.getCounterpartyAdvertiserInfo).toBeCalledWith(id);
        expect(mock_store.buy_sell_store.setSelectedAdState).toBeCalledWith({ advertiser_details: { id, name } });
    });

    it('should render the Block button if advertiser is not blocked and call onClickUnblock when clicked', () => {
        render(<BlockUserRow {...block_user_row_props} />);

        const block_button = screen.getByRole('button', { name: 'Block' });

        expect(block_button).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Unblock' })).not.toBeInTheDocument();

        userEvent.click(block_button);

        expect(mock_store.my_profile_store.onClickUnblock).toBeCalledWith(block_user_row_props.row);
    });

    it('should render the Unblock button if advertiser is blocked and call onClickUnblock when clicked', () => {
        block_user_row_props.row.is_blocked = 1;

        render(<BlockUserRow {...block_user_row_props} />);

        const unblock_button = screen.getByRole('button', { name: 'Unblock' });

        expect(unblock_button).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Block' })).not.toBeInTheDocument();

        userEvent.click(unblock_button);

        expect(mock_store.my_profile_store.onClickUnblock).toBeCalledWith(block_user_row_props.row);
    });
});
