import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectedAppsResponsiveColumn } from '../ConnectedAppsResponsiveColumn';

describe('ConnectedAppsResponsiveColumn', () => {
    it("should render the 'ConnectedAppsResponsiveColumn' component properly", () => {
        const mockProps: React.ComponentProps<typeof ConnectedAppsResponsiveColumn> = {
            description: 'ConnectedAppsResponsiveColumn mock description',
            style: 'mockStyles',
            title: 'ConnectedAppsResponsiveColumn mock title',
        };
        render(<ConnectedAppsResponsiveColumn {...mockProps} />);

        const container = screen.getByTestId('dt_responsive_column');
        const title = screen.getByText(mockProps.title);

        if (mockProps.description) expect(screen.getByText(mockProps.description)).toBeInTheDocument();
        expect(title).toBeInTheDocument();
        expect(container).toHaveClass('mockStyles');
    });
});
