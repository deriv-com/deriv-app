import React from 'react';
import PropTypes from 'prop-types';
import Toolbox from 'Components/toolbox';
import Flyout from 'Components/flyout';
import Chart from 'Components/chart';
import { tabs_title } from 'Constants/bot-contents';
import { connect } from 'Stores/connect';

const MainContentContainer = ({ active_tab, is_loading }) => {
    if (is_loading) return null;

    return (
        <React.Fragment>
            {Blockly.derivWorkspace && (
                <React.Fragment>
                    {active_tab === tabs_title.WORKSPACE && (
                        <React.Fragment>
                            <Toolbox />
                            <Flyout />
                        </React.Fragment>
                    )}
                    {active_tab === tabs_title.CHART && (
                        <div className='bot__chart-container-wrapper'>
                            <div
                                className='bot__chart-container'
                                style={{
                                    width: 'var(--bot-content-width)',
                                    height: 'var(--bot-content-height)',
                                }}
                            >
                                <Chart />
                            </div>
                        </div>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

const MainContent = ({ active_tab, is_loading, onMount, onUnmount }) => {
    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    return (
        <div
            id='scratch_div'
            style={{
                width: '100vw',
                height: 'var(--bot-content-height)',
            }}
        >
            <MainContentContainer active_tab={active_tab} is_loading={is_loading} />
        </div>
    );
};

MainContent.propTypes = {
    active_tab: PropTypes.string,
    is_loading: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
};

export default connect(({ blockly_store, main_content }) => ({
    active_tab: main_content.active_tab,
    is_loading: blockly_store.is_loading,
    onMount: main_content.onMount,
    onUnmount: main_content.onUnmount,
}))(MainContent);
