const path = require("path");

const resources = ["constants.scss", "fonts.scss" , "devices.scss", "reset.scss" , "themes.scss"];

module.exports = resources.map(file => path.resolve(__dirname , 'styles' , file));
