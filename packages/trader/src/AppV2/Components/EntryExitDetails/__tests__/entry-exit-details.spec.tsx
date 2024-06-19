import React from 'react';
import { render, screen } from '@testing-library/react';
import EntryExitDetails from '../entry-exit-details';
import { TContractInfo, mockContractInfo } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    addComma: jest.fn(value => value.toString()),
    getEndTime: jest.fn(() => 1623441600),
    formatDate: jest.fn(() => '12/1/23'),
    formatTime: jest.fn(() => '12:23'),
}));

const mock_contract_info: TContractInfo = mockContractInfo({
    entry_tick_time: 1622505600,
    entry_spot_display_value: '100',
    exit_tick_time: 1623441400,
    date_start: 1622505600,
    exit_tick_display_value: '150',
});

describe('EntryExitDetails component', () => {
    it('renders entry and exit details correctly', () => {
        render(<EntryExitDetails contract_info={mock_contract_info} />);

        expect(screen.getByText('Entry & exit details')).toBeInTheDocument();
        expect(screen.getByText('Start time')).toBeInTheDocument();
        expect(screen.getByText('Entry spot')).toBeInTheDocument();
        expect(screen.getByText('Exit time')).toBeInTheDocument();
        expect(screen.getByText('Exit spot')).toBeInTheDocument();
    });

    it('renders correct entry spot value', () => {
        render(<EntryExitDetails contract_info={mock_contract_info} />);

        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('renders correct exit spot value', () => {
        render(<EntryExitDetails contract_info={mock_contract_info} />);

        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('renders correct entry and exit time', () => {
        render(<EntryExitDetails contract_info={mock_contract_info} />);
        expect(screen.queryAllByText('12/1/23').length).toBeGreaterThan(0);
        expect(screen.queryAllByText('12:23').length).toBeGreaterThan(0);
    });
});
