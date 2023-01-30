import React from 'react';
import { render, screen } from '@testing-library/react';
import { OpenPositionsTable } from '../open-positions';
import { isMobile } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

describe('OpenPositionsTable', () => {
    it('should render "Loading" component when "is_loading" property is passed and it\'s value is "true"', () => {
        render(<OpenPositionsTable is_loading />);
        expect(screen.getByTestId('dt_loading_component')).toBeInTheDocument();
    });

    it('should render "DataTable" component and it\'s properties when "is_loading" property is "false" and the "currency" property is passed in the "desktop" view', () => {
        render(<OpenPositionsTable currency='USD' active_positions={[100]} columns={[]} className='test-class' />);
        expect(screen.getByTestId('dt_data_table')).toBeInTheDocument();
        expect(screen.getByTestId('dt_data_table')).toHaveClass('test-class');
    });

    it('should render "DataList" component and it\'s properties when "is_loading" property is "false" and the "currency" property is passed in the "mobile" view', () => {
        isMobile.mockReturnValue(true);
        render(<OpenPositionsTable currency='USD' active_positions={[100]} columns={[]} className='test-class' />);
        expect(screen.getByTestId('dt_data_list')).toBeInTheDocument();
        expect(screen.getByTestId('dt_data_list')).toHaveClass('test-class');
    });
});
