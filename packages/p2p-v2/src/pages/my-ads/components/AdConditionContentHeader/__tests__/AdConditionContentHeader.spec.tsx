import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdConditionContentHeader from '../AdConditionContentHeader';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('@/constants', () => ({
    ...jest.requireActual('@/constants'),
    AD_CONDITION_CONTENT: {
        type: {
            description: 'description',
            title: 'title',
        },
    },
}));

const mockUseDevice = useDevice as jest.Mock;

describe('AdConditionContentHeader', () => {
    it('should render the component as expected with given type', () => {
        render(<AdConditionContentHeader type='type' />);
        expect(screen.getByText('title')).toBeInTheDocument();
    });
    it('should handle clicking the tooltip icon', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<AdConditionContentHeader type='type' />);
        userEvent.click(screen.getByTestId('dt_p2p_v2_ad_condition_tooltip_icon'));
        const okButton = screen.getByRole('button', { name: 'OK' });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
    });
});
