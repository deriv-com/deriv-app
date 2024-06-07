import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConnectedAppsSidebar } from '../ConnectedAppsSidebar';

describe('ConnectedAppsSidebar', () => {
    beforeEach(() => {
        render(<ConnectedAppsSidebar />);
    });

    it("should render the 'Earn more' section with correct details", () => {
        expect(screen.getByText(/Earn more with Deriv API/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /Use our powerful, flexible, and free API to build a custom trading platform for yourself or for your business./i
            )
        ).toBeInTheDocument();
    });

    it("should render the 'Know more' section with correct details", () => {
        expect(screen.getByText(/Want to know more about APIs\?/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /Go to our Deriv community and learn about APIs, API tokens, ways to use Deriv APIs, and more./i
            )
        ).toBeInTheDocument();
    });
});
