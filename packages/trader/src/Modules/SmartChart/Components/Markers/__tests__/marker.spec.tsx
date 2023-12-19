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
    const start_time = 'Start Time';
    const entry_spot_classname = 'chart-spot__entry';
    const ContentComponent = jest.fn((props: TMarkerContentConfig) => (
        <div data-testid={props.className} aria-label={props.label} />
    ));

    it('should render correctly & pass marker_content_props to the child with both coordinates', async () => {
        const passthrough_props = {
            className: entry_spot_classname,
        };
        render(
            <ChartMarker
                marker_config={{
                    ContentComponent,
                    x: 1702561947,
                    y: '1966.66',
                }}
                marker_content_props={passthrough_props}
            />
        );
        expect(screen.getByTestId(entry_spot_classname)).toBeInTheDocument();
        expect(ContentComponent).toHaveBeenCalledWith(passthrough_props, {});
    });
    it('should render correctly & pass marker_content_props to the child when y coordinate is null', async () => {
        const passthrough_props = {
            line_style: 'solid',
            label: start_time,
            marker_config: {},
        };
        render(
            <ChartMarker
                marker_config={{
                    ContentComponent,
                    className: 'chart-marker-line',
                    x: 1702561946,
                    y: null,
                }}
                marker_content_props={passthrough_props}
            />
        );
        expect(screen.getByLabelText(start_time)).toBeInTheDocument();
        expect(ContentComponent).toHaveBeenCalledWith(passthrough_props, {});
    });
});
