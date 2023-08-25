import React from 'react';
import { render, screen } from '@testing-library/react';
import AlertBanner from '../alert-banner';

describe('<AlertBanner />', () => {
    it('should render the icon and message props passed for the banner', () => {
        const props: React.ComponentProps<typeof AlertBanner> = {
            icon: 'IcAlertWarningDark',
            message: 'Alert banner test message.',
        };
        render(<AlertBanner {...props} />);
        const dt_alert_banner_icon = screen.getByTestId('dt_alert_banner_icon');
        expect(dt_alert_banner_icon).toBeInTheDocument();
        expect(screen.getByText(props.message)).toBeInTheDocument();
    });
});
