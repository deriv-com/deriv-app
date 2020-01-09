import { localize }            from '@deriv/translations';
import { removeLimitedBlocks } from './workspace';
import BlockConversion         from '../backward-compatibility';
import { saveAs }              from '../shared';
import config                  from '../../constants';
import ScratchStore            from '../../stores/scratch-store';

export const isMainBlock = block_type => config.mainBlocks.indexOf(block_type) >= 0;

export const oppositesToDropdownOptions = opposite_name => {
    return opposite_name.map(contract_type => {
        // i.e. [['CALL', localize('Rise')]] becomes [[localize('Rise'), 'CALL']];
        return Object.entries(contract_type)[0].reverse();
    });
};

export const cleanUpOnLoad = (blocks_to_clean, drop_event) => {
    const {
        clientX = 0,
        clientY = 0 }        = drop_event || {};
    const toolbar_height     = 76;
    const blockly_metrics    = Blockly.derivWorkspace.getMetrics();
    const scale_cancellation = 1 / Blockly.derivWorkspace.scale;
    const blockly_left       = blockly_metrics.absoluteLeft - blockly_metrics.viewLeft;
    const blockly_top        = document.body.offsetHeight - blockly_metrics.viewHeight - blockly_metrics.viewTop;
    const cursor_x           = clientX ? (clientX - blockly_left) * scale_cancellation : 0;
    const cursor_y           = clientY ? (clientY - blockly_top - toolbar_height) * scale_cancellation : 0;

    Blockly.derivWorkspace.cleanUp(cursor_x, cursor_y, blocks_to_clean);
};

export const setBlockTextColor = (block, event) => {
    const is_legal_event =
        event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(block.id) ||
        event.type === Blockly.Events.BLOCK_CHANGE && event.blockId === block.id;

    if (!is_legal_event) {
        return;
    }

    const addClassAttribute = (field) => {
        const el_svg = field.getSvgRoot();
        if (el_svg) {
            el_svg.setAttribute('class', 'blocklyTextRootBlockHeader');
        }
    };

    block.inputList.forEach(input => {
        input.fieldRow.forEach(field => {
            if (field instanceof Blockly.FieldLabel) {
                addClassAttribute(field);
            }
        });
    });

    const field = block.getField();
    if (field) {
        addClassAttribute(field);
    }
};

export const save = (filename = '@deriv/bot', collection = false, xmlDom) => {
    xmlDom.setAttribute('is_dbot', 'true');
    xmlDom.setAttribute('collection', collection ? 'true' : 'false');

    const data = Blockly.Xml.domToPrettyText(xmlDom);
    saveAs({ data, type: 'text/xml;charset=utf-8', filename: `${filename}.xml` });
};

export const load = (block_string, drop_event) => {
    const { journal, run_panel } = ScratchStore.instance.root_store;

    const showInvalidStrategyError = () => {
        const error_message = localize('XML file contains unsupported elements. Please check or modify file.');

        journal.onError(error_message);
        run_panel.setActiveTabIndex(2);
    };

    // Check if XML can be parsed correctly.
    try {
        const xmlDoc = new DOMParser().parseFromString(block_string, 'application/xml');

        if (xmlDoc.getElementsByTagName('parsererror').length) {
            return showInvalidStrategyError();
        }
    } catch (e) {
        return showInvalidStrategyError();
    }

    let xml;

    // Check if XML can be parsed into a strategy.
    try {
        xml = Blockly.Xml.textToDom(block_string);
    } catch (e) {
        return showInvalidStrategyError();
    }

    const blockConversion = new BlockConversion();
    xml = blockConversion.convertStrategy(xml);

    const blockly_xml = xml.querySelectorAll('block');

    // Check if there are any blocks in this strategy.
    if (!blockly_xml.length) {
        return showInvalidStrategyError();
    }

    // Check if all block types in XML are allowed.
    const has_invalid_blocks = Array.from(blockly_xml).some(block => {
        const block_type = block.getAttribute('type');
        return !Object.keys(Blockly.Blocks).includes(block_type);
    });

    if (has_invalid_blocks) {
        return showInvalidStrategyError();
    }

    try {
        const event_group = `dbot-load${Date.now()}`;

        Blockly.Events.setGroup(event_group);
        removeLimitedBlocks(Blockly.derivWorkspace, Array.from(blockly_xml).map(xml_block => xml_block.getAttribute('type')));

        if (xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true') {
            loadBlocks(xml, drop_event, event_group);
        } else {
            loadWorkspace(xml, event_group);
        }

        // Set user disabled state on all disabled blocks. This ensures we don't change the disabled
        // state through code, which was implemented for user experience.
        Blockly.derivWorkspace.getAllBlocks().forEach(block => {
            if (block.disabled) {
                block.is_user_disabled_state = true;
            }
        });

        // Dispatch resize event for comments.
        window.dispatchEvent(new Event('resize'));
        journal.onLogSuccess(localize('Blocks are loaded successfully'));
    } catch (e) {
        console.log(e); // eslint-disable-line
        return showInvalidStrategyError();
    }

    return true;
};

const loadBlocks = (xml, drop_event, event_group) => {
    Blockly.Events.setGroup(event_group);

    const workspace    = Blockly.derivWorkspace;
    const block_ids    = Blockly.Xml.domToWorkspace(xml, workspace);
    const added_blocks = block_ids.map(block_id => workspace.getBlockById(block_id));

    if (drop_event && Object.keys(drop_event).length !== 0) {
        cleanUpOnLoad(added_blocks, drop_event);
    } else {
        workspace.cleanUp();
    }
};

const loadWorkspace = (xml, event_group) => {
    const workspace = Blockly.derivWorkspace;

    Blockly.Events.setGroup(event_group);
    workspace.clear();

    Blockly.Xml.domToWorkspace(xml, workspace);
};

const loadBlocksFromHeader = (xml_string, block) => {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
        let xml;

        try {
            xml = Blockly.Xml.textToDom(xml_string);
        } catch (error) {
            return reject(localize('Unrecognized file format'));
        }

        try {
            const is_collection = xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true';

            if (!is_collection) {
                reject(localize('Remote blocks to load must be a collection.'));
            }

            addLoaderBlocksFirst(xml).then(() => {
                Array.from(xml.children).forEach(el_block => addDomAsBlock(el_block, block));
                resolve();
            }).catch(() => {
                reject();
            });
        } catch (e) {
            reject(localize('Unable to load the block file.'));
        }
    });
};

export const loadBlocksFromRemote = (block) => {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
        let url = block.getFieldValue('URL');

        if (url.indexOf('http') === -1) {
            url = `http://${url}`;
        }

        const url_pattern                    = /[^/]*\.[a-zA-Z]{3}$/;
        const has_possible_missing_index_xml = url.slice(-1)[0] === '/';

        if (!url.match(url_pattern) && !has_possible_missing_index_xml) {
            return reject(localize('Target must be an XML file'));
        }

        if (has_possible_missing_index_xml) {
            url += 'index.xml';
        }

        if (block.isKnownUrl(url)) {
            block.setDisabled(true);
            return reject(localize('This URL is already loaded'));
        }

        const onFetchError = () => reject(localize('An error occured while trying to load the URL'));

        fetch(url).then(response => {
            if (response.ok) {
                response.text().then(xml_string => {
                    loadBlocksFromHeader(xml_string, block)
                        .then(() => resolve(block))
                        .catch(onFetchError);
                });
            } else {
                onFetchError();
            }
        }).catch(onFetchError);
    });
};

export const addLoaderBlocksFirst = (xml) => {
    return new Promise((resolve, reject) => {
        const promises     = [];

        Array.from(xml.children).forEach(el_block => {
            const block_type = el_block.getAttribute('type');

            if (block_type === 'loader') {
                el_block.remove();
                const loader = Blockly.Xml.domToBlock(el_block, Blockly.derivWorkspace);
                promises.push(loadBlocksFromRemote(loader)); // eslint-disable-line no-use-before-define
            }
        });

        if (promises.length) {
            Promise.all(promises).then(resolve, reject);
        } else {
            resolve([]);
        }
    });
};

export const addDomAsBlock = (el_block, parent_block = null) => {
    if (el_block.tagName.toLowerCase() === 'variables') {
        return Blockly.Xml.domToVariables(el_block, Blockly.derivWorkspace);
    }

    const block_type       = el_block.getAttribute('type');
    const block_conversion = new BlockConversion();
    const block_xml        = Blockly.Xml.blockToDom(block_conversion.convertBlockNode(el_block));

    // Fix legacy Blockly `varid` attribute.
    Array.from(block_xml.getElementsByTagName('arg')).forEach(el => {
        if (el.hasAttribute('varid')) {
            el.setAttribute('varId', el.getAttribute('varid'));
        }
    });

    removeLimitedBlocks(Blockly.derivWorkspace, block_type);

    const block = Blockly.Xml.domToBlock(block_xml, Blockly.derivWorkspace);

    if (parent_block) {
        parent_block.blocks_added_by_me.push(block);
    }

    return block;
};

export const hasAllRequiredBlocks = (workspace) => {
    const blocks_in_workspace     = workspace.getAllBlocks();
    const { mandatoryMainBlocks } = config;
    const required_block_types    = ['trade_definition_tradeoptions', ...mandatoryMainBlocks];
    const all_block_types         = blocks_in_workspace.map(block => block.type);
    const has_all_required_blocks = required_block_types.every(block_type => all_block_types.includes(block_type));

    return has_all_required_blocks;
};

export const scrollWorkspace = (workspace, scroll_amount, is_horizontal, is_chronological) => {
    const ws_metrics = workspace.getMetrics();

    let scroll_x = ws_metrics.viewLeft - ws_metrics.contentLeft;
    let scroll_y = ws_metrics.viewTop - ws_metrics.contentTop;

    if (is_horizontal) {
        scroll_x += (is_chronological ? scroll_amount : -scroll_amount);
    } else {
        scroll_y += (is_chronological ? scroll_amount : -scroll_amount);
    }

    workspace.scrollbar.set(scroll_x, scroll_y);
};

/**
 * Sets the Blockly.Events.group_ and executes the passed callBackFn. Mainly
 * used to ensure undo/redo actions are executed correctly.
 * @param {Boolean} use_existing_group Uses the existing event group if true.
 * @param {Function} callbackFn Logic to execute as part of this event group.
 */
export const runGroupedEvents = (use_existing_group, callbackFn, opt_group_name) => {
    const group = use_existing_group && Blockly.Events.getGroup() || opt_group_name || true;

    Blockly.Events.setGroup(group);
    callbackFn();

    if (!use_existing_group) {
        Blockly.Events.setGroup(false);
    }
};

/**
 * Sets the recordUndo flag to "false" globally, this will ensure any events
 * happening as part of the callbackFn logic cannot be undone.
 * @param {*} callbackFn Logic to execute as part of this event group.
 */
export const runIrreversibleEvents = (callbackFn) => {
    const { recordUndo }      = Blockly.Events;
    Blockly.Events.recordUndo = false;

    callbackFn();

    Blockly.Events.recordUndo = recordUndo;
};

/**
 * Disables Blockly Events globally and runs the passed callbackFn.
 * (Preference should be given to runIrreversibleEvents).
 * @param {*} callbackFn Logic to completely hide from Blockly
 */
export const runInvisibleEvents = (callbackFn) => {
    Blockly.Events.disable();
    callbackFn();
    Blockly.Events.enable();
};

export const updateDisabledBlocks = (workspace, event) => {
    if (event.type === Blockly.Events.END_DRAG) {
        workspace.getAllBlocks().forEach(block => {
            if (!block.getParent() || block.is_user_disabled_state) {
                return;
            }

            const restricted_parents = block.restricted_parents || [];
            if (restricted_parents.length === 0) {
                return;
            }
    
            const should_disable = !(restricted_parents.some(restricted_parent =>
                block.isDescendantOf(restricted_parent)
            ));
    
            runGroupedEvents(true, () => {
                block.setDisabled(should_disable);
            }, event.group);

            Blockly.Events.setGroup(false);
        });
    }
};

export const emptyTextValidator = (input) => {
    return !input || input === '\'\'';
};
