const getPascalCase = str => {
    if (!str) return '';
    return (
        String(str)
            .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '$')
            .replace(/[^_A-Za-z0-9]+/g, '$')
            .replace(/([a-z])([A-Z])/g, (m, a, b) => `${a}$${b}`)
            // .toLowerCase()
            .replace(/(\$)(\w?)/g, (m, a, b) => b.toUpperCase())
    );
};

const getIconNameFromPath = path => getPascalCase(path.match(/([^/]*)\/*$/)[1].replace('.svg', ''));

module.exports = {
    getIconNameFromPath,
};
