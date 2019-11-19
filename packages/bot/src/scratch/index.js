import                                    './blocks';
import                                    './hooks';
import Interpreter                    from '../services/tradeEngine/utils/interpreter';
import ScratchStore                   from '../stores/scratch-store';
import { observer as globalObserver } from '../utils/observer';
import config                         from '../constants';

export const scratchWorkspaceInit = async () => {
    try {
        const el_scratch_div = document.getElementById('scratch_div');
        const el_app_contents = document.getElementById('app_contents');

        const toolbox_xml = await fetch(`${__webpack_public_path__}xml/toolbox.xml`).then(response => response.text());
        const main_xml = await fetch(`${__webpack_public_path__}xml/main.xml`).then(response => response.text());

        const workspace = Blockly.inject(el_scratch_div, {
            grid    : { spacing: 40, length: 11, colour: '#f3f3f3' },
            media   : `${__webpack_public_path__}media/`,
            toolbox : toolbox_xml,
            trashcan: true,
            zoom    : { wheel: true, startScale: config.workspaces.mainWorkspaceStartScale },
        });

        Blockly.JavaScript.init(workspace);
        Blockly.JavaScript.variableDB_.setVariableMap(workspace.getVariableMap()); // eslint-disable-line

        Blockly.derivWorkspace = workspace;
        Blockly.derivWorkspace.blocksXmlStr = main_xml;
        Blockly.derivWorkspace.toolboxXmlStr = toolbox_xml;

        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(main_xml), workspace);
        Blockly.derivWorkspace.clearUndo();
        
        const onWorkspaceResize = () => {
            const toolbar_height = 56;

            el_scratch_div.style.width  = `${el_app_contents.offsetWidth}px`;
            el_scratch_div.style.height = `${el_app_contents.offsetHeight - toolbar_height}px`;
            Blockly.svgResize(workspace);
        };

        window.addEventListener('resize', onWorkspaceResize);
        onWorkspaceResize();

        const handleDragOver = e => {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
        };

        const drop_zone = document.body;
        const { saveload } = ScratchStore.instance;

        drop_zone.addEventListener('dragover', handleDragOver, false);
        drop_zone.addEventListener('drop', e => saveload.handleFileChange(e), false);

        // disable overflow
        el_scratch_div.parentNode.style.overflow = 'hidden';
    } catch (error) {
        // TODO: Handle error.
        throw error;
    }
};

let interpreter = null;

export const runBot = (limitations = {}) => {
    // Disable blocks outside of any main or independent blocks.
    const top_blocks = Blockly.derivWorkspace.getTopBlocks();
    top_blocks.forEach(block => {
        if (!block.isMainBlock() && !block.isIndependentBlock()) {
            block.setDisabled(true);
        }
    });
    
    try {
        const code = `
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
            ${Blockly.JavaScript.workspaceToCode(Blockly.derivWorkspace)}
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
            }
            `;
        if (code) {
            if (interpreter !== null) {
                interpreter.stop(true);
                interpreter = null;
            }

            interpreter = new Interpreter();
            interpreter.run(code).catch(error => {
                globalObserver.emit('Error', error);
                interpreter.stop();
            });
        }
    } catch (error) {
        globalObserver.emit('Error', error);
        if (interpreter) {
            interpreter.stop();
        }
    }
};

export const stopBot = () => {
    if (interpreter) {
        interpreter.stop();
    }
};

export const terminateBot = () => {
    if (interpreter) {
        interpreter.terminateSession();
        interpreter = null;
    }
};
