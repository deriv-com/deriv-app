import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaItem from '../media-item';
import { MediaHeading, MediaDescription, MediaIcon } from 'App/Components/Elements/Media';
// import { MediaHeading } from '../media-heading';
// import { MediaDescription } from '../media-description';
// import { MediaIcon } from '../media-icon';
import IntervalDurationDisabledLightIcon from 'Assets/SvgComponents/settings/interval-disabled.svg';
import IntervalDurationEnabledLightIcon from 'Assets/SvgComponents/settings/interval-enabled.svg';

const test_children = 'Test Children';
const mock_props = {
    disabled: IntervalDurationDisabledLightIcon,
    enabled: IntervalDurationEnabledLightIcon,
    id: 'test_id',
    is_enabled: true,
};

describe('MediaItem', () => {
    it('should render children inside of proper MediaItem div container with className', () => {
        render(<MediaItem>{test_children}</MediaItem>);
        const test_props_children = screen.getByText(test_children);

        expect(test_props_children).toBeInTheDocument();
        expect(test_props_children).toHaveClass('media');
    });
});

describe('MediaHeading', () => {
    it('should render children inside of proper MediaHeading div container with className', () => {
        render(<MediaHeading>{test_children}</MediaHeading>);
        const test_props_children = screen.getByText(test_children);

        expect(test_props_children).toBeInTheDocument();
        expect(test_props_children).toHaveClass('media__heading');
    });
});

describe('MediaDescription', () => {
    it('should render children inside of proper MediaDescription div container with className', () => {
        render(<MediaDescription>{test_children}</MediaDescription>);
        const test_props_children = screen.getByText(test_children);

        expect(test_props_children).toBeInTheDocument();
        expect(test_props_children).toHaveClass('media__description');
    });
});

describe('MediaIcon', () => {
    it('should render MediaIcon component', () => {
        const { container } = render(<MediaIcon {...mock_props} />);

        expect(container).not.toBeEmptyDOMElement();
    });
});
