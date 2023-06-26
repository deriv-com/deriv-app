import React from 'react';
import { render, screen } from '@testing-library/react';
import AdType from '../ad-type';

const props = {
    ad_pause_color: 'red',
    float_rate: 1,
};

describe('<AdType/>', () => {
    it('should render component with passed props', () => {
        render(<AdType {...props} />);

        const text = screen.getByText('Float');

        expect(text).toBeInTheDocument();
        expect(text).toHaveStyle('--text-color: var(--text-red)');
        expect(screen.getByText('1%')).toBeInTheDocument();
    });
});
