import React from 'react';
import { fireEvent, getByText, render, screen } from '@testing-library/react';
import AlertBanner from '../alert-banner';

describe('<AlertBanner />', () => {
    it('should render the icon and message props passed for the banner', () => {
        render(<AlertBanner icon='IcAlertWarningDark' message='Alert banner test messsage.' />);
        const dt_alert_banner_icon = screen.getByTestId('dt_alert_banner_icon');
        expect(dt_alert_banner_icon).toBeInTheDocument();
        expect(screen.getByText('Alert banner test messsage.')).toBeInTheDocument();
    });
});
