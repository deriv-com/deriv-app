import React from 'react';
import { render, screen } from '@testing-library/react';
import MarkerSpotLabel from '../marker-spot-label.jsx';

describe('MarkerSpotLabel', () => {
    it('should have "chart-spot-label__time-value-container--top" class if no "align_label" is passed in the props', () => {
        render(<MarkerSpotLabel />);
        expect(screen.getByTestId('dt_time_value_container')).toHaveClass(
            'chart-spot-label__time-value-container--top'
        );
    });

    it('should have "chart-spot-label__time-value-container--bottom" class if "align_label" "bottom" is passed in the props', () => {
        render(<MarkerSpotLabel align_label='bottom' />);
        expect(screen.getByTestId('dt_time_value_container')).toHaveClass(
            'chart-spot-label__time-value-container--bottom'
        );
    });

    it('should have "chart-spot-label__value-container--won" class if "status" "won" is passed in the props', () => {
        render(<MarkerSpotLabel status='won' />);
        expect(screen.getByTestId('dt_value_container')).toHaveClass('chart-spot-label__value-container--won');
    });

    it('should have "chart-spot-label__value-container--lost" class if "status" "lost" is passed in the props', () => {
        render(<MarkerSpotLabel status='lost' />);
        expect(screen.getByTestId('dt_value_container')).toHaveClass('chart-spot-label__value-container--lost');
    });

    it('should render "spot_value" with the correct commas if it is passed in the props', () => {
        render(<MarkerSpotLabel spot_value={290787} />);
        expect(screen.getByText('290,787')).toBeInTheDocument();
    });

    it('should render "spot_epoch" with the correct format if it is passed in the props', () => {
        render(<MarkerSpotLabel spot_epoch={22} />);
        expect(screen.getByText('00:00:22')).toBeInTheDocument();
    });

    it('should "HoverToggle" if "has_hover_toggle" is passed in the props', async () => {
        render(<MarkerSpotLabel has_hover_toggle />);
        expect(screen.getByTestId('dt_marker_hover_container')).toBeInTheDocument();
    });

    it('should not "HoverToggle" if "has_hover_toggle" is not passed in the props', () => {
        render(<MarkerSpotLabel />);
        expect(screen.queryByTestId('dt_marker_hover_container')).not.toBeInTheDocument();
    });
});
