import React from 'react';
import { render, screen } from '@testing-library/react';
import AdPaymentSelectionText from '../ad-payment-selection-text';

describe('<AdPaymentSelectionText/>', () => {
    it('should render component for buy advert', () => {
        render(<AdPaymentSelectionText is_sell_advert={false} />);

        expect(screen.getByText('You may choose up to 3.')).toBeInTheDocument();
    });
    it('should render component for sell advert', () => {
        render(<AdPaymentSelectionText is_sell_advert />);

        expect(screen.getByText('You may tap and choose up to 3.')).toBeInTheDocument();
    });
});
