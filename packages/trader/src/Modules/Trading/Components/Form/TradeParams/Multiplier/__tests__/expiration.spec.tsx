import React from 'react';
import moment from 'moment';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import Expiration from '../expiration';
import TraderProviders from '../../../../../../../trader-providers';

const expiry_date = '28 Nov 2023 at 11:04';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getDateFromNow: jest.fn(() => '28 Nov 2023'),
}));

describe('<Expiration />', () => {
    let default_mocked_store: ReturnType<typeof mockStore>,
        default_mocked_props: React.ComponentProps<typeof Expiration>;

    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({}),
            modules: {
                trade: {
                    expiration: 1701215999,
                },
            },
            common: {
                ...mockStore({}).common,
                server_time: moment('2023-11-21T12:55:10.488Z'),
            },
        };
        default_mocked_props = { is_text_only: true, text_size: '14' };
    });

    const mockExpiration = () => {
        return (
            <TraderProviders store={default_mocked_store}>
                <Expiration {...default_mocked_props} />
            </TraderProviders>
        );
    };

    it('should render only text about date of expiry if is_text_only === true', () => {
        render(mockExpiration());

        expect(screen.getByText(expiry_date)).toBeInTheDocument();
        expect(screen.queryByText('Expires on')).not.toBeInTheDocument();
    });
    it('should render dash instead of date of expiry if is_text_only === true and expiration is falsy', () => {
        default_mocked_store.modules.trade.expiration = undefined;
        render(mockExpiration());

        expect(screen.getByText('-')).toBeInTheDocument();
        expect(screen.queryByText(expiry_date)).not.toBeInTheDocument();
    });
    it('should render fieldset component with date of expiry if is_text_only === false', () => {
        default_mocked_props.is_text_only = false;
        render(mockExpiration());

        expect(screen.getByText('Expires on')).toBeInTheDocument();
        expect(screen.getByText(expiry_date)).toBeInTheDocument();
    });
    it('should render fieldset component with dash if is_text_only === false and expiration is falsy', () => {
        default_mocked_props.is_text_only = false;
        default_mocked_store.modules.trade.expiration = undefined;
        render(mockExpiration());

        expect(screen.getByText('Expires on')).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
        expect(screen.queryByText(expiry_date)).not.toBeInTheDocument();
    });
});
