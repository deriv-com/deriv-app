import React from 'react';
import { render, screen } from '@testing-library/react';
import RiskManagementContent from '../risk-management-content';

describe('RiskManagementContent', () => {
    it('should render correct description if should_show_deal_cancellation === false', () => {
        render(<RiskManagementContent />);

        expect(screen.getByText('Take Profit')).toBeInTheDocument();
        expect(screen.getByText('Stop loss')).toBeInTheDocument();
        expect(screen.queryByText('Deal cancellation')).not.toBeInTheDocument();
    });

    it('should render correct description if should_show_deal_cancellation === true', () => {
        render(<RiskManagementContent should_show_deal_cancellation />);

        expect(screen.getByText('Take Profit')).toBeInTheDocument();
        expect(screen.getByText('Stop loss')).toBeInTheDocument();
        expect(screen.getByText('Deal cancellation')).toBeInTheDocument();
    });
});
