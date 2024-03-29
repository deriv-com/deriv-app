import React from 'react';
import { AdConditionsModal } from '@/components/Modals';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdConditionContentHeader from '../AdConditionContentHeader';

// const mockAdConditionsModal = AdConditionsModal as jest.Mock;

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
    it('should handle hovering over the tooltip', () => {
        render(<AdConditionContentHeader type='type' />);
        const element = screen.getByTestId('dt_p2p_v2_ad_condition_tooltip_icon');
        userEvent.hover(element);
        expect(screen.getByText('description')).toBeInTheDocument();
    });
    it('should not call setIsModalOpen when not on mobile', () => {
        render(<AdConditionContentHeader type='type' />);
        userEvent.click(screen.getByTestId('dt_p2p_v2_ad_condition_tooltip_icon'));
        expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
    });
    it('should handle clicking the tooltip icon on mobile', () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<AdConditionContentHeader type='type' />);
        userEvent.click(screen.getByTestId('dt_p2p_v2_ad_condition_tooltip_icon'));
        const okButton = screen.getByRole('button', { name: 'OK' });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
    });
});
