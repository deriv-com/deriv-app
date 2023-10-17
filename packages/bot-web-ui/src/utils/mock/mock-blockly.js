const mockFuntion = () => ({});

export const mockBlockly = (props = {}) => ({
    Colours: {
        RootBlock: props?.RootBlock ?? {},
    },
    derivWorkspace: {
        svgBlockCanvas_: {
            getBoundingClientRect: props?.derivWorkspace?.svgBlockCanvas_?.getBoundingClientRect ?? mockFuntion,
        },
        options: {
            readOnly: props?.derivWorkspace?.options?.readOnly ?? true,
        },
    },
    Xml: {
        textToDom:
            props?.Xml?.textToDom ??
            function () {
                return {
                    childNodes: [
                        {
                            tagName: 'examples',
                        },
                    ],
                };
            },
    },
});
