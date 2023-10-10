import React from 'react';
import { render, screen } from '@testing-library/react';
import { MediaIcon } from 'App/Components/Elements/Media';

const test_disabled = 'Interval Duration Disabled Light Icon';
const test_enabled = 'Interval Duration Enabled Light Icon';
const mock_props = {
    disabled: jest.fn(() => <div>{test_disabled}</div>),
    enabled: jest.fn(() => <div>{test_enabled}</div>),
    id: 'test_id',
    is_enabled: true,
};

describe('MediaIcon', () => {
    it('should render MediaIcon component with enabled SVG if is_enabled === true', () => {
        render(<MediaIcon {...mock_props} />);

        expect(screen.getByText(test_enabled)).toBeInTheDocument();
    });
    it('should render MediaIcon component with disabled SVG if is_enabled === false', () => {
        render(<MediaIcon {...mock_props} is_enabled={false} />);

        expect(screen.getByText(test_disabled)).toBeInTheDocument();
    });
});
