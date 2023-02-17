import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MissingRealAccount from '../missing-real-account';

describe('<MissingRealAccount />', () => {
    const props = {
        onClickSignup: jest.fn(),
        platform: 'mt5',
    };
    it('should show "You need a real account (fiat currency or cryptocurrency) in Deriv to create a real Deriv MT5 account." when platform="mt5"', () => {
        render(<MissingRealAccount {...props} />);
        expect(
            screen.getByText(
                /You need a real account \(fiat currency or cryptocurrency\) in Deriv to create a real deriv mt5 account./i
            )
        ).toBeInTheDocument();
    });

    it('should show "To create a Deriv X real account, create a Deriv real account first." when platform="dxtrade', () => {
        render(<MissingRealAccount {...props} platform='dxtrade' />);
        expect(
            screen.getByText(/To create a Deriv X real account, create a Deriv real account first./i)
        ).toBeInTheDocument();
    });

    it('should be ', async () => {
        render(<MissingRealAccount {...props} />);
        fireEvent.click(screen.getByText(/Create a Deriv account/i));
        expect(props.onClickSignup).toHaveBeenCalled();
    });
});
