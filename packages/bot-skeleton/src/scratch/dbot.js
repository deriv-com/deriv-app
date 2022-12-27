import { localize } from '@deriv/translations';
import './blockly';
import { hasAllRequiredBlocks, isAllRequiredBlocksEnabled, updateDisabledBlocks } from './utils';
import main_xml from './xml/main.xml';
import DBotStore from './dbot-store';
import { save_types } from '../constants';
import { config } from '../constants/config';
import { getSavedWorkspaces, saveWorkspaceToRecent } from '../utils/local-storage';
import { observer as globalObserver } from '../utils/observer';
import ApiHelpers from '../services/api/api-helpers';
import Interpreter from '../services/tradeEngine/utils/interpreter';
import { setColors } from './hooks/colours';
import { api_base } from '../services/api/api-base';

class DBot {
    constructor() {
        this.interpreter = null;
        this.workspace = null;
        this.before_run_funcs = [];
    }

    /**
     * Initialises the workspace and mounts it to a container element (app_contents).
     */
    async initWorkspace(public_path, store, api_helpers_store, is_mobile) {
        const recent_files = await getSavedWorkspaces();
        setColors();
        return new Promise((resolve, reject) => {
            __webpack_public_path__ = public_path; // eslint-disable-line no-global-assign
            ApiHelpers.setInstance(api_helpers_store);
            DBotStore.setInstance(store);
            const window_width = window.innerWidth;
            try {
                let workspaceScale = 0.8;

                const { handleFileChange } = DBotStore.instance;
                if (window_width < 1640) {
                    if (is_mobile) {
                        workspaceScale = 0.7;
                    } else {
                        const scratch_div_width = document.getElementById('scratch_div')?.offsetWidth;
                        const zoom_scale = scratch_div_width / window_width / 1.5;
                        workspaceScale = zoom_scale;
                    }
                }
                const el_scratch_div = document.getElementById('scratch_div');
                if (!el_scratch_div) {
                    return;
                }
                this.workspace = Blockly.inject(el_scratch_div, {
                    grid: { spacing: 40, length: 11, colour: '#f3f3f3' },
                    media: `${__webpack_public_path__}media/`,
                    trashcan: !is_mobile,
                    zoom: { wheel: true, startScale: workspaceScale },
                    scrollbars: true,
                });

                this.workspace.cached_xml = { main: main_xml };
                this.workspace.save_workspace_interval = setInterval(async () => {
                    // Periodically save the workspace.
                    await saveWorkspaceToRecent(Blockly.Xml.workspaceToDom(this.workspace), save_types.UNSAVED);
                }, 10000);

                this.workspace.addChangeListener(this.valueInputLimitationsListener.bind(this));
                this.workspace.addChangeListener(event => updateDisabledBlocks(this.workspace, event));
                this.workspace.addChangeListener(event => this.workspace.dispatchBlockEventEffects(event));

                Blockly.derivWorkspace = this.workspace;

                this.addBeforeRunFunction(this.unselectBlocks.bind(this));
                this.addBeforeRunFunction(this.disableStrayBlocks.bind(this));
                this.addBeforeRunFunction(this.checkForErroredBlocks.bind(this));
                this.addBeforeRunFunction(this.checkForRequiredBlocks.bind(this));

                // Push main.xml to workspace and reset the undo stack.
                this.workspace.current_strategy_id = Blockly.utils.genUid();
                Blockly.derivWorkspace.strategy_to_load = main_xml;
                let file_name = config.default_file_name;
                if (recent_files && recent_files.length) {
                    const latest_file = recent_files[0];
                    Blockly.derivWorkspace.strategy_to_load = latest_file.xml;
                    file_name = latest_file.name;
                    Blockly.derivWorkspace.current_strategy_id = latest_file.id;
                }

                const event_group = `dbot-load${Date.now()}`;
                Blockly.Events.setGroup(event_group);
                Blockly.Xml.domToWorkspace(
                    Blockly.Xml.textToDom(Blockly.derivWorkspace.strategy_to_load),
                    this.workspace
                );
                const { save_modal } = DBotStore.instance;

                save_modal.updateBotName(file_name);
                this.workspace.cleanUp();
                this.workspace.clearUndo();

                window.dispatchEvent(new Event('resize'));
                window.addEventListener('dragover', DBot.handleDragOver);
                window.addEventListener('drop', e => DBot.handleDropOver(e, handleFileChange));
                api_base.init();
                // disable overflow
                el_scratch_div.parentNode.style.overflow = 'hidden';
                resolve();
            } catch (error) {
                // TODO: Handle error.
                reject(error);
                throw error;
            }
        });
    }

    /**
     * Allows you to add a function that needs to be executed before running the bot. Each
     * function needs to return true in order for the bot to run.
     * @param {Function} func Function to execute which returns true/false.
     */
    addBeforeRunFunction(func) {
        this.before_run_funcs.push(func);
    }

    shouldRunBot() {
        return this.before_run_funcs.every(func => !!func());
    }

    /**
     * Runs the bot. Does a sanity check before attempting to generate the
     * JavaScript code that's fed to the interpreter.
     */
    runBot() {
        try {
            const code = this.generateCode();
            if (this.interpreter !== null) {
                this.interpreter = null;
            }

            this.interpreter = Interpreter();
            api_base.setIsRunning(true);
            this.interpreter.run(code).catch(error => {
                globalObserver.emit('Error', error);
                this.stopBot();
            });
        } catch (error) {
            globalObserver.emit('Error', error);

            if (this.interpreter) {
                this.stopBot();
            }
        }
    }

    /**
     * Generates the code that is passed to the interpreter.
     * @param {Object} limitations Optional limitations (legacy argument)
     */
    generateCode(limitations = {}) {
        return `
            var BinaryBotPrivateInit;
            var BinaryBotPrivateStart;
            var BinaryBotPrivateBeforePurchase; 
            var BinaryBotPrivateDuringPurchase;
            var BinaryBotPrivateAfterPurchase;
            var BinaryBotPrivateLastTickTime;
            var BinaryBotPrivateTickAnalysisList = [];
            var BinaryBotPrivateHasCalledTradeOptions = false;

           
            function recursiveList(list, final_list){
                for(var i=0; i < list.length; i++){
                    if(typeof(list[i]) === 'object'){
                        recursiveList(list[i], final_list);
                    }
                    if(typeof(list[i]) == 'number'){
                        final_list.push(list[i]);   
                                  	
                    }
                }
                return final_list;
            }

            function BinaryBotPrivateRun(f, arg) {
                if (f) return f(arg);
                return false;
            }
            function BinaryBotPrivateTickAnalysis() {
                var currentTickTime = Bot.getLastTick(true);
                while (currentTickTime === 'MarketIsClosed') {
                    sleep(5);
                    currentTickTime = Bot.getLastTick(true);
                }
                currentTickTime = currentTickTime.epoch;
                if (currentTickTime === BinaryBotPrivateLastTickTime) {
                    return;
                }
                BinaryBotPrivateLastTickTime = currentTickTime;
                for (var BinaryBotPrivateI = 0; BinaryBotPrivateI < BinaryBotPrivateTickAnalysisList.length; BinaryBotPrivateI++) {
                    BinaryBotPrivateRun(BinaryBotPrivateTickAnalysisList[BinaryBotPrivateI]);
                }
            }
            var BinaryBotPrivateLimitations = ${JSON.stringify(limitations)};
            ${Blockly.JavaScript.workspaceToCode(this.workspace)}
            BinaryBotPrivateRun(BinaryBotPrivateInit);
            while (true) {
                BinaryBotPrivateTickAnalysis();
                BinaryBotPrivateRun(BinaryBotPrivateStart);
                if (!BinaryBotPrivateHasCalledTradeOptions) {
                    sleep(1);
                    continue;
                }
                while (watch('before')) {
                    BinaryBotPrivateTickAnalysis();
                    BinaryBotPrivateRun(BinaryBotPrivateBeforePurchase);
                }
                while (watch('during')) {
                    BinaryBotPrivateTickAnalysis();
                    BinaryBotPrivateRun(BinaryBotPrivateDuringPurchase);
                }
                BinaryBotPrivateTickAnalysis();
                if (!BinaryBotPrivateRun(BinaryBotPrivateAfterPurchase)) {
                    break;
                }
            }`;
    }

    /**
     * Instructs the interpreter to stop the bot. If there is an active trade
     * that trade will be completed first to reflect correct contract status in UI.
     */
    stopBot() {
        api_base.setIsRunning(false);
        if (this.interpreter) {
            this.interpreter.stop();
        }
    }

    /**
     * Immediately instructs the interpreter to terminate the WS connection and bot.
     */
    terminateBot() {
        if (this.interpreter) {
            this.interpreter.terminateSession();
            this.interpreter = null;
        }
    }

    /**
     * Unselects any selected block before running the bot.
     */
    // eslint-disable-next-line class-methods-use-this
    unselectBlocks() {
        if (Blockly.selected) {
            Blockly.selected.unselect();
        }
        return true;
    }

    /**
     * Disable blocks outside of any main or independent blocks.
     */
    disableStrayBlocks() {
        const top_blocks = this.workspace.getTopBlocks();

        top_blocks.forEach(block => {
            if (!block.isMainBlock() && !block.isIndependentBlock()) {
                this.disableBlocksRecursively(block);
            }
        });

        return true;
    }

    /**
     * Disable blocks and their optional children.
     */
    disableBlocksRecursively(block) {
        block.setDisabled(true);
        if (block.nextConnection?.targetConnection) {
            this.disableBlocksRecursively(block.nextConnection.targetConnection.sourceBlock_);
        }
    }

    /**
     * Check if there are any blocks highlighted for errors.
     */
    checkForErroredBlocks() {
        // Force a check on value inputs.
        this.valueInputLimitationsListener({}, true);

        const all_blocks = this.workspace.getAllBlocks(true);
        const error_blocks = all_blocks
            .filter(block => block.is_error_highlighted && !block.disabled)
            // filter out duplicated error message
            .filter((block, index, self) => index === self.findIndex(b => b.error_message === block.error_message));

        if (!error_blocks.length) {
            return true;
        }

        this.workspace.centerOnBlock(error_blocks[0].id);
        error_blocks.forEach(block => {
            globalObserver.emit('ui.log.error', block.error_message);
        });

        return false;
    }

    centerAndHighlightBlock(block_id, should_animate = false) {
        const block_to_highlight = this.workspace.getBlockById(block_id);

        if (!block_to_highlight) {
            return;
        }

        const all_blocks = this.workspace.getAllBlocks();

        all_blocks.forEach(block => block.setErrorHighlighted(false));
        if (should_animate) {
            block_to_highlight.blink();
        }
        block_to_highlight.setErrorHighlighted(true);

        this.workspace.centerOnBlock(block_to_highlight.id);
    }

    unHighlightAllBlocks() {
        this.workspace?.getAllBlocks().forEach(block => block.setErrorHighlighted(false));
    }

    /**
     * Checks whether the workspace contains all required blocks before running the strategy.
     */
    checkForRequiredBlocks() {
        let error;

        if (!hasAllRequiredBlocks(this.workspace)) {
            error = new Error(
                localize(
                    'One or more mandatory blocks are missing from your workspace. Please add the required block(s) and then try again.'
                )
            );
        } else if (!isAllRequiredBlocksEnabled(this.workspace)) {
            error = new Error(
                localize(
                    'One or more mandatory blocks are disabled in your workspace. Please enable the required block(s) and then try again.'
                )
            );
        }

        if (error) {
            globalObserver.emit('Error', error);
            return false;
        }

        return true;
    }

    /**
     * Checks all blocks in the workspace to see if they need to be highlighted
     * in case one of their inputs is not populated, returns an empty value, or doesn't
     * pass the custom validator.
     * Note: The value passed to the custom validator is always a string value
     * @param {Blockly.Event} event Workspace event
     */
    valueInputLimitationsListener(event, force_check = false) {
        if (!force_check && (!this.workspace || this.workspace.isDragging())) {
            return;
        }

        Blockly.JavaScript.init(this.workspace);

        if (force_check) {
            Blockly.hideChaff(false);
        }

        const isGlobalEndDragEvent = () => event.type === Blockly.Events.END_DRAG;
        const isGlobalDeleteEvent = () => event.type === Blockly.Events.BLOCK_DELETE;
        const isGlobalCreateEvent = () => event.type === Blockly.Events.BLOCK_CREATE;
        const isClickEvent = () =>
            event.type === Blockly.Events.UI && (event.element === 'click' || event.element === 'selected');
        const isChangeEvent = b => event.type === Blockly.Events.BLOCK_CHANGE && event.blockId === b.id;
        const isChangeInMyInputs = b => {
            if (event.type === Blockly.Events.BLOCK_CHANGE) {
                return b.inputList.some(input => {
                    if (input.connection) {
                        const target_block = input.connection.targetBlock();
                        return target_block && event.blockId === target_block.id;
                    }
                    return false;
                });
            }
            return false;
        };
        const isParentEnabledEvent = b => {
            if (event.type === Blockly.Events.BLOCK_CHANGE && event.element === 'disabled') {
                let parent_block = b.getParent();

                while (parent_block !== null) {
                    if (parent_block.id === event.blockId) {
                        return true;
                    }

                    parent_block = parent_block.getParent();
                }
            }
            return false;
        };

        this.workspace.getAllBlocks(true).forEach(block => {
            if (
                force_check ||
                isGlobalEndDragEvent() ||
                isGlobalDeleteEvent() ||
                isGlobalCreateEvent() ||
                isClickEvent() ||
                isChangeEvent(block) ||
                isChangeInMyInputs(block) ||
                isParentEnabledEvent(block)
            ) {
                // Unhighlight disabled blocks and their optional children.
                if (block.disabled) {
                    const unhighlightRecursively = child_blocks => {
                        child_blocks.forEach(child_block => {
                            child_block.setErrorHighlighted(false);
                            unhighlightRecursively(child_block.getChildren());
                        });
                    };

                    unhighlightRecursively([block]);
                    return;
                }

                // No required inputs, ignore this block.
                if (!block.getRequiredValueInputs) {
                    return;
                }

                const required_inputs_object = block.getRequiredValueInputs();
                const required_input_names = Object.keys(required_inputs_object);
                const should_highlight = required_input_names.some(input_name => {
                    const is_selected = Blockly.selected === block; // Don't highlight selected blocks.
                    const is_disabled = block.disabled || block.getInheritedDisabled(); // Don't highlight disabled blocks.

                    if (is_selected || is_disabled) {
                        return false;
                    }

                    // Don't unhighlight collapsed blocks with highlighted descendants.
                    if (block.isCollapsed() && block.hasErrorHighlightedDescendant()) {
                        return true;
                    }

                    const input = block.getInput(input_name);

                    if (!input && !block.domToMutation) {
                        // eslint-disable-next-line no-console
                        console.warn('Detected a non-existent required input.', {
                            input_name,
                            type: block.type,
                        });
                    } else if (input.connection) {
                        const order = Blockly.JavaScript.ORDER_ATOMIC;
                        const value = Blockly.JavaScript.valueToCode(block, input_name, order);
                        const inputValidatorFn = required_inputs_object[input_name];

                        // If a custom validator was supplied, use this to determine whether
                        // the block should be highlighted.
                        if (typeof inputValidatorFn === 'function') {
                            return !!inputValidatorFn(value);
                        }

                        // If there's no custom validator, only check if input was populated and
                        // doesn't return an empty value.
                        return !value;
                    }

                    return true;
                });

                if (should_highlight) {
                    // Remove select highlight in favour of error highlight.
                    block.removeSelect();
                }

                block.setErrorHighlighted(should_highlight, block.error_message || undefined);

                // Automatically expand blocks that have been highlighted.
                if (force_check && (block.is_error_highlighted || block.hasErrorHighlightedDescendant())) {
                    let current_collapsed_block = block;
                    while (current_collapsed_block) {
                        current_collapsed_block.setCollapsed(false);
                        current_collapsed_block = current_collapsed_block.getParent();
                    }
                }
            }
        });
    }

    /**
     * Checks whether the workspace contains non-silent notification blocks. Returns array of names for audio files to be played.
     */
    getStrategySounds() {
        const all_blocks = this.workspace.getAllBlocks();
        const notify_blocks = all_blocks.filter(block => block.type === 'notify');
        const strategy_sounds = [];

        notify_blocks.forEach(block => {
            const selected_sound = block.inputList[0].fieldRow[3].value_;

            if (selected_sound !== 'silent') {
                strategy_sounds.push(selected_sound);
            }
        });

        return strategy_sounds;
    }

    static handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
    }

    static handleDropOver(event, handleFileChange) {
        const main_workspace_dom = document.getElementById('scratch_div');
        const local_drag_zone = document.getElementById('load-strategy__local-dropzone-area');

        if (main_workspace_dom.contains(event.target)) {
            handleFileChange(event);
        } else if (local_drag_zone && local_drag_zone.contains(event.target)) {
            handleFileChange(event, false);
        } else {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.effectAllowed = 'none';
            event.dataTransfer.dropEffect = 'none';
        }
    }
}

export default new DBot();
