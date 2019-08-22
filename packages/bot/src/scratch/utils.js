import { saveAs }    from './shared';
import config        from '../constants/const';
import { translate } from '../utils/lang/i18n';

export const isMainBlock = blockType => config.mainBlocks.indexOf(blockType) >= 0;

export const oppositesToDropdownOptions = opposite_name => {
    return opposite_name.map(contract_type => {
        // i.e. [['CALL', translate('Rise')]] becomes [[translate('Rise'), 'CALL']];
        return Object.entries(contract_type)[0].reverse();
    });
};

export const cleanUpOnLoad = (blocksToClean, dropEvent) => {
    const { clientX = 0, clientY = 0 } = dropEvent || {};
    const blocklyMetrics = Blockly.mainWorkspace.getMetrics();
    const scaleCancellation = 1 / Blockly.mainWorkspace.scale;
    const blocklyLeft = blocklyMetrics.absoluteLeft - blocklyMetrics.viewLeft;
    const blocklyTop = document.body.offsetHeight - blocklyMetrics.viewHeight - blocklyMetrics.viewTop;
    const cursorX = clientX ? (clientX - blocklyLeft) * scaleCancellation : 0;
    let cursorY = clientY ? (clientY - blocklyTop) * scaleCancellation : 0;
    blocksToClean.forEach(block => {
        block.moveBy(cursorX, cursorY);
        block.snapToGrid();
        cursorY += block.getHeightWidth().height + Blockly.BlockSvg.MIN_BLOCK_Y;
    });
    // Fire an event to allow scrollbars to resize.
    Blockly.mainWorkspace.resizeContents();
};

export const setBlockTextColor = block => {
    Blockly.Events.recordUndo = false;
    if (block.inputList instanceof Array) {
        Array.from(block.inputList).forEach(inp =>
            inp.fieldRow.forEach(field => {
                if (field instanceof Blockly.FieldLabel) {
                    const svgElement = field.getSvgRoot();
                    if (svgElement) {
                        svgElement.style.setProperty('fill', 'white', 'important');
                    }
                }
            })
        );
    }
    const field = block.getField();
    if (field) {
        const svgElement = field.getSvgRoot();
        if (svgElement) {
            svgElement.style.setProperty('fill', 'white', 'important');
        }
    }
    Blockly.Events.recordUndo = true;
};

export const getBlockByType = type => Blockly.mainWorkspace.getAllBlocks().find(block => type === block.type);

export const getTopBlocksByType = type => Blockly.mainWorkspace.getTopBlocks().filter(block => type === block.type);

export const save = (filename = 'deriv-bot', collection = false, xmlDom) => {
    xmlDom.setAttribute('collection', collection ? 'true' : 'false');
    const data = Blockly.Xml.domToPrettyText(xmlDom);
    saveAs({ data, type: 'text/xml;charset=utf-8', filename: `${filename}.xml` });
};

const isProcedure = blockType => ['procedures_defreturn', 'procedures_defnoreturn'].indexOf(blockType) >= 0;

// dummy event to recover deleted blocks loaded by loader
class DeleteStray extends Blockly.Events.Abstract {
    constructor(block) {
        super(block);
        this.run(true);
    }

    run(redo) {
        const { recordUndo } = Blockly.Events;
        Blockly.Events.recordUndo = false;
        const sourceBlock = Blockly.mainWorkspace.getBlockById(this.blockId);
        if (!sourceBlock) {
            return;
        }
        if (redo) {
            sourceBlock.setFieldValue(`${sourceBlock.getFieldValue('NAME')} (deleted)`, 'NAME');
            sourceBlock.setDisabled(true);
        } else {
            sourceBlock.setFieldValue(sourceBlock.getFieldValue('NAME').replace(' (deleted)', ''), 'NAME');
            sourceBlock.setDisabled(false);
        }
        Blockly.Events.recordUndo = recordUndo;
    }
}
DeleteStray.prototype.type = 'deletestray';

export const deleteBlocksLoadedBy = (id, eventGroup = true) => {
    Blockly.Events.setGroup(eventGroup);
    Blockly.mainWorkspace.getTopBlocks().forEach(block => {
        if (block.loaderId === id) {
            if (isProcedure(block.type)) {
                if (block.getFieldValue('NAME').indexOf('deleted') < 0) {
                    Blockly.Events.fire(new DeleteStray(block));
                }
            } else {
                block.dispose();
            }
        }
    });
    Blockly.Events.setGroup(false);
};

export const addDomAsBlock = blockXml => {
    if (blockXml.tagName === 'variables') {
        return Blockly.Xml.domToVariables(blockXml, Blockly.mainWorkspace);
    }
    const blockType = blockXml.getAttribute('type');
    if (isMainBlock(blockType)) {
        Blockly.mainWorkspace
            .getTopBlocks()
            .filter(b => b.type === blockType)
            .forEach(b => b.dispose());
    }
    return Blockly.Xml.domToBlock(blockXml, Blockly.mainWorkspace);
};

const addDomAsBlockFromHeader = (blockXml /* , header = null */) => {
    // const oldVars = [...Blockly.mainWorkspace.variableList];
    const block = Blockly.Xml.domToBlock(blockXml, Blockly.mainWorkspace);
    /* Blockly.mainWorkspace.variableList = Blockly.mainWorkspace.variableList.filter(v => {
        if (oldVars.indexOf(v) >= 0) {
            return true;
        }
        header.loadedVariables.push(v);
        return false;
    });
    replaceDeletedBlock(block);
    Blockly.Events.fire(new Hide(block, header)); */
    return block;
};

const processLoaders = (xml, header = null) => {
    const promises = [];
    Array.from(xml.children).forEach(block => {
        if (block.getAttribute('type') === 'loader') {
            block.remove();

            const loader = header
                ? addDomAsBlockFromHeader(block, header)
                : Blockly.Xml.domToBlock(block, Blockly.mainWorkspace);

            promises.push(loadRemote(loader)); // eslint-disable-line no-use-before-define
        }
    });
    return promises;
};

export const addLoadersFirst = (xml, header = null) =>
    new Promise((resolve, reject) => {
        const promises = processLoaders(xml, header);
        if (promises.length) {
            Promise.all(promises).then(resolve, reject);
        } else {
            resolve([]);
        }
    });

const loadBlocksFromHeader = (blockStr = '', header) =>
    new Promise((resolve, reject) => {
        let xml;
        try {
            xml = Blockly.Xml.textToDom(blockStr);
        } catch (e) {
            reject(translate('Unrecognized file format.'));
        }
        try {
            if (xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true') {
                const { recordUndo } = Blockly.Events;
                Blockly.Events.recordUndo = false;
                addLoadersFirst(xml, header).then(
                    () => {
                        Array.from(xml.children)
                            .filter(
                                block =>
                                    block.getAttribute('type') === 'tick_analysis' ||
                                    isProcedure(block.getAttribute('type'))
                            )
                            .forEach(block => addDomAsBlockFromHeader(block, header));

                        Blockly.Events.recordUndo = recordUndo;
                        resolve();
                    },
                    e => {
                        Blockly.Events.recordUndo = recordUndo;
                        reject(e);
                    }
                );
            } else {
                reject(translate('Remote blocks to load must be a collection.'));
            }
        } catch (e) {
            reject(translate('Unable to load the block file.'));
        }
    });

export const loadRemote = blockObj =>
    new Promise((resolve, reject) => {
        let url = blockObj.getFieldValue('URL');
        if (url.indexOf('http') !== 0) {
            url = `http://${url}`;
        }
        if (!url.match(/[^/]*\.[a-zA-Z]{3}$/) && url.slice(-1)[0] !== '/') {
            reject(translate('Target must be an xml file'));
        } else {
            if (url.slice(-1)[0] === '/') {
                url += 'index.xml';
            }
            let isNew = true;
            getTopBlocksByType('loader').forEach(block => {
                if (block.id !== blockObj.id && block.url === url) {
                    isNew = false;
                }
            });
            if (!isNew) {
                blockObj.setDisabled(true);
                reject(translate('This url is already loaded'));
            } else {
                $.ajax({
                    type: 'GET',
                    url,
                })
                    .fail(e => {
                        if (e.status) {
                            reject(
                                Error(
                                    `${translate('An error occurred while trying to load the url')}: ${e.status} ${
                                        e.statusText
                                    }`
                                )
                            );
                        } else {
                            reject(
                                Error(
                                    translate(
                                        'Make sure \'Access-Control-Allow-Origin\' exists in the response from the server'
                                    )
                                )
                            );
                        }
                        deleteBlocksLoadedBy(blockObj.id);
                    })
                    .done(xml => {
                        loadBlocksFromHeader(xml, blockObj).then(() => {
                            blockObj.setDisabled(false);
                            blockObj.url = url; // eslint-disable-line no-param-reassign
                            resolve(blockObj);
                        }, reject);
                    });
            }
        }
    });

export const cleanBeforeExport = xml => {
    Array.from(xml.children).forEach(blockDom => {
        const blockId = blockDom.getAttribute('id');
        if (!blockId) return;
        const block = Blockly.mainWorkspace.getBlockById(blockId);
        if ('loaderId' in block) {
            blockDom.remove();
        }
    });
};
