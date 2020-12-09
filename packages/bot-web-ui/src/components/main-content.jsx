import React from 'react';
import PropTypes from 'prop-types';
import Flyout from './flyout.jsx';
import Chart from './chart/chart.jsx';
import { tabs_title } from '../constants/bot-contents';
import { connect } from '../stores/connect';
import '../assets/sass/workspace.scss';
import '../assets/sass/toolbox.scss';

const MainContent = ({ active_tab, onMount, onUnmount, setContainerSize }) => {
    const current_active_tab = React.useRef(active_tab);

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    React.useEffect(() => {
        if (active_tab !== current_active_tab) {
            current_active_tab.current = active_tab;
            setContainerSize();
        }
    }, [active_tab, setContainerSize]);

    if (active_tab === tabs_title.WORKSPACE) {
        return (
            <div
                id='scratch_div'
                style={{
                    width: '100vw',
                    height: 'var(--bot-content-height)',
                }}
            >
                <Flyout />
            </div>
        );
    }

    if (active_tab === tabs_title.CHART) {
        return (
            <div
                className='bot__chart-container'
                style={{
                    width: 'var(--bot-content-width)',
                    height: 'var(--bot-content-height)',
                }}
            >
                <Chart />
            </div>
        );
    }

    return null;
};

MainContent.propTypes = {
    active_tab: PropTypes.string,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    setContainerSize: PropTypes.func,
};

export default connect(({ main_content }) => ({
    active_tab: main_content.active_tab,
    onMount: main_content.onMount,
    onUnmount: main_content.onUnmount,
    setContainerSize: main_content.setContainerSize,
}))(MainContent);
