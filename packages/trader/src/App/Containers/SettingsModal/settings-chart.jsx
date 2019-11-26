import { Checkbox, RadioGroup }          from 'deriv-components';
import PropTypes                         from 'prop-types';
import React                             from 'react';
import { localize, Localize }            from 'deriv-translations';
import { connect }                       from 'Stores/connect';
import MediaItem, {
    MediaHeading,
    MediaIcon,
    MediaDescription,
}                                        from 'App/Components/Elements/Media';
import ChartPositionEnabledLightIcon     from 'Assets/SvgComponents/settings/bottom.svg';

// TODO: enable asset information
// import OHLCDisabledLightIcon             from 'Assets/SvgComponents/settings/OHLC-disabled.svg';
// import OHLCEnabledLightIcon              from 'Assets/SvgComponents/settings/OHLC-enabled.svg';
// import OHLCDisabledDarkIcon              from 'Assets/SvgComponents/settings/dark/OHLC-disabled.svg';
// import OHLCEnabledDarkIcon               from 'Assets/SvgComponents/settings/dark/OHLC-enabled.svg';

import ChartPositionEnabledDarkIcon      from 'Assets/SvgComponents/settings/dark/bottom.svg';
import IntervalDurationDisabledDarkIcon  from 'Assets/SvgComponents/settings/dark/interval-disabled.svg';
import IntervalDurationEnabledDarkIcon   from 'Assets/SvgComponents/settings/dark/interval-enabled.svg';
import ChartPositionDisabledDarkIcon     from 'Assets/SvgComponents/settings/dark/left.svg';
import IntervalDurationDisabledLightIcon from 'Assets/SvgComponents/settings/interval-disabled.svg';
import IntervalDurationEnabledLightIcon  from 'Assets/SvgComponents/settings/interval-enabled.svg';
import ChartPositionDisabledLightIcon    from 'Assets/SvgComponents/settings/left.svg';

const ChartSettings = ({
    // TODO: enable asset information
    // is_asset_visible,
    // setAsset,
    is_countdown_visible,
    is_dark_mode,
    is_layout_default,
    setCountdown,
    setChartLayout,
}) => (
    <div className='settings-chart'>
        <MediaItem>
            <MediaHeading>
                <Localize i18n_default_text='Toolbar position' />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? ChartPositionDisabledDarkIcon : ChartPositionDisabledLightIcon}
                    enabled={is_dark_mode ? ChartPositionEnabledDarkIcon : ChartPositionEnabledLightIcon}
                    id='dt_settings_position_image'
                    is_enabled={is_layout_default}
                />
                <div className='media__form'>
                    <p><Localize i18n_default_text='Change the position of the toolbar' /></p>
                    <RadioGroup
                        items={[
                            {
                                label: <Localize i18n_default_text='Bottom' />,
                                value: true,
                                id   : 'dt_settings_bottom_radio',
                            },
                            {
                                label: <Localize i18n_default_text='Left' />,
                                value: false,
                                id   : 'dt_settings_left_radio',
                            },
                        ]}
                        name='chart_layout_default'
                        selected={is_layout_default}
                        onToggle={ (e) => {
                            e.persist();
                            setChartLayout(e.target.value === 'true');
                        } }
                    />
                </div>
            </MediaDescription>
        </MediaItem>
        {/* TODO: enable asset information
            <MediaItem>
            <MediaHeading>
                <Localize
                    i18n_default_text='Open-high-low-close <0>(OHLC) information</0>'
                    components={[ <div key={0} /> ]}
                />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? OHLCDisabledDarkIcon : OHLCDisabledLightIcon }
                    enabled={is_dark_mode ? OHLCEnabledDarkIcon : OHLCEnabledLightIcon}
                    is_enabled={is_asset_visible}
                />
                <div className='media__form'>
                    <Checkbox
                        defaultChecked={is_asset_visible}
                        label={localize('Display open-high-low-close (OHLC) information for current chart')}
                        onChange={(e) => { setAsset(e.target.checked); }}
                    />
                </div>
            </MediaDescription>
        </MediaItem> */}
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
                        onChange={(e) => { setCountdown(e.target.checked); } }
                    />
                </div>
            </MediaDescription>
        </MediaItem>
    </div>
);

ChartSettings.propTypes = {
    is_asset_visible    : PropTypes.bool,
    is_countdown_visible: PropTypes.bool,
    is_dark_mode        : PropTypes.bool,
    is_layout_default   : PropTypes.bool,
    setChartLayout      : PropTypes.func,
    toggleAsset         : PropTypes.func,
    toggleCountdown     : PropTypes.func,
};

export default connect(({ ui }) => (
    {
        is_asset_visible    : ui.is_chart_asset_info_visible,
        is_countdown_visible: ui.is_chart_countdown_visible,
        is_dark_mode        : ui.is_dark_mode_on,
        is_layout_default   : ui.is_chart_layout_default,
        setAsset            : ui.setChartAssetInfo,
        setCountdown        : ui.setChartCountdown,
        setChartLayout      : ui.setChartLayout,
    }
))(ChartSettings);
