import { localize }                   from '@deriv/translations';
import                                    './blocks';
import                                    './hooks';
import {
    hasAllRequiredBlocks,
    updateDisabledBlocks }            from './utils';
import { onWorkspaceResize }          from './utils/workspace';
import config                         from '../constants';
import Interpreter                    from '../services/tradeEngine/utils/interpreter';
import ScratchStore                   from '../stores/scratch-store';
import { observer as globalObserver } from '../utils/observer';

class DBot {
    constructor() {
        this.interpreter      = null;
        this.workspace        = null;
        this.before_run_funcs = [];
    }

    /**
     * Initialises the workspace and mounts it to a container element (app_contents).
     */
    async initWorkspace() {
        try {
            const el_scratch_div  = document.getElementById('scratch_div');
            const toolbox_xml     = await fetch(`${__webpack_public_path__}xml/toolbox.xml`).then(r => r.text()); // eslint-disable-line
            const main_xml        = await fetch(`${__webpack_public_path__}xml/main.xml`).then(r => r.text()); // eslint-disable-line
            this.workspace        = Blockly.inject(el_scratch_div, {
                grid    : { spacing: 40, length: 11, colour: '#f3f3f3' },
                media   : `${__webpack_public_path__}media/`, // eslint-disable-line
                toolbox : toolbox_xml,
                trashcan: true,
                zoom    : { wheel: true, startScale: config.workspaces.mainWorkspaceStartScale },
            });

            this.workspace.blocksXmlStr  = main_xml;
            this.workspace.toolboxXmlStr = toolbox_xml;
            Blockly.derivWorkspace       = this.workspace;

            this.workspace.addChangeListener(this.valueInputLimitationsListener.bind(this));
            this.workspace.addChangeListener((event) => updateDisabledBlocks(this.workspace, event));
            this.addBeforeRunFunction(this.unselectBlocks.bind(this));
            this.addBeforeRunFunction(this.disableStrayBlocks.bind(this));
            this.addBeforeRunFunction(this.checkForErroredBlocks.bind(this));
            this.addBeforeRunFunction(this.checkForRequiredBlocks.bind(this));

            // Push main.xml to workspace and reset the undo stack.
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(main_xml), this.workspace);
            this.workspace.clearUndo();

            const { saveload } = ScratchStore.instance;
            const drop_zone    = document.body;
    
            window.addEventListener('resize', () => onWorkspaceResize());
            window.dispatchEvent(new Event('resize'));
            drop_zone.addEventListener('dragover', DBot.handleDragOver);
            drop_zone.addEventListener('drop', saveload.handleFileChange);
    
            // disable overflow
            el_scratch_div.parentNode.style.overflow = 'hidden';
        } catch (error) {
            // TODO: Handle error.
            throw error;
        }
    }

    /**
     * Allows you to add a function that needs to be executed before running the bot. Each
     * function needs to return true in order for the bot to run.
     * @param {Function} func Function to execute which returns true/false.
     */
    addBeforeRunFunction(func) {
        this.before_run_funcs.push(func);
    }

    /**
     * Runs the bot. Does a sanity check before attempting to generate the
     * JavaScript code that's fed to the interpreter.
     */
    runBot() {
        const { run_panel }  = ScratchStore.instance.root_store;
        const should_run_bot = this.before_run_funcs.every(func => !!func());
        
        if (!should_run_bot) {
            run_panel.onStopButtonClick();
            return;
        }

        try {
            const code = this.generateCode();

            if (this.interpreter !== null) {
                this.stopBot();
            }

            this.interpreter = new Interpreter();
            this.interpreter.run(code).catch(error => {
                globalObserver.emit('Error', error);
                run_panel.onStopButtonClick();
            });
        } catch (error) {
            globalObserver.emit('Error', error);

            if (this.interpreter) {
                run_panel.onStopButtonClick();
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
            function BinaryBotPrivateRun(f, arg) {
                if (f) return f(arg);
                return false;
            }
            function BinaryBotPrivateTickAnalysis() {
                var currentTickTime = Bot.getLastTick(true).epoch;
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
                block.setDisabled(true);
            }
        });

        return true;
    }

    /**
     * Check if there are any blocks highlighted for errors.
     */
    checkForErroredBlocks() {
        // Force a check on value inputs.
        this.valueInputLimitationsListener({}, true);

        const all_blocks  = this.workspace.getAllBlocks(true);
        const error_block = all_blocks.find(block => block.is_error_highlighted && !block.disabled);

        if (error_block) {
            const { run_panel } = ScratchStore.instance.root_store;
            const message       = localize('The block(s) highlighted in red are missing input values. Please update them and click "Run bot".');
            this.workspace.centerOnBlock(error_block.id);
            run_panel.showErrorMessage(message);

            return false;
        }

        return true;
    }

    /**
     * Checks whether the workspace contains all required blocks before running the strategy.
     */
    checkForRequiredBlocks() {
        if (!hasAllRequiredBlocks(this.workspace)) {
            const { run_panel } = ScratchStore.instance.root_store;

            run_panel.showErrorMessage(
                new Error(localize('One or more mandatory blocks are missing from your workspace. ' +
                'Please add the required block(s) and then try again.'))
            );

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

        const isGlobalEndDragEvent = () => event.type === Blockly.Events.END_DRAG;
        const isGlobalDeleteEvent  = () => event.type === Blockly.Events.BLOCK_DELETE;
        const isGlobalCreateEvent  = () => event.type === Blockly.Events.BLOCK_CREATE;
        const isClickEvent         = () => event.type === Blockly.Events.UI && (event.element === 'click' || event.element === 'selected');
        const isChangeEvent        = (b) => event.type === Blockly.Events.BLOCK_CHANGE && event.blockId === b.id;
        const isChangeInMyInputs   = (b) => {
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
        const isParentEnabledEvent = (b) => {
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
                    const unhighlightRecursively = (child_blocks) => {
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
                const required_input_names   = Object.keys(required_inputs_object);
                const should_highlight       = required_input_names.some(input_name => {
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
                        const order            = Blockly.JavaScript.ORDER_ATOMIC;
                        const value            = Blockly.JavaScript.valueToCode(block, input_name, order);
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

                block.setErrorHighlighted(should_highlight);
            }
        });
    }

    static handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
    }
}

export default new DBot();
