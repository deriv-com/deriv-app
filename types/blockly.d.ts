interface Blockly {
    derivWorkspace: {
        asyncClear: () => void;
    };
    Xml: {
        domToText: (arg0: unknown) => string;
        textToDom: (arg0: string) => unknown;
    };
    Block: {
        newBlock: (type: string) => unknown;
        getMainWorkspace: () => unknown;
        Variables: {
            createVariable: (workspace: unknown, type: string, name: string, id?: string) => unknown;
            allUsedVarModels: (workspace: unknown) => unknown[];
        };
    };
    FieldDropdown: {
        newDropdownMenu: (options: unknown[], opt_changeHandler?: unknown) => unknown;
    };
    Field: {
        newField: (fieldType: string, opt_value?: string) => unknown;
    };
    Events: {
        setGroup: (isOn: boolean) => void;
        setBlockId: (blockId: string) => void;
        setRecordUndo: (isOn: boolean) => void;
    };
}
