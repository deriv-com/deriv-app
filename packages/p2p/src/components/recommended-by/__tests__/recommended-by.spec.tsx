import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import RecommendedBy from '../recommended-by';
import { useDevice } from '@deriv-com/ui';

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn().mockReturnValue({
        showModal: jest.fn(),
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: true }),
}));

describe('<RecommendedBy />', () => {
    it('it should show `No one has recommended this trader yet` and `recommended_average` equals to 0% if there is no props passed', () => {
        render(<RecommendedBy />);
        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        expect(screen.getByText('No one has recommended this trader yet')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('it should show `Recommended by 1 trader` and `recommended_average` equals to 100%', () => {
        render(<RecommendedBy recommended_count={1} recommended_average={100} />);
        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        expect(screen.getByText('Recommended by 1 trader')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('it should show `Recommended by 2 traders` and `recommended_average` equals to 50%', () => {
        render(<RecommendedBy recommended_count={2} recommended_average={50} />);
        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        expect(screen.getByText('Recommended by 2 traders')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should call showModal function in mobile view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        const { showModal } = useModalManagerContext();

        render(<RecommendedBy recommended_count={2} recommended_average={50} />);
        userEvent.click(screen.getByTestId('dt_popover_wrapper'));
        expect(showModal).toHaveBeenCalled();
    });
});
