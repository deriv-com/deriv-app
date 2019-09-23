import { Button, Drawer, Tabs } from 'deriv-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { IconInfoOutline } from './Icons.jsx';
import { connect } from '../stores/connect';
import { translate } from '../utils/tools';
import '../assets/sass/run-panel.scss';

const drawerContent = () => {
    return (
        <Tabs>
            <div label={translate('Summary')} />
            <div label={translate('Transations')} />
            <div label={translate('Journal')} />
        </Tabs>
    );
};

const drawerFooter = (props) => {
    const { is_running, onRunButtonClick } = props;

    return (
        <div className='run-panel__footer'>
            <Button
                className={classNames(
                    'btn--flat',
                    'run-panel__button'
                )}
                text={translate('Clear stat')}
                has_effect
            />

            <Button
                className={classNames(
                    'btn--primary',
                    'run-panel__button'
                )}
                onClick={onRunButtonClick}
                has_effect
            >
                {is_running ?
                    <div>
                        <IconInfoOutline />
                        <span>{translate('Stop bot')}</span>
                    </div>
                    :
                    <div>
                        <IconInfoOutline />
                        <span>{translate('Run bot')}</span>
                    </div>
                }
            </Button>

            <IconInfoOutline className='run-panel__icon-info' />
        </div>
    );
};

const RunPanel = ({
    is_running,
    onRunButtonClick,
}) => {
    const content = drawerContent();
    const footer = drawerFooter({ is_running, onRunButtonClick });

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
    contract_stage  : PropTypes.string,
    is_running      : PropTypes.bool,
    onRunButtonClick: PropTypes.func,
};
export default connect(({ runPanel }) => ({
    is_running      : runPanel.is_running,
    onRunButtonClick: runPanel.onRunButtonClick,
}))(RunPanel);
