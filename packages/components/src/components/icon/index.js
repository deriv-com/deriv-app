const req = require.context('./svg/', false, /\.svg$/);

const icons = {};
req.keys().forEach(fileName => {
    const prefix_ic  = /.\/icon-/.test(fileName) ? './icon' : '';
    const prefix_img = /.\/img-/.test(fileName) ? './img' : '';
    const iconName = fileName
        .split(prefix_ic || prefix_img)[1]  // remove prefixes
        .split('.svg')[0]                   // remove .svg
        .replace(/-([a-z])/g,  (m, w) => w.toUpperCase()); // convert to PascalCase

    import(`./svg/${fileName.split('./')[1]}`).then(module => {
        icons[`Icon${iconName}`] = module.default;
    });
});

module.exports = icons;
