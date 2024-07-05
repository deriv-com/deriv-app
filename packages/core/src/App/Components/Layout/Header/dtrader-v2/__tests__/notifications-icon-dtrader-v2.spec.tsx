import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationsIconDTraderV2 from '../notifications-icon-dtrader-v2';

describe('NotificationsIconDTraderV2', () => {
    const skeleton_testid = 'dt_skeleton';

    it('should render an icon instead of skeleton loader if is_loading={false}', () => {
        render(<NotificationsIconDTraderV2 />);
        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.queryByTestId(skeleton_testid)).not.toBeInTheDocument();
    });

    it('should render skeleton loader instead of an icon when is_loading={true}', () => {
        render(<NotificationsIconDTraderV2 is_loading />);
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByTestId(skeleton_testid)).toBeInTheDocument();
    });
});
