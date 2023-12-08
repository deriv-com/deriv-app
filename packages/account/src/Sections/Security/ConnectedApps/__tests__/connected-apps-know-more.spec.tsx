import React from 'react';
import { render, screen } from '@testing-library/react';
import ConnectedAppsKnowMore from '../connected-apps-know-more';

describe('ConnectedAppsKnowMore', () => {
    it("should render the 'Know more' section with correct details", () => {
        render(<ConnectedAppsKnowMore />);
        expect(screen.getByText(/Want to know more about APIs\?/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /Go to our Deriv community and learn about APIs, API tokens, ways to use Deriv APIs, and more./i
            )
        ).toBeInTheDocument();
    });
});
