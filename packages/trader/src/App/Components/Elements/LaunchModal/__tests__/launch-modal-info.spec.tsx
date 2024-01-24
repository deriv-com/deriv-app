import React from 'react';
import LaunchModalInfo from '../launch-modal-info';
import { render, screen } from '@testing-library/react';

jest.mock('Assets/SvgComponents/trade_explanations/img-turbos.svg', () => jest.fn(() => <div>Turbos Image</div>));

describe('<LaunchModalInfo />', () => {
    it('should render component', () => {
        render(<LaunchModalInfo is_mobile />);

        expect(screen.getByText('Turbos Image')).toBeInTheDocument();
        expect(screen.getByText('Turbos — a new trade type for you!')).toBeInTheDocument();
    });
});
