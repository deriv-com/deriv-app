import React from 'react';
import { render, screen } from '@testing-library/react';
import DTraderV2HeaderLoader from '../dtrader-v2-header-loader';

describe('DTraderV2HeaderLoader', () => {
    const skeleton_testid = 'dt_skeleton';

    it('should render with two skeletons by default', () => {
        render(<DTraderV2HeaderLoader />);
        expect(screen.getByTestId('dt_header_loader')).toBeInTheDocument();
        expect(screen.getAllByTestId(skeleton_testid)).toHaveLength(2);
    });

    it('should render with only one skeleton if show_notifications_skeleton={false}', () => {
        render(<DTraderV2HeaderLoader show_notifications_skeleton={false} />);
        expect(screen.getByTestId(skeleton_testid)).toBeInTheDocument();
    });
});
