import { loadRemote }                 from '../../../../utils';
import { translate }                  from '../../../../../utils/lang/i18n';
import { observer as globalObserver } from '../../../../../utils/observer';

Blockly.Blocks.loader = {
    init() {
        this.loadedByMe = [];
        this.loadedVariables = [];
        this.currentUrl = '';

        this.jsonInit(this.definition());

        const urlField = this.getField('URL');
        // eslint-disable-next-line no-underscore-dangle
        urlField.onFinishEditing_ = newValue => this.onFinishEditingUrl(newValue);
    },
    definition(){
        return {
            message0: translate('Load block from URL: %1'),
            args0   : [
                {
                    type: 'field_input',
                    name: 'URL',
                    text: 'http://www.example.com/block.xml',
                },
            ],
            colour         : Blockly.Colours.Utility.colour,
            colourSecondary: Blockly.Colours.Utility.colourSecondary,
            colourTertiary : Blockly.Colours.Utility.colourTertiary,
            tooltip        : translate('Loads blocks from URL'),
            category       : Blockly.Categories.Miscellaneous,
        };
    }, meta(){
        return {
            'display_name': translate('Loads from URL'),
            'description' : translate('This block allows you to load blocks from a URL. E.g. if you have blocks stored on a remote server and it’s accessible over the internet then you can dynamically load these blocks during bot run time.'),
        };
    },
    onFinishEditingUrl(newValue) {
        if (this.currentUrl === newValue) {
            return;
        }

        if (this.disabled) {
            const hasKnownUrl = this.workspace
                .getAllBlocks()
                .some(block => block.type === 'loader' && block.id !== this.id && block.currentUrl === this.currentUrl);
            if (hasKnownUrl) {
                this.setDisabled(false);
            }
        }

        const { recordUndo } = Blockly.Events;
        Blockly.Events.recordUndo = false;

        loadRemote(this)
            .then(() => {
                Blockly.Events.recordUndo = recordUndo;
                globalObserver.emit('ui.log.success', translate('Blocks are loaded successfully'));
            })
            .catch(errorMsg => {
                Blockly.Events.recordUndo = recordUndo;
                globalObserver.emit('ui.log.error', errorMsg);
            });

        this.currentUrl = this.getFieldValue('URL');
    },
    onchange(event) {
        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            this.currentUrl = this.getFieldValue('URL');
            this.workspace.getAllBlocks().forEach(block => {
                if (block.type === 'loader' && block.id !== this.id) {
                    if (block.currentUrl === this.currentUrl) {
                        this.setDisabled(true);
                    }
                }
            });
        }
    },
};

Blockly.JavaScript.loader = block => {
    if (block.loadedVariables.length) {
        // eslint-disable-next-line no-underscore-dangle
        return `var ${block.loadedVariables.map(v => Blockly.JavaScript.variableDB_.safeName_(v)).toString()}`;
    }
    return '';
};
