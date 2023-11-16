/* eslint-disable sort-keys */
import fs from 'fs';
import glob from 'glob';
import postcss from 'postcss';

const colors = {
    '#0e0e0e': '$color_black',
    '#333333': '$color_black_1',
    '#151717': '$color_black_3',
    '#1d1f20': '$color_black_4',
    '#242828': '$color_black_5',
    '#3e3e3e': '$color_black_6',
    '#000000': '$color_black_7',
    '#323738': '$color_black_8',
    '#5c5c5c': '$color_black_9',
    '#377cfc': '$color_blue',
    '#0dc2e7': '$color_blue_1',
    '#2a3052': '$color_blue_2',
    '#0796e0': '$color_blue_3',
    '#0677af': '$color_blue_4',
    '#dfeaff': '$color_blue_5',
    '#92b8ff': '$color_blue_6',
    '#182130': '$color_blue_7',
    '#e6f5ff': '$color_blue_8',
    '#664407': '$color_brown',
    '#85acb0': '$color_green',
    '#4bb4b3': '$color_green_1',
    '#3d9494': '$color_green_2',
    '#00a79e': '$color_green_3',
    '#008079': '$color_green_4',
    '#4bb4b329': '$color_green_5',
    '#17eabd': '$color_green_6',
    '#e8fdf8': '$color_green_7',
    '#c2c2c2': '$color_grey',
    '#999999': '$color_grey_1',
    '#f2f3f4': '$color_grey_2',
    '#eaeced': '$color_grey_3',
    '#e6e9e9': '$color_grey_4',
    '#d6dadb': '$color_grey_5',
    '#d6d6d6': '$color_grey_6',
    '#6e6e6e': '$color_grey_7',
    '#d7d7d7': '$color_grey_8',
    '#868686': '$color_grey_9',
    '#919191': '$color_grey_10',
    '#fafafa': '$color_grey_11',
    '#f5f7fa': '$color_grey_12',
    '#2e2e2e': '$color_grey_13',
    '#ff6444': '$color_orange',
    '#722fe4': '$color_purple',
    '#ff444f': '$color_red',
    '#ec3f3f': '$color_red_1',
    '#cc2e3d': '$color_red_2',
    '#a32430': '$color_red_3',
    '#d33636': '$color_red_4',
    '#eb3e48': '$color_red_5',
    '#ec3f3f29': '$color_red_6',
    '#ffe1e3': '$color_red_7',
    '#661b20': '$color_red_8',
    '#b33037': '$color_red_9',
    '#4a3871': '$color_violet',
    '#ffffff': '$color_white',
    '#ffad3a': '$color_yellow',
    '#b3760d': '$color_yellow_1',
    '#ffa912': '$color_yellow_2',
};

function expandHexColor(shortHex) {
    const isShortHex = /^#[0-9A-F]{3}$/i.test(shortHex);

    if (!isShortHex) {
        return shortHex;
    }

    const expandedHex = shortHex.replace(/[0-9A-F]/gi, char => char + char);
    return expandedHex;
}

const plugin = () => {
    return {
        postcssPlugin: 'postcss-constants-mapper',
        Once(root) {
            root.walkRules(rule => {
                rule.walkDecls(decl => {
                    if (/#[0-9a-fA-F]{3,6}/.test(decl.value)) {
                        const hashIndex = decl.value.indexOf('#');
                        const hashEndIndex = hashIndex + 6 <= decl.value.length ? hashIndex + 6 : hashIndex + 3;
                        const hashValue = decl.value.slice(hashIndex, hashEndIndex + 1);

                        const shortenHex = hashValue.length === 4 ? expandHexColor(hashValue) : hashValue;
                        if (colors[shortenHex]) {
                            decl.value =
                                decl.value.slice(0, hashIndex) +
                                colors[shortenHex] +
                                decl.value.slice(hashEndIndex + 1, decl.value.length);
                        }
                    }
                });
            });
        },
    };
};

plugin.postcss = true;

const plugins = [plugin];
const processor = postcss(plugins);

const transform = async () => {
    const files = glob.sync('./packages/wallets/src/**/*.scss');

    const filePromises = files.map(async file => {
        // if (!/\/Base\//.test(file)) {
        const contents = fs.readFileSync(file).toString();
        const result = await processor.process(contents, { from: undefined });
        fs.writeFileSync(file, result.css);
        // }
    });

    await Promise.all(filePromises);
};

transform();
