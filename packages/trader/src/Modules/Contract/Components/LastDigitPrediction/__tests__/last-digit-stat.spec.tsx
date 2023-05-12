import React from 'react';
import { screen, render } from '@testing-library/react';
import LastDigitStat from '../last-digit-stat';

const mocked_props: React.ComponentProps<typeof LastDigitStat> = {
    is_max: true,
    is_min: true,
    percentage: 100,
};
const progress_bg_test_id = 'dt_progress_bg';
const progress_value_test_id = 'dt_progress_value';

describe('<LastDigitStat />', () => {
    it('should render progress_value circle if percentage is not null', () => {
        render(<LastDigitStat {...mocked_props} />);
        expect(screen.getByTestId(progress_value_test_id)).toBeInTheDocument();
    });
    it('should have --is-max and --is-min classnames if is_max and is_min are true', () => {
        render(<LastDigitStat {...mocked_props} />);
        expect(screen.getByTestId(progress_value_test_id)).toHaveClass('progress__value--is-max');
        expect(screen.getByTestId(progress_value_test_id)).toHaveClass('progress__value--is-min');
    });
    it('should only render progress_bg circle if precentage is null', () => {
        mocked_props.percentage = null;
        render(<LastDigitStat {...mocked_props} />);
        expect(screen.getByTestId(progress_bg_test_id)).toBeInTheDocument();
        expect(screen.queryByTestId(progress_value_test_id)).not.toBeInTheDocument();
    });
});
