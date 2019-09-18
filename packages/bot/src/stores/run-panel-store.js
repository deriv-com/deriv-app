export default class RunPanelStore {
    runBot = () => {
        console.log('running...'); // eslint-disable-line no-console
        Blockly.BLOCKLY_CLASS_OLD.run();
    }

    stopBot = () => {
        console.log('stopped'); // eslint-disable-line no-console
        Blockly.BLOCKLY_CLASS_OLD.stop();
    }
}
