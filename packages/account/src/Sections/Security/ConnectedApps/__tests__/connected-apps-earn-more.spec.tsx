import React from 'react';
import { render, screen } from '@testing-library/react';
import ConnectedAppsEarnMore from '../connected-apps-earn-more';

describe('ConnectedAppsEarnMore', () => {
    it("should render the 'Earn more' section with correct details", () => {
        render(<ConnectedAppsEarnMore />);
        expect(screen.getByText(/Earn more with Deriv API/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /Use our powerful, flexible, and free API to build a custom trading platform for yourself or for your business./i
            )
        ).toBeInTheDocument();
    });
});
