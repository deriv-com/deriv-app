import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import MediaItem, { MediaHeading, MediaIcon, MediaDescription } from 'App/Components/Elements/Media';

// TODO: enable asset information
// import OHLCDisabledLightIcon             from 'Assets/SvgComponents/settings/OHLC-disabled.svg';
// import OHLCEnabledLightIcon              from 'Assets/SvgComponents/settings/OHLC-enabled.svg';
// import OHLCDisabledDarkIcon              from 'Assets/SvgComponents/settings/dark/OHLC-disabled.svg';
// import OHLCEnabledDarkIcon               from 'Assets/SvgComponents/settings/dark/OHLC-enabled.svg';

import IntervalDurationDisabledDarkIcon from 'Assets/SvgComponents/settings/dark/interval-disabled.svg';
import IntervalDurationEnabledDarkIcon from 'Assets/SvgComponents/settings/dark/interval-enabled.svg';
import IntervalDurationDisabledLightIcon from 'Assets/SvgComponents/settings/interval-disabled.svg';
import IntervalDurationEnabledLightIcon from 'Assets/SvgComponents/settings/interval-enabled.svg';

const ChartSettings = ({ is_countdown_visible, is_dark_mode, setCountdown }) => (
    <div className='settings-chart'>
        <MediaItem>
            <MediaHeading>
                <Localize i18n_default_text='Interval duration' />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? IntervalDurationDisabledDarkIcon : IntervalDurationDisabledLightIcon}
                    enabled={is_dark_mode ? IntervalDurationEnabledDarkIcon : IntervalDurationEnabledLightIcon}
                    id='dt_settings_interval_image'
                    is_enabled={is_countdown_visible}
                />
                <div className='media__form'>
                    <Checkbox
                        id='dt_settings_interval_checkbox'
                        defaultChecked={is_countdown_visible}
                        label={localize('Display remaining time for each interval')}
                        onChange={e => {
                            setCountdown(e.target.checked);
                        }}
                    />
                </div>
            </MediaDescription>
        </MediaItem>
    </div>
);

ChartSettings.propTypes = {
    is_countdown_visible: PropTypes.bool,
    is_dark_mode: PropTypes.bool,
};

export default connect(({ ui }) => ({
    is_countdown_visible: ui.is_chart_countdown_visible,
    is_dark_mode: ui.is_dark_mode_on,
    setCountdown: ui.setChartCountdown,
}))(ChartSettings);
