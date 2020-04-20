module.exports = function(source, map) {
    return this.callback(
        null,
        source.replace(/import(\s*)React(\s*)from 'react';/, "import$1* as React$2from 'react';"),
        map
    );
};
