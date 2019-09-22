import { Button, Drawer, Tabs } from 'deriv-components';
import classNames               from 'classnames';
import React                    from 'react';
import { IconInfoOutline }      from './icons.jsx';
import Summary                  from './summary.jsx';
import                               '../assets/sass/run-panel.scss';

const onRunBotClick = () => {
    Blockly.BLOCKLY_CLASS_OLD.run();
};

const drawerContent = () => {
    return (
        <Tabs>
            <div label='Summary'>
                <Summary />
            </div>
            <div label='Transactions' />
            <div label='Journal' />
        </Tabs>
    );
};

const drawerFooter = (props) => {
    return (
        <div className='run-panel__footer'>
            <Button
                className={classNames(
                    'btn--flat',
                    'run-panel__button'
                )}
                text='Clear stat'
                onClick={props.onClick}
                has_effect
            />

            <Button
                className={classNames(
                    'btn--primary',
                    'run-panel__button'
                )}
                text='Run bot'
                onClick={props.onClick}
                has_effect
            />
        
            <IconInfoOutline className='run-panel__icon-info' />
        </div>
    );
};

const RunPanel = () => {
    const content = drawerContent();
    const footer = drawerFooter({ onClick: onRunBotClick });

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

export default RunPanel;
