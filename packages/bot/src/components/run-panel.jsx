import { Button, Drawer, Tabs } from 'deriv-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { IconInfoOutline } from './Icons.jsx';
import { connect } from '../stores/connect';

import '../assets/sass/run-panel.scss';

const drawerContent = () => {
    return (
        <Tabs>
            <div label='Summary' />
            <div label='Transations' />
            <div label='Journal' />
        </Tabs>
    );
};

const drawerFooter = (props) => {
    const { runBot , stopBot } = props;

    return (
        <div className='run-panel__footer'>
            <Button
                className={classNames(
                    'btn--flat',
                    'run-panel__button'
                )}
                text='Clear stat'
                onClick={stopBot}
                has_effect
            />

            <Button
                className={classNames(
                    'btn--primary',
                    'run-panel__button'
                )}
                text='Run bot'
                onClick={runBot}
                has_effect
            />

            <IconInfoOutline className='run-panel__icon-info' />
        </div>
    );
};

const RunPanel = ({
    runBot,
    stopBot,
}) => {
    const content = drawerContent();
    const footer = drawerFooter({ runBot, stopBot });

    return (
        <Drawer
            className='run-panel'
            is_open={true}
            footer={footer}
        >
            {content}
        </Drawer>
    );
};

RunPanel.propTypes = {
    runBot : PropTypes.func,
    stopBot: PropTypes.func,
};
export default connect(({ runPanel }) => ({
    runBot : runPanel.runBot,
    stopBot: runPanel.stopBot,
}))(RunPanel);
