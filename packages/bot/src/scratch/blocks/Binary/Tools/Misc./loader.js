import { loadBlocksFromRemote }                 from '../../../../utils';
import { translate }                  from '../../../../../utils/lang/i18n';
import { observer as globalObserver } from '../../../../../utils/observer';

Blockly.Blocks.loader = {
    init() {
        this.current_url            = '';
        this.jsonInit(this.definition());

        const urlField = this.getField('URL');
        // eslint-disable-next-line no-underscore-dangle
        urlField.onFinishEditing_ = new_url => this.onFinishEditingUrl(new_url);
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
            colour         : Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary : Blockly.Colours.Base.colourTertiary,
            tooltip        : translate('Loads blocks from URL'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta(){
        return {
            'display_name': translate('Loads from URL'),
            'description' : translate('This block allows you to load blocks from a URL. E.g. if you have blocks stored on a remote server and it’s accessible over the internet then you can dynamically load these blocks during bot run time.'),
        };
    },
    onFinishEditingUrl(new_url) {
        if (this.isKnownUrl(new_url)) {
            globalObserver.emit('ui.log.error', translate('Blocks from this URL are already loaded'));
            this.setDisabled(true);
        }

        if (this.current_url === new_url) {
            return;
        }

        this.setDisabled(false);
        this.loadBlocksFromCurrentUrl();
    },
    onchange(event) {
        if (!this.workspace || this.isInFlyout) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            this.current_url    = this.getFieldValue('URL');
            const loader_blocks = this.workspace.getAllBlocks().filter(block => block.type === 'loader');

            loader_blocks.forEach(loader_block => {
                if (loader_block.id !== this.id && loader_block.current_url === this.current_url) {
                    this.setDisabled(true);
                }
            });
        }

        if (event.type === Blockly.Events.BLOCK_CHANGE && event.blockId === this.id) {
            if (event.oldValue !== event.newValue) {
                this.loadBlocksFromCurrentUrl();
            }
        }
    },
    loadBlocksFromCurrentUrl() {
        const { recordUndo } = Blockly.Events;
        Blockly.Events.recordUndo = false;

        loadBlocksFromRemote(this).then(() => {
            Blockly.Events.recordUndo = recordUndo;
            globalObserver.emit('ui.log.success', translate('Blocks are loaded successfully'));
            this.current_url = this.getFieldValue('URL');
        }).catch(error_msg => {
            Blockly.Events.recordUndo = recordUndo;
            globalObserver.emit('ui.log.error', error_msg);
            this.setDisabled(true);
        });
    },
    isKnownUrl(url) {
        const loader_blocks = this.workspace.getAllBlocks().filter(block => block.type === 'loader');
        return loader_blocks.some(block => block.id !== this.id && block.current_url === url);
    },
};

Blockly.JavaScript.loader = () => {};
