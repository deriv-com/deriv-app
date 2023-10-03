import React from 'react';
import { screen, render } from '@testing-library/react';
import Digit from '../digit';

const mocked_props: React.ComponentProps<typeof Digit> = {
    percentage: 50,
    value: 8,
};

const mocked_percentage = `${mocked_props.percentage}%`;
const mocked_value = mocked_props.value;

describe('<Digit />', () => {
    it('should render value and percentage', () => {
        render(<Digit {...mocked_props} />);
        expect(screen.getByText(mocked_percentage)).toBeInTheDocument();
        expect(screen.getByText(mocked_percentage)).toHaveClass('digits__digit-display-percentage');
        expect(screen.getByText(mocked_value)).toBeInTheDocument();
        expect(screen.getByText(mocked_value)).toHaveClass('digits__digit-display-value');
    });
    it('should not render percentage when percentage is null', () => {
        mocked_props.percentage = null;
        render(<Digit {...mocked_props} />);
        expect(screen.queryByText(mocked_percentage)).not.toBeInTheDocument();
    });
});
