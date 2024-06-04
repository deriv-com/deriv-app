import React from 'react';
import { render, screen } from '@testing-library/react';
import IconMarquee from '../IconMarquee';

const FakeIcon = (() => <div>MockedIcon</div>) as unknown as React.ComponentProps<
    typeof IconMarquee
>['icons'][number]['icon'];

describe('IconMarquee', () => {
    let mockedProps: React.ComponentProps<typeof IconMarquee>;

    beforeEach(() => {
        mockedProps = {
            iconHeight: 40,
            icons: [
                { icon: FakeIcon, key: '1' },
                { icon: FakeIcon, key: '2' },
                { icon: FakeIcon, key: '3' },
                { icon: FakeIcon, key: '4' },
            ],
            iconWidth: 40,
        };
    });

    it('should render icon marquee with icons', () => {
        render(<IconMarquee {...mockedProps} />);

        const container = screen.getByTestId('dt_icon_marquee');

        expect(container).toBeInTheDocument();
        expect(screen.getAllByText('MockedIcon')).toHaveLength(4);
    });

    it('should apply left and right shadows for icon marquee', () => {
        render(<IconMarquee {...mockedProps} hasLeftShadow hasRightShadow />);

        const leftShadow = screen.getByTestId('dt_shadow_left');
        const rightShadow = screen.getByTestId('dt_shadow_right');

        expect(leftShadow).toBeInTheDocument();
        expect(rightShadow).toBeInTheDocument();
    });
});
