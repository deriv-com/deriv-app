import { Button, Drawer, Tabs }               from 'deriv-components';
import classNames                             from 'classnames';
import PropTypes                              from 'prop-types';
import React                                  from 'react';
import Dialog                                 from './dialog.jsx';
import { InfoOutlineIcon, RunIcon, StopIcon } from './Icons.jsx';
import Journal                                from './journal.jsx';
import Summary                                from './summary.jsx';
import { connect }                            from '../stores/connect';
import { translate }                          from '../utils/tools';
import '../assets/sass/run-panel.scss';

const drawerContent = ({
    active_index,
    setActiveTabIndex,
}) => {
    return (
        <Tabs 
            active_index={active_index} 
            onClickTabItem={setActiveTabIndex}
        >
            <div label={translate('Summary')}>
                <Summary />
            </div>
            <div label={translate('Transactions')} />
            <div label={translate('Journal')}>
                <Journal />
            </div>
        </Tabs>
    );
};

const drawerFooter = ({
    onCloseModal,
    dialog_options,
    is_running,
    is_run_button_clicked,
    is_dialog_visible,
    onClearStatClick,
    onRunButtonClick,
    onStopButtonClick,
}) => {
    return (
        <div className='run-panel__footer'>
            <Button
                className={classNames(
                    'btn--flat',
                    'run-panel__button'
                )}
                text={translate('Clear stat')}
                onClick={onClearStatClick}
                has_effect
            />

            {
                (is_run_button_clicked || is_running) ?
                    <Button
                        className={classNames(
                            'btn--primary',
                            'run-panel__button',
                            { 'run-panel__button--disable': !is_run_button_clicked }
                        )}
                        text={translate('Stop bot')}
                        icon={<StopIcon />}
                        onClick={onStopButtonClick}
                        has_effect
                    /> :
                    <Button
                        className={classNames(
                            'btn--primary',
                            'run-panel__button',
                            'run-panel__button--run',
                        )}
                        text={translate('Run bot')}
                        icon={<RunIcon />}
                        onClick={onRunButtonClick}
                        has_effect
                    />
            }
            { is_dialog_visible &&
                <Dialog title={dialog_options.title} is_open={is_dialog_visible} closeModal={onCloseModal}>
                    {dialog_options.message}
                </Dialog>
            }
            <InfoOutlineIcon className='run-panel__icon-info' />
        </div>
    );
};

class RunPanel extends React.PureComponent {
    // componentWillUnmount() {
    //     this.props.onUnmount(); TODO: Dispose of listeners.
    // }

    render() {
        const { active_index, setActiveTabIndex } = this.props;
        const content = drawerContent({ active_index, setActiveTabIndex });
        const footer = drawerFooter(this.props);

        return (
            <Drawer
                className='run-panel'
                is_open={this.props.is_drawer_open}
                toggleDrawer={this.props.toggleDrawer}
                footer={footer}
            >
                {content}
            </Drawer>
        );
    }
}

RunPanel.propTypes = {
    active_index         : PropTypes.number,
    dialog_options       : PropTypes.object,
    is_dialog_visible    : PropTypes.bool,
    is_drawer_open       : PropTypes.bool,
    is_run_button_clicked: PropTypes.bool,
    is_running           : PropTypes.bool,
    onClearStatClick     : PropTypes.func,
    onCloseModal         : PropTypes.func,
    onRunButtonClick     : PropTypes.func,
    onStopButtonClick    : PropTypes.func,
    onUnmount            : PropTypes.func,
    setActiveTabIndex    : PropTypes.func,
    toggleDrawer         : PropTypes.func,
};

export default connect(({ run_panel }) => ({
    active_index         : run_panel.active_index,
    dialog_options       : run_panel.dialog_options,
    is_dialog_visible    : run_panel.is_dialog_visible,
    is_drawer_open       : run_panel.is_drawer_open,
    is_run_button_clicked: run_panel.is_run_button_clicked,
    is_running           : run_panel.is_running,
    onClearStatClick     : run_panel.onClearStatClick,
    onCloseModal         : run_panel.onCloseModal,
    onRunButtonClick     : run_panel.onRunButtonClick,
    onStopButtonClick    : run_panel.onStopButtonClick,
    onUnmount            : run_panel.onUnmount,
    setActiveTabIndex    : run_panel.setActiveTabIndex,
    toggleDrawer         : run_panel.toggleDrawer,
}))(RunPanel);
