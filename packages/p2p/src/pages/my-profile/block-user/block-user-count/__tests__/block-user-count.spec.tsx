import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isMobile } from '@deriv/shared';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import BlockUserCount from '../block-user-count';

const mock_modal_manager = {
    showModal: jest.fn(),
    hideModal: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context');
const mocked_useModalManagerContext = useModalManagerContext as jest.MockedFunction<
    () => Partial<ReturnType<typeof useModalManagerContext>>
>;

mocked_useModalManagerContext.mockImplementation(() => mock_modal_manager);

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        user_blocked_count: 0,
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

const props = {
    is_visible: true,
    onClickUnblock: jest.fn(),
};

describe('<BlockUserCount />', () => {
    it('Should show 0 blocked count and "nobody has blocked you" label when user is not blocked by any other counterparties', () => {
        render(<BlockUserCount />);

        const blocked_count = screen.getByText('0');
        expect(blocked_count).toBeInTheDocument();
        userEvent.hover(blocked_count);
        expect(screen.getByText('Nobody has blocked you. Yay!')).toBeInTheDocument();
    });
    it('Should show 1 blocked count when user is blocked by 1 counterparty', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                user_blocked_count: 1,
            },
        });
        render(<BlockUserCount />);

        const blocked_count = screen.getByText('1');
        expect(blocked_count).toBeInTheDocument();
        userEvent.hover(blocked_count);
        expect(screen.getByText('1 person has blocked you')).toBeInTheDocument();
    });
    it('Should show blocked count and "n people have blocked you" where n is more than 1 when user is blocked by many counterparties', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                user_blocked_count: 5,
            },
        });
        render(<BlockUserCount />);

        const blocked_count = screen.getByText('5');
        expect(blocked_count).toBeInTheDocument();
        userEvent.hover(blocked_count);
        expect(screen.getByText('5 people have blocked you')).toBeInTheDocument();
    });
    it('Should open blocked user count modal when clicking on blocked count icon in mobile view', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                user_blocked_count: 5,
            },
        });
        (isMobile as jest.Mock).mockReturnValue(true);
        render(<BlockUserCount />);

        const blocked_count = screen.getByTestId('dt_block_user_count');
        userEvent.click(blocked_count);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'BlockedCountModal', props: {} });
    });
});
