import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TCFDPlatform } from '../props.types';
import CFDDxtradeDemoAccountDisplay from '../cfd-dxtrade-demo-account-display';

const mocked_props = {
    has_cfd_account_error: false,
    standpoint: {} as React.ComponentProps<typeof CFDDxtradeDemoAccountDisplay>['standpoint'],
    is_loading: false,
    is_logged_in: true,
    onSelectAccount: jest.fn(),
    openAccountTransfer: jest.fn(),
    platform: 'dxtrade' as TCFDPlatform,
    current_list: { 'dxtrade.demo.dxtrade': { enabled: 1 } },
    openPasswordManager: jest.fn(),
};

jest.mock('../../templates/_common/components/loading', () => jest.fn(() => <div>Loading</div>));
jest.mock('../cfd-account-card', () => ({
    ...jest.requireActual('../cfd-account-card'),
    CFDAccountCard: props => (
        <div>
            <p>CFDAccountCard</p>
            <button onClick={props.onSelectAccount}>onSelectAccount button</button>
            <button onClick={props.onClickFund}>onClickFund button</button>
        </div>
    ),
}));

describe('<CFDDxtradeDemoAccountDisplay />', () => {
    it('should render Loader if is_loading === true', () => {
        render(<CFDDxtradeDemoAccountDisplay {...mocked_props} is_loading />);

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
        expect(screen.queryByText(/CFDAccountCard/i)).not.toBeInTheDocument();
    });

    it('should render CFDAccountCard if is_loading === false', () => {
        render(<CFDDxtradeDemoAccountDisplay {...mocked_props} />);

        expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        expect(screen.getByText(/CFDAccountCard/i)).toBeInTheDocument();
    });

    it('should call function onSelectAccount from props if the proper button was clicked', () => {
        render(<CFDDxtradeDemoAccountDisplay {...mocked_props} />);

        const button = screen.getByText(/onSelectAccount button/i);
        userEvent.click(button);

        expect(mocked_props.onSelectAccount).toBeCalled();
    });

    it('should call function openAccountTransfer from props if the onClickFund button was clicked', () => {
        const new_mocked_props = { ...mocked_props };
        new_mocked_props.current_list = {
            'mt5.demo.dxtrade': { enabled: 1 },
        } as unknown as typeof mocked_props['current_list'];
        render(<CFDDxtradeDemoAccountDisplay {...new_mocked_props} />);

        const button = screen.getByText(/onClickFund button/i);
        userEvent.click(button);

        expect(mocked_props.openAccountTransfer).toBeCalled();
    });
});
