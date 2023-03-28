import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TradeTypeTabs from '../trade-type-tabs';
import { useStore } from '@deriv/stores';

const mocked_root_store: Partial<ReturnType<typeof useStore>> = {
    modules: {
        trade: {
            contract_type: 'turboslong',
            onChange: jest.fn(() => {
                if (mocked_root_store.modules) {
                    mocked_root_store.modules.trade.contract_type = 'turbosshort';
                }
            }),
            vanilla_trade_type: '',
        },
    },
};

jest.mock('@deriv/stores', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    observer: <T,>(Component: T) => Component,
    useStore: () => mocked_root_store,
}));

describe('Trade Type Tabs', () => {
    it('should render Long & Short tabs when contract_type is turboslong', () => {
        render(<TradeTypeTabs />);
        const long_tab = screen.getByText('Long');
        const short_tab = screen.getByText('Short');
        [long_tab, short_tab].forEach(tab => {
            expect(tab).toBeInTheDocument();
        });
    });

    it('should not render if contract_type is other than turbosshort or turboslong', () => {
        if (mocked_root_store.modules) {
            mocked_root_store.modules.trade.contract_type = 'invalid_type';
        }
        render(<TradeTypeTabs />);
        const long_tab = screen.queryByText('Long');
        const short_tab = screen.queryByText('Short');
        [long_tab, short_tab].forEach(tab => {
            expect(tab).not.toBeInTheDocument();
        });
    });

    it('should call onChange when a tab is clicked', () => {
        if (mocked_root_store.modules) {
            mocked_root_store.modules.trade.contract_type = 'turboslong';
        }
        render(<TradeTypeTabs />);

        const short_tab = screen.getByText('Short');
        userEvent.click(short_tab);

        expect(mocked_root_store.modules?.trade.contract_type).toBe('turbosshort');
    });
});
