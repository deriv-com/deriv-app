import fs from 'fs';
import glob from 'glob';
import postcss from 'postcss';

const plugin = () => ({
    Once(root) {
        root.walkRules(rule => {
            rule.walkDecls(decl => {
                if (decl.value.includes('px')) {
                    decl.value = decl.value.replace(/(\d+(\.\d+)?)px/g, (match, pxValue) => {
                        const newValue = parseFloat(pxValue) / 10;
                        return `${newValue.toFixed(1)}rem`;
                    });
                }
            });
        });
    },
    postcssPlugin: 'postcss-px-to-rem',
});

plugin.postcss = true;

const plugins = [plugin];
const processor = postcss(plugins);

const transform = async () => {
    const files = glob.sync('./packages/wallets/src/**/*.scss');

    const filePromises = files.map(async file => {
        const contents = fs.readFileSync(file).toString();
        const result = await processor.process(contents, { from: undefined });
        fs.writeFileSync(file, result.css);
    });

    await Promise.all(filePromises);
};

transform();
