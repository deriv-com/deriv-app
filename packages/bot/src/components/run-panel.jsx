import { Button, Drawer, Tabs }               from 'deriv-components';
import classNames                             from 'classnames';
import PropTypes                              from 'prop-types';
import React                                  from 'react';
import Dialog                                 from './dialog.jsx';
import { InfoOutlineIcon, RunIcon, StopIcon } from './Icons.jsx';
import Journal                                from './journal.jsx';
import { connect }                            from '../stores/connect';
import { translate }                          from '../utils/tools';
import '../assets/sass/run-panel.scss';

const drawerContent = () => {
    return (
        <Tabs>
            <div label={translate('Summary')} />
            <div label={translate('Transactions')} />
            <div label={translate('Journal')}>
                <Journal />
            </div>
        </Tabs>
    );
};

const drawerFooter = ({
    closeModal,
    is_dialog_visible,
    is_loading,
    is_running,
    onRunButtonClick,
}) => {
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
                    'run-panel__button',
                    {
                        'run-panel__button--run'    : !is_running,
                        'run-panel__button--loading': is_loading,
                    }
                )}
                is_loading={is_loading}
                text={is_running ? translate('Stop bot') : translate('Run bot')}
                icon={!is_loading && (is_running ? <StopIcon /> : <RunIcon />)}
                onClick={onRunButtonClick}
                has_effect
            />
            <Dialog
                title={translate('Run Error!')}
                is_open={is_dialog_visible}
                closeModal={closeModal}
            >
                {translate('Please log in.')}
            </Dialog>
            <InfoOutlineIcon className='icon-info' />
        </div>
    );
};

const RunPanel = (props) => {
    const content = drawerContent();
    const footer = drawerFooter(props);

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
    closeModal       : PropTypes.func,
    contract_stage   : PropTypes.string,
    is_dialog_visible: PropTypes.bool,
    is_loading       : PropTypes.bool,
    is_running       : PropTypes.bool,
    onRunButtonClick : PropTypes.func,
};

export default connect(({ runPanel }) => ({
    closeModal       : runPanel.closeModal,
    is_dialog_visible: runPanel.is_dialog_visible,
    is_loading       : runPanel.is_button_loading,
    is_running       : runPanel.is_running,
    onRunButtonClick : runPanel.onRunButtonClick,
}))(RunPanel);
