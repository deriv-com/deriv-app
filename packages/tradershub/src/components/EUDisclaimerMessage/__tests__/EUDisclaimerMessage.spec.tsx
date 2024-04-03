import React from 'react';
import { render, screen } from '@testing-library/react';
import EUDisclaimerMessage from '../EUDisclaimerMessage';

describe('EUDisclaimerMessage component', () => {
    it('should render the EU disclaimer message correctly', () => {
        render(<EUDisclaimerMessage />);

        expect(
            screen.getByText(
                /The products offered on our website are complex derivative products that carry a significant risk of potential loss. CFDs are complex instruments with a high risk of losing money rapidly due to leverage. 70.1% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how these products work and whether you can afford to take the high risk of losing your money./i
            )
        ).toBeInTheDocument();
    });
});
