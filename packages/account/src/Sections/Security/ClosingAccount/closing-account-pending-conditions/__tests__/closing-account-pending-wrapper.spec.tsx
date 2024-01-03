import React from 'react';
import { render, screen } from '@testing-library/react';
import ClosingAccountPendingWrapper from '../closing-account-pending-wrapper';

describe('ClosingAccountPendingWrapper', () => {
    const mock_props: React.ComponentProps<typeof ClosingAccountPendingWrapper> = {
        title: <span>mock_title</span>,
    };
    it('should render the ClosingAccountPendingWrapper component', () => {
        render(<ClosingAccountPendingWrapper {...mock_props} />);
        expect(screen.getByText('mock_title')).toBeInTheDocument();
    });

    it('should render the ClosingAccountPendingWrapper component with description', () => {
        render(<ClosingAccountPendingWrapper {...mock_props} description={<div>mock_description</div>} />);
        expect(screen.getByText('mock_description')).toBeInTheDocument();
    });

    it('should render the children', () => {
        render(
            <ClosingAccountPendingWrapper {...mock_props}>
                <div>mock_children</div>
            </ClosingAccountPendingWrapper>
        );
        expect(screen.getByText('mock_children')).toBeInTheDocument();
    });
});
