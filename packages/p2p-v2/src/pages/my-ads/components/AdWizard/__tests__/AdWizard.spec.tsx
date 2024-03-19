import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import AdWizard from '../AdWizard';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

const mockUseDevice = useDevice as jest.Mock;

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    FormProgress: () => <div>FormProgress</div>,
}));

jest.mock('../../AdTypeSection', () => ({
    AdTypeSection: () => <div>AdTypeSection</div>,
}));

jest.mock('../../AdProgressBar', () => ({
    AdProgressBar: () => <div>AdProgressBar</div>,
}));

const mockProps = {
    currency: 'usd',
    localCurrency: 'usd',
    rateType: 'float',
    steps: [{ header: { title: 'step 1' } }, { header: { title: 'step 2' } }, { header: { title: 'step 3' } }],
};

describe('AdWizard', () => {
    it('should render the ad wizard component', () => {
        render(<AdWizard {...mockProps} />);
        expect(screen.getByText('FormProgress')).toBeInTheDocument();
    });
    it('should render the AdProgressBar component', () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(<AdWizard {...mockProps} />);
        expect(screen.getByText('AdProgressBar')).toBeInTheDocument();
    });
});
