import { Button,
    Drawer,
    Popover,
    Tabs }                                    from 'deriv-components';
import classNames                             from 'classnames';
import PropTypes                              from 'prop-types';
import React                                  from 'react';
import Dialog                                 from './dialog.jsx';
import { InfoOutlineIcon, RunIcon, StopIcon } from './Icons.jsx';
import Journal                                from './journal.jsx';
import Summary                                from './summary.jsx';
import TradeAnimation                         from './trade-animation.jsx';
import Transactions                           from './transactions.jsx';
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
            <div label={translate('Transactions')} >
                <Transactions />
            </div>
            <div label={translate('Journal')}>
                <Journal />
            </div>
        </Tabs>
    );
};

const drawerFooter = ({
    active_index,
    dialog_options,
    is_clear_stat_disable,
    is_running,
    is_run_button_clicked,
    is_dialog_visible,
    onCancelButtonClick,
    onClearStatClick,
    onOkButtonClick,
    onRunButtonClick,
    onStopButtonClick,
}) => {
    return (
        <div className='run-panel__footer'>
            <TradeAnimation className='run-panel__animation' should_show_overlay={active_index > 0} />
            <Button
                className={classNames(
                    'btn--secondary--default',
                    'run-panel__button',
                    { 'run-panel__button--disable': is_clear_stat_disable }
                )}
                text={translate('Clear stat')}
                onClick={onClearStatClick}
                has_effect
            />

            {
                (is_run_button_clicked || is_running) ?
                    <Button
                        className={classNames(
                            'btn--primary--default',
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
            {is_dialog_visible &&
                <Dialog
                    title={dialog_options.title}
                    is_open={is_dialog_visible}
                    onOkButtonClick={onOkButtonClick}
                    onCancelButtonClick={onCancelButtonClick}
                >
                    {dialog_options.message}
                </Dialog>
            }
            <Popover
                className='run-panel__info'
                alignment='left'
                message={translate(
                    `Stopping the bot will prevent further trades. Any ongoing trades will be completed 
                     by our system. Please be aware that some completed transactions may not be displayed
                     in the transaction table if the bot is stopped while placing trades. You may refer to
                     the statement page for details of all completed transactions.`)}
            >
                <InfoOutlineIcon className='run-panel__icon-info' />
            </Popover>
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
    is_clear_stat_disable: PropTypes.bool,
    is_dialog_visible    : PropTypes.bool,
    is_drawer_open       : PropTypes.bool,
    is_run_button_clicked: PropTypes.bool,
    is_running           : PropTypes.bool,
    onCancelButtonClick  : PropTypes.func,
    onClearStatClick     : PropTypes.func,
    onOkButtonClick      : PropTypes.func,
    onRunButtonClick     : PropTypes.func,
    onStopButtonClick    : PropTypes.func,
    onUnmount            : PropTypes.func,
    setActiveTabIndex    : PropTypes.func,
    toggleDrawer         : PropTypes.func,
};

export default connect(({ run_panel, journal }) => ({
    active_index         : run_panel.active_index,
    dialog_options       : run_panel.dialog_options,
    is_clear_stat_disable: run_panel.is_run_button_clicked ||
    run_panel.is_running || journal.messages.length === 0,
    is_dialog_visible    : run_panel.is_dialog_visible,
    is_drawer_open       : run_panel.is_drawer_open,
    is_run_button_clicked: run_panel.is_run_button_clicked,
    is_running           : run_panel.is_running,
    onCancelButtonClick  : run_panel.onCancelButtonClick,
    onClearStatClick     : run_panel.onClearStatClick,
    onOkButtonClick      : run_panel.onOkButtonClick,
    onRunButtonClick     : run_panel.onRunButtonClick,
    onStopButtonClick    : run_panel.onStopButtonClick,
    onUnmount            : run_panel.onUnmount,
    setActiveTabIndex    : run_panel.setActiveTabIndex,
    toggleDrawer         : run_panel.toggleDrawer,
}))(RunPanel);
