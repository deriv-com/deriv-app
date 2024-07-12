import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingDTraderV2 from '../../loading-dtrader-v2';

describe('LoadingDTraderV2', () => {
    const tabs_skeleton_testid = 'dt_tabs_skeleton';

    it('should render Trade page loader by default', () => {
        render(<LoadingDTraderV2 />);
        expect(screen.getByTestId('dt_trade_loader')).toBeInTheDocument();
    });

    it('should render Positions page loader for Open tab by default if is_positions={true}, without Tabs skeleton if initial_app_loading={false}', () => {
        render(<LoadingDTraderV2 is_positions />);
        expect(screen.getByTestId('dt_positions_loader')).toBeInTheDocument();
        expect(screen.queryByTestId(tabs_skeleton_testid)).not.toBeInTheDocument();
    });

    it('should render Positions page loader for Closed if is_positions={true} & is_closed_tab={true}, and with Tabs skeleton if initial_app_loading={true}', () => {
        render(<LoadingDTraderV2 is_positions is_closed_tab initial_app_loading />);
        expect(screen.getByTestId(tabs_skeleton_testid)).toBeInTheDocument();
    });

    it('should render Contract details page loader if is_contract_details={true}', () => {
        render(<LoadingDTraderV2 is_contract_details />);
        expect(screen.getByTestId('dt_contract_details_loader')).toBeInTheDocument();
        expect(screen.getByTestId('dt_contract_card_loader')).toBeInTheDocument();
    });
});
