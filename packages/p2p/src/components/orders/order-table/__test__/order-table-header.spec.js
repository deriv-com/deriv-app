import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderTableHeader from '../order-table-header.jsx';
import { Table } from '@deriv/components';
import { useStores } from 'Stores';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        general_store: {
            is_active_tab: false,
        },
    }),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Table: jest.fn(({ children }) => (
        <div>
            Table
            <div>{children}</div>
        </div>
    )),
}));

describe('<OrderTableHeader/>', () => {
    beforeAll(() => {
        Table.Body = jest.fn(() => <div>Table body</div>);
        Table.Head = jest.fn(() => <div>Table head</div>);
        Table.Header = jest.fn(({ children }) => (
            <div>
                Table header<div>{children}</div>
            </div>
        ));
        Table.Row = jest.fn(({ children }) => (
            <div>
                Table row<div>{children}</div>
            </div>
        ));
    });

    it('should render the component', () => {
        render(<OrderTableHeader />);

        expect(screen.getByText('Table')).toBeInTheDocument();
    });

    it('should contain 7 columns', () => {
        render(<OrderTableHeader />);
        screen.debug();
        expect(screen.getAllByText('Table head').length).toBe(7);
    });
});
