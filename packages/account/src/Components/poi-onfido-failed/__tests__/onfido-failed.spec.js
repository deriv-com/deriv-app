import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { PlatformContext } from '@deriv/shared';

import OnfidoFailed from '../onfido-failed';

jest.mock('Components/poa-continue-trading-button/continue-trading-button.jsx', () => ({
    ContinueTradingButton: jest.fn(() => <div>ContinueTradingButton</div>),
}));

describe('<OnfidoFailed/>', () => {
    it('should render OnfidoFailed component if it is not appstore and not suspected', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <OnfidoFailed suspected={false} />
            </PlatformContext.Provider>
        );

        expect(screen.getByText('Proof of identity verification failed')).toBeInTheDocument();
        expect(screen.queryByText('We could not verify your proof of identity')).not.toBeInTheDocument();
        expect(screen.queryByText('ContinueTradingButton')).not.toBeInTheDocument();
    });
    it('should render OnfidoFailed component if it is appstore and not suspected', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <OnfidoFailed suspected={false} />
            </PlatformContext.Provider>
        );

        expect(screen.getByText('Proof of identity verification failed')).toBeInTheDocument();
        expect(screen.getByText('ContinueTradingButton')).toBeInTheDocument();
        expect(screen.getByText('Proof of identity verification failed')).toBeInTheDocument();
    });
    it.only('should render OnfidoFailed component if it is appstore and suspected', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <OnfidoFailed suspected={true} />
            </PlatformContext.Provider>
        );

        screen.debug();
        // expect(screen.getByText('We could not verify your proof of identity')).toBeInTheDocument();
        // expect(screen.getByText('ContinueTradingButton')).toBeInTheDocument();
        // expect(screen.getByText('Proof of identity verification failed')).toBeInTheDocument();
    });
});
