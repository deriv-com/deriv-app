import { Button,
    Drawer,
    PopoverWrapper,
    Tabs }                                    from 'deriv-components';
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
    is_clear_stat_disabled,
    is_dialog_open,
    is_stop_button_disabled,
    is_stop_button_visible,
    onCancelButtonClick,
    onClearStatClick,
    onOkButtonClick,
    onRunButtonClick,
    onStopButtonClick,
}) => {
    return (
        <div className='run-panel__footer'>
            <TradeAnimation className='run-panel__animation' should_show_overlay={active_index > 0} />
            <div className='run-panel__buttons'>
                <Button
                    is_disabled={is_clear_stat_disabled}
                    text={translate('Clear stat')}
                    onClick={onClearStatClick}
                    has_effect
                    secondary
                />
    
                {
                    (is_stop_button_visible) ?
                        <Button
                            is_disabled={is_stop_button_disabled}
                            text={translate('Stop bot')}
                            icon={<StopIcon className='run-panel__button--icon' />}
                            onClick={onStopButtonClick}
                            has_effect
                            primary
                        /> :
                        <Button
                            text={translate('Run bot')}
                            icon={<RunIcon className='run-panel__button--icon' />}
                            onClick={onRunButtonClick}
                            has_effect
                            green
                        />
                }
                <PopoverWrapper
                    className='run-panel__info'
                    classNameBubble='run-panel__info--bubble'
                    alignment='top'
                    message={translate(
                        `Stopping the bot will prevent further trades. Any ongoing trades will be completed 
                     by our system. Please be aware that some completed transactions may not be displayed
                     in the transaction table if the bot is stopped while placing trades. You may refer to
                     the statement page for details of all completed transactions.`)}
                >
                    <InfoOutlineIcon className='run-panel__icon-info' />
                </PopoverWrapper>
            </div>
            {is_dialog_open &&
                <Dialog
                    title={dialog_options.title}
                    is_open={is_dialog_open}
                    onOkButtonClick={onOkButtonClick}
                    onCancelButtonClick={onCancelButtonClick}
                >
                    {dialog_options.message}
                </Dialog>
            }
        </div>
    );
};

class RunPanel extends React.PureComponent {
    componentWillUnmount() {
        this.props.onUnmount();
    }

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
    active_index           : PropTypes.number,
    dialog_options         : PropTypes.object,
    is_clear_stat_disabled : PropTypes.bool,
    is_dialog_open         : PropTypes.bool,
    is_drawer_open         : PropTypes.bool,
    is_stop_button_disabled: PropTypes.bool,
    is_stop_button_visible : PropTypes.bool,
    onCancelButtonClick    : PropTypes.func,
    onClearStatClick       : PropTypes.func,
    onOkButtonClick        : PropTypes.func,
    onRunButtonClick       : PropTypes.func,
    onStopButtonClick      : PropTypes.func,
    onUnmount              : PropTypes.func,
    setActiveTabIndex      : PropTypes.func,
    toggleDrawer           : PropTypes.func,
};

export default connect(({ run_panel }) => ({
    active_index           : run_panel.active_index,
    dialog_options         : run_panel.dialog_options,
    is_clear_stat_disabled : run_panel.is_clear_stat_disabled,
    is_dialog_open         : run_panel.is_dialog_open,
    is_drawer_open         : run_panel.is_drawer_open,
    is_stop_button_disabled: run_panel.is_stop_button_disabled,
    is_stop_button_visible : run_panel.is_stop_button_visible,
    onCancelButtonClick    : run_panel.onCancelButtonClick,
    onClearStatClick       : run_panel.onClearStatClick,
    onOkButtonClick        : run_panel.onOkButtonClick,
    onRunButtonClick       : run_panel.onRunButtonClick,
    onStopButtonClick      : run_panel.onStopButtonClick,
    onUnmount              : run_panel.onUnmount,
    setActiveTabIndex      : run_panel.setActiveTabIndex,
    toggleDrawer           : run_panel.toggleDrawer,
}))(RunPanel);
