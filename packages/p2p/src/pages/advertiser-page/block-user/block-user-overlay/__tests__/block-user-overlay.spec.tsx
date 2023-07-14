import React from 'react';
import { screen, render } from '@testing-library/react';
import BlockUserOverlay from '../block-user-overlay';
import { useStores } from 'Stores';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    advertiser_page_store: {
        advertiser_details_name: 'user xyz',
        is_counterparty_advertiser_blocked: true,
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

const props = {
    is_visible: true,
    onClickUnblock: jest.fn(),
};

describe('<BlockUserOverlay />', () => {
    it('Should render the children components passed to it', () => {
        render(
            <BlockUserOverlay {...props}>
                <div>Test children</div>
            </BlockUserOverlay>
        );

        expect(screen.getByText('Test children')).toBeInTheDocument();
    });
    it('Should show overlay if user has blocked the advertiser', () => {
        render(
            <BlockUserOverlay {...props}>
                <div>Test children</div>
            </BlockUserOverlay>
        );

        expect(screen.getByText('You have blocked user xyz.')).toBeInTheDocument();
        const unblock_button = screen.getByRole('button', { name: 'Unblock' });
        expect(unblock_button).toBeInTheDocument();
    });
    it('Should not show overlay if user has not blocked the advertiser', () => {
        const new_props = { ...props, is_visible: false };
        render(
            <BlockUserOverlay {...new_props}>
                <div>Test children</div>
            </BlockUserOverlay>
        );

        expect(screen.queryByText('You have blocked user xyz.')).not.toBeInTheDocument();
    });
});
