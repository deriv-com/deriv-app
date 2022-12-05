import { SourceMap } from 'module';

type Tthis = {
    callback: any;
    emitError: any;
};
module.exports = function (this: Tthis, source: string, map: SourceMap) {
    if (/import\s*React,/.test(source)) {
        this.emitError(
            new Error(
                'Please do not use named imports for React. Use the format `import React` with the `React.` prefix.'
            )
        );
    }

    return this.callback(
        null,
        source.replace(/import(\s*)React(\s*)from 'react';/, "import$1* as React$2from 'react';"),
        map
    );
};
