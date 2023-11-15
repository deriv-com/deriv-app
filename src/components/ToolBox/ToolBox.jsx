/* eslint-disable import/order */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { showSummary, logButton } from '@blockly/blockly-worksace';
import config from '@config';
import { isMobile } from '@utils';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import Load from './load';
import Reset from './reset';
import Modal from '@components/common/modal';
import { setIsBotRunning } from '@redux-store/ui-slice';
import Popover from '@components/common/popover';
import Chart from '@components/Dialogs/Chart';
import Save from './save';
import TradingView from '@components/Dialogs/TradingView';
import IntegrationsDialog from '@components/Dialogs/IntegrationsDialog';
import { getActiveToken } from '@storage';
import { api_base } from '../../api-base';

const ShowModal = ({ modal, onClose, class_name }) => {
    if (!modal) return null;
    const { component: Component, props, title } = modal;
    return (
        <Modal onClose={onClose} title={title} class_name={class_name}>
            <Component {...props} />
        </Modal>
    );
};

ShowModal.propTypes = {
    class_name: PropTypes.string,
    modal: PropTypes.object,
    onClose: PropTypes.func,
};

const ToolboxButton = ({
    label,
    tooltip,
    classes,
    id_container,
    class_container,
    id,
    onClick,
    position = 'bottom',
    is_bot_running,
}) => (
    <Popover id={id_container} class_container={class_container} content={tooltip} position={position}>
        <button id={id} onClick={onClick} className={classes} disabled={is_bot_running}>
            {label}
        </button>
    </Popover>
);

ToolboxButton.propTypes = {
    class_container: PropTypes.string,
    classes: PropTypes.string,
    id: PropTypes.string,
    id_container: PropTypes.string,
    is_bot_running: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
    position: PropTypes.string,
    tooltip: PropTypes.string,
};

let chart;
let tradingView;
let integrations;

const ToolBox = ({ blockly, is_workspace_rendered }) => {
    const [should_show_modal, setShowModal] = React.useState(false);
    const [selected_modal, updateSelectedModal] = React.useState('');
    const [has_active_token, setHasActiveToken] = React.useState(false);

    const dispatch = useDispatch();
    const { is_gd_ready, is_bot_running } = useSelector(state => state.ui);
    const { is_gd_logged_in, login_id } = useSelector(state => state.client);

    React.useEffect(() => {
        const token = !!getActiveToken();
        if (token) setHasActiveToken(true);
    }, [login_id]);

    React.useEffect(() => {
        globalObserver.register('bot.running', () => dispatch(setIsBotRunning(true)));
        globalObserver.register('bot.stop', () => dispatch(setIsBotRunning(false)));

        const Keys = Object.freeze({ zoomIn: '=', zoomOut: '-' });
        document.body.addEventListener('keydown', e => {
            if (e.key === Keys.zoomOut && e.ctrlKey) {
                // Ctrl + -
                e.preventDefault();
                // eslint-disable-next-line no-unused-expressions
                blockly?.zoomOnPlusMinus(false);
                return;
            }
            if (e.key === Keys.zoomIn && e.ctrlKey) {
                // Ctrl + +
                e.preventDefault();
                // eslint-disable-next-line no-unused-expressions
                blockly?.zoomOnPlusMinus(true);
            }
        });
    }, []);

    const onCloseModal = () => {
        setShowModal(false);
        updateSelectedModal('');
    };
    const onShowModal = modal => {
        setShowModal(true);
        updateSelectedModal(modal);
    };
    const MODALS = {
        load: {
            component: Load,
            title: translate('Load Blocks'),
            props: {
                closeDialog: onCloseModal,
                is_gd_logged_in,
            },
        },
        save: {
            component: Save,
            title: translate('Save Blocks'),
            props: {
                closeDialog: onCloseModal,
                is_gd_logged_in,
                blockly,
            },
        },
        reset: {
            component: Reset,
            title: translate('Are you sure?'),
            props: {
                onCloseModal,
                blockly,
            },
        },
    };

    return (
        <div id='toolbox'>
            <ToolboxButton
                id='resetButton'
                tooltip={translate('Reset the blocks to their initial state')}
                position='bottom'
                onClick={() => onShowModal('reset')}
                classes='toolbox-button icon-reset'
            />
            <ToolboxButton
                id='load-xml'
                tooltip={translate('Load new blocks (xml file)')}
                position='bottom'
                onClick={() => onShowModal('load')}
                classes='toolbox-button icon-browse'
            />
            <ToolboxButton
                id='save-xml'
                tooltip={translate('Save the existing blocks (xml file)')}
                position='bottom'
                onClick={() => onShowModal('save')}
                classes='toolbox-button icon-save'
            />
            {is_gd_ready && (
                <ToolboxButton
                    id='integrations'
                    tooltip={translate('Connect Binary Bot to your Google Drive to easily save and re-use your blocks')}
                    position='bottom'
                    classes='toolbox-button icon-integrations'
                    onClick={() => {
                        if (!integrations) {
                            integrations = new IntegrationsDialog();
                        }
                        integrations.open();
                    }}
                />
            )}

            <span className='toolbox-separator' />
            <ToolboxButton
                id='undo'
                tooltip={translate('Undo the changes (Ctrl+Z)')}
                position='bottom'
                onClick={() => blockly.undo()}
                classes='toolbox-button icon-undo'
            />
            <ToolboxButton
                id='redo'
                tooltip={translate('Redo the changes (Ctrl+Shift+Z)')}
                position='bottom'
                onClick={() => blockly.redo()}
                classes='toolbox-button icon-redo'
            />
            <span className='toolbox-separator' />
            <ToolboxButton
                id='zoomIn'
                tooltip={translate('Zoom In (Ctrl + +)')}
                position={isMobile() ? 'left' : 'bottom'}
                onClick={() => blockly.zoomOnPlusMinus(true)}
                classes='toolbox-button icon-zoom-in'
            />
            <ToolboxButton
                id='zoomOut'
                tooltip={translate('Zoom Out (Ctrl + -)')}
                position={isMobile() ? 'left' : 'bottom'}
                onClick={() => blockly.zoomOnPlusMinus(false)}
                classes='toolbox-button icon-zoom-out'
            />
            <ToolboxButton
                id='rearrange'
                tooltip={translate('Rearrange Vertically')}
                position={isMobile() ? 'left' : 'bottom'}
                onClick={() => blockly.cleanUp()}
                classes='toolbox-button icon-sort'
            />
            {/* Needs Refactor ClientInfo Structure */}
            <span className={classNames('toolbox-separator')} />
            <ToolboxButton
                id='showSummary'
                tooltip={translate('Show/hide the summary pop-up')}
                position={'bottom'}
                onClick={() => showSummary()}
                classes={classNames('toolbox-button icon-summary', {
                    'toolbox-hide': !has_active_token,
                })}
            />
            <ToolboxButton
                id_container='runButton'
                tooltip={translate('Run the bot')}
                position='bottom'
                onClick={() => globalObserver.emit('blockly.start')}
                classes={classNames('toolbox-button icon-run', {
                    'toolbox-hide': !is_workspace_rendered,
                })}
                is_bot_running={is_bot_running}
            />
            <ToolboxButton
                id_container='stopButton'
                tooltip={translate('Stop the bot')}
                position='bottom'
                onClick={() => {
                    globalObserver.emit('blockly.stop');
                }}
                classes={classNames('toolbox-button icon-stop')}
            />
            <ToolboxButton
                id='logButton'
                class_container={classNames({ 'toolbox-hide': !has_active_token })}
                tooltip={translate('Show log')}
                position='bottom'
                onClick={() => logButton()}
                classes={classNames('toolbox-button icon-info', { 'toolbox-hide': !has_active_token })}
            />
            {has_active_token && <span className='toolbox-separator' />}
            {/* Needs resizeable modal */}
            <ToolboxButton
                id='chartButton'
                tooltip={translate('Show chart')}
                position='bottom'
                classes='toolbox-button icon-chart-line'
                onClick={() => {
                    if (!api_base.api_chart) {
                        api_base.initChartWebSocket();
                    }
                    if (!chart) {
                        chart = new Chart();
                    }
                    chart?.open?.();
                }}
            />
            {config.trading_view_chart.url && (
                <ToolboxButton
                    id='tradingViewButton'
                    tooltip={translate('Show Trading View')}
                    position='bottom'
                    classes='toolbox-button icon-trading-view'
                    onClick={() => {
                        if (!tradingView) {
                            tradingView = new TradingView();
                        }
                        tradingView?.open?.();
                    }}
                />
            )}
            {should_show_modal && (
                <ShowModal modal={MODALS[selected_modal]} onClose={onCloseModal} class_name={selected_modal} />
            )}
        </div>
    );
};

ToolBox.propTypes = {
    blockly: PropTypes.object.isRequired,
    is_workspace_rendered: PropTypes.bool,
};

export default ToolBox;
