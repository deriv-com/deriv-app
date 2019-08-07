const path = require("path");

const resources = ["colors.scss", "devices.scss", "fonts.scss" , "reset.scss" , "theme.scss"];

module.exports = resources.map(file => path.resolve(__dirname , 'styles' , file));
