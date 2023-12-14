import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartMarker, { TMarkerContentConfig } from '../marker';

jest.mock('Modules/SmartChart', () => ({
    FastMarker: jest.fn(({ children, markerRef }) => (
        <div
            ref={() =>
                markerRef({
                    div: {
                        style: {
                            height: '',
                            zIndex: '',
                        },
                    },
                    setPosition: jest.fn(),
                })
            }
        >
            {children}
        </div>
    )),
}));

describe('ChartMarker', () => {
    const ContentComponent = (props: TMarkerContentConfig) => <div>{JSON.stringify(props)}</div>;
    const test_marker_config_1 = {
        ContentComponent,
        className: 'chart-marker-line',
        x: 1702561946,
        y: null,
    };
    const test_marker_config_2 = {
        ContentComponent,
        x: 1702561947,
        y: '1966.66',
    };
    const marker_content_props = {
        line_style: 'solid',
        label: 'Start Time',
    };
    const props: React.ComponentProps<typeof ChartMarker> = {
        marker_config: test_marker_config_1,
        marker_content_props,
        is_bottom_widget_visible: false,
    };
    it('should render without y coordinate', async () => {
        render(<ChartMarker {...props} />);
        expect(screen.getByText('{"line_style":"solid","label":"Start Time"}')).toBeInTheDocument();
    });
    it('should render with y coordinate', async () => {
        render(<ChartMarker {...props} marker_config={test_marker_config_2} />);
        expect(screen.getByText('{"line_style":"solid","label":"Start Time"}')).toBeInTheDocument();
    });
});
