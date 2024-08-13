import { load, save_types } from '@deriv/bot-skeleton';

export const handleOnConfirmAccumulator = async () => {
    const strategy_xml = await import(
        /* webpackChunkName: `[request]` */ '@deriv/bot-skeleton/src/scratch/xml/main.xml'
    );
    const strategy_dom = Blockly.utils.xml.textToDom(strategy_xml.default);
    const modifyFieldDropdownValues = (name: string, value: string) => {
        const name_list = `${name.toUpperCase()}_LIST`;
        const el_blocks = strategy_dom?.querySelectorAll(`field[name="${name_list}"]`);

        el_blocks?.forEach((el_block: HTMLElement) => {
            el_block.textContent = value;
        });
    };
    modifyFieldDropdownValues('tradetypecat', 'accumulator');

    const { derivWorkspace: workspace } = Blockly;

    await load({
        block_string: Blockly.Xml.domToText(strategy_dom),
        file_name: 'Strategy with accumulator trade type',
        workspace,
        from: save_types.UNSAVED,
        drop_event: null,
        strategy_id: null,
        showIncompatibleStrategyDialog: null,
    });
};
