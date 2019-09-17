import './blocks';
import './hooks';
import {
    save,
    addLoadersFirst,
    cleanUpOnLoad,
    addDomAsBlock,
    cleanBeforeExport,
}                                     from './utils';
import Interpreter                    from '../services/tradeEngine/utils/interpreter';
import createError                    from '../utils/error';
import { translate }                  from '../utils/lang/i18n';
import { observer as globalObserver } from '../utils/observer';

export const scratchWorkspaceInit = async () => {
    try {
        // const el_scratch_area = document.getElementById('scratch_area');
        const el_scratch_div = document.getElementById('scratch_div');
        const el_app_contents = document.getElementById('app_contents');

        // eslint-disable-next-line
        const toolbox_xml = await fetch(`${__webpack_public_path__}xml/toolbox.xml`).then(response => response.text());
        // eslint-disable-next-line
        const main_xml = await fetch(`${__webpack_public_path__}xml/main.xml`).then(response => response.text());

        const workspace = Blockly.inject(el_scratch_div, {
            grid    : { spacing: 40, length: 11, colour: '#ebebeb' },
            media   : `${__webpack_public_path__}media/`, // eslint-disable-line
            toolbox : toolbox_xml,
            trashcan: true,
            zoom    : { wheel: true },
        });

        Blockly.derivWorkspace = workspace;

        // Ensure flyout closes on click in workspace.
        const el_blockly_svg = document.querySelector('.blocklySvg');
        document.addEventListener('click', (event) => {
            if (el_blockly_svg.contains(event.target)) {
                Blockly.derivWorkspace.toolbox_.clearSelection(); // eslint-disable-line
            }
        });

        // Keep XML in memory to allow multilevel categories
        Blockly.derivWorkspace.initial_toolbox_xml = toolbox_xml;
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(main_xml), Blockly.derivWorkspace);

        const onWorkspaceResize = () => {
            // let element = el_scratch_area;
            // let x = 0;
            // let y = 0;
        
            // do {
            //     x += element.offsetLeft;
            //     y += element.offsetTop;
            //     element = element.offsetParent;
            // } while (element);
        
            // // Position scratch_div over scratch_area.
            // el_scratch_div.style.left   = `${x}px`;
            // el_scratch_div.style.top    = `${y}px`;

            // el_scratch_div.style.left   = '0px';
            // el_scratch_div.style.top    = '0px';
            el_scratch_div.style.width  = `${el_app_contents.offsetWidth}px`;
            el_scratch_div.style.height = `${el_app_contents.offsetHeight}px`;
            
            Blockly.svgResize(workspace);

            // eslint-disable-next-line no-underscore-dangle
            workspace.toolbox_.flyout_.position();
            
            // Center on first root block, if applicable.
            const top_blocks = workspace.getTopBlocks(true);

            if (top_blocks.length > 0) {
                workspace.centerOnBlock(top_blocks[0].id);
            }
        };

        window.addEventListener('resize', onWorkspaceResize);
        onWorkspaceResize();
    } catch (error) {
        // TODO: Handle error.
        throw error;
    }
};

const disableStrayBlocks = () => {
    const top_blocks = Blockly.derivWorkspace.getTopBlocks();

    top_blocks.forEach(block => {
        if (block.isMainBlock() || !block.isIndependentBlock()) {
            block.setDisabled(true);
        }
    });
};

export const loadWorkspace = xml => {
    Blockly.Events.setGroup('load');
    Blockly.mainWorkspace.clear();

    Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
    addLoadersFirst(xml).then(
        () => {
            Blockly.Events.setGroup(false);
            globalObserver.emit('ui.log.success', translate('Blocks are loaded successfully'));
        },
        e => {
            Blockly.Events.setGroup(false);
            throw e;
        }
    );
};

export const loadBlocks = (xml, dropEvent = {}) => {
    const variables = xml.getElementsByTagName('variables');
    if (variables.length > 0) {
        Blockly.Xml.domToVariables(variables[0], Blockly.mainWorkspace);
    }
    Blockly.Events.setGroup('load');
    addLoadersFirst(xml).then(
        loaders => {
            const addedBlocks = [
                ...loaders,
                ...Array.from(xml.children)
                    .map(block => addDomAsBlock(block))
                    .filter(b => b),
            ];
            cleanUpOnLoad(addedBlocks, dropEvent);
            globalObserver.emit('ui.log.success', translate('Blocks are loaded successfully'));
        },
        e => {
            throw e;
        }
    );
};

export default class _Blockly {
    /* eslint-disable class-methods-use-this */
    zoomOnPlusMinus(zoomIn) {
        const metrics = Blockly.mainWorkspace.getMetrics();
        if (zoomIn) {
            Blockly.mainWorkspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, 1);
        } else {
            Blockly.mainWorkspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, -1);
        }
    }

    resetWorkspace() {
        Blockly.Events.setGroup('reset');
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(this.blocksXmlStr), Blockly.mainWorkspace);
        Blockly.Events.setGroup(false);
    }

    /* eslint-disable class-methods-use-this */
    cleanUp() {
        Blockly.Events.setGroup(true);
        const topBlocks = Blockly.mainWorkspace.getTopBlocks(true);
        let cursorY = 0;
        topBlocks.forEach(block => {
            if (block.getSvgRoot().style.display !== 'none') {
                const xy = block.getRelativeToSurfaceXY();
                block.moveBy(-xy.x, cursorY - xy.y);
                block.snapToGrid();
                cursorY =
                    block.getRelativeToSurfaceXY().y + block.getHeightWidth().height + Blockly.BlockSvg.MIN_BLOCK_Y;
            }
        });
        Blockly.Events.setGroup(false);
        // Fire an event to allow scrollbars to resize.
        Blockly.mainWorkspace.resizeContents();
    }

    /* eslint-disable class-methods-use-this */
    load(blockStr = '', dropEvent = {}) {
        let xml;

        try {
            xml = Blockly.Xml.textToDom(blockStr);
        } catch (e) {
            throw createError('FileLoad', translate('Unrecognized file format'));
        }

        try {
            if (xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true') {
                loadBlocks(xml, dropEvent);
            } else {
                loadWorkspace(xml);
            }
        } catch (e) {
            throw createError('FileLoad', translate('Unable to load the block file'));
        }
    }

    /* eslint-disable class-methods-use-this */
    save(arg) {
        const { filename, collection } = arg;

        const xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        cleanBeforeExport(xml);

        save(filename, collection, xml);
    }

    run(limitations = {}) {
        disableStrayBlocks();

        let code;
        try {
            code = `
var BinaryBotPrivateInit, BinaryBotPrivateStart, BinaryBotPrivateBeforePurchase, BinaryBotPrivateDuringPurchase, BinaryBotPrivateAfterPurchase;
var BinaryBotPrivateLastTickTime
var BinaryBotPrivateTickAnalysisList = [];
function BinaryBotPrivateRun(f, arg) {
 if (f) return f(arg);
 return false;
}
function BinaryBotPrivateTickAnalysis() {
 var currentTickTime = Bot.getLastTick(true).epoch
 if (currentTickTime === BinaryBotPrivateLastTickTime) {
   return
 }
 BinaryBotPrivateLastTickTime = currentTickTime
 for (var BinaryBotPrivateI = 0; BinaryBotPrivateI < BinaryBotPrivateTickAnalysisList.length; BinaryBotPrivateI++) {
   BinaryBotPrivateRun(BinaryBotPrivateTickAnalysisList[BinaryBotPrivateI]);
 }
}
var BinaryBotPrivateLimitations = ${JSON.stringify(limitations)};
${Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace)}
BinaryBotPrivateRun(BinaryBotPrivateInit);
while(true) {
 BinaryBotPrivateTickAnalysis();
 BinaryBotPrivateRun(BinaryBotPrivateStart)
 while(watch('before')) {
   BinaryBotPrivateTickAnalysis();
   BinaryBotPrivateRun(BinaryBotPrivateBeforePurchase);
 }
 while(watch('during')) {
   BinaryBotPrivateTickAnalysis();
   BinaryBotPrivateRun(BinaryBotPrivateDuringPurchase);
 }
 BinaryBotPrivateTickAnalysis();
 if(!BinaryBotPrivateRun(BinaryBotPrivateAfterPurchase)) {
   break;
 }
}
       `;
            this.generatedJs = code;
            if (code) {
                this.stop(true);
                this.interpreter = new Interpreter();
                this.interpreter.run(code).catch(e => {
                    globalObserver.emit('Error', e);
                    this.stop();
                });
            }
        } catch (e) {
            globalObserver.emit('Error', e);
            this.stop();
        }
    }

    stop(stopBeforeStart) {
        if (!stopBeforeStart) {
            const $runButtons = $('#runButton, #summaryRunButton');
            const $stopButtons = $('#stopButton, #summaryStopButton');
            if ($runButtons.is(':visible') || $stopButtons.is(':visible')) {
                $runButtons.show();
                $stopButtons.hide();
            }
        }
        if (this.interpreter) {
            this.interpreter.stop();
            this.interpreter = null;
        }
    }

    /* eslint-disable class-methods-use-this */
    undo() {
        Blockly.Events.setGroup('undo');
        Blockly.mainWorkspace.undo();
        Blockly.Events.setGroup(false);
    }

    /* eslint-disable class-methods-use-this */
    redo() {
        Blockly.mainWorkspace.undo(true);
    }

    /* eslint-disable class-methods-use-this */
    hasStarted() {
        return this.interpreter && this.interpreter.hasStarted();
    }
    /* eslint-enable */
}
