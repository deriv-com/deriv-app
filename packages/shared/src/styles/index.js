const path = require("path");

const resources = ["constants.scss", "mixins.scss", "fonts.scss", "themes.scss", "devices.scss", "reset.scss", "inline-icons.scss"];

module.exports = resources.map(file => path.resolve(__dirname , 'styles' , file));
