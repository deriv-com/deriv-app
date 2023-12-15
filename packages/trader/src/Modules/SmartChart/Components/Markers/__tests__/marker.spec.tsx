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
    it('should render without y coordinate', async () => {
        render(
            <ChartMarker
                marker_config={{
                    ContentComponent,
                    className: 'chart-marker-line',
                    x: 1702561946,
                    y: null,
                }}
                marker_content_props={{
                    line_style: 'solid',
                    label: 'Start Time',
                    marker_config: {},
                }}
            />
        );
        expect(screen.getByText('{"line_style":"solid","label":"Start Time","marker_config":{}}')).toBeInTheDocument();
    });
    it('should render with y coordinate', async () => {
        render(
            <ChartMarker
                marker_config={{
                    ContentComponent,
                    x: 1702561947,
                    y: '1966.66',
                }}
                marker_content_props={{
                    className: 'chart-spot__entry',
                }}
            />
        );
        expect(screen.getByText('{"className":"chart-spot__entry"}')).toBeInTheDocument();
    });
});
