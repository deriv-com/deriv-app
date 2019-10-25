// import { configure, addDecorator } from '@storybook/react';
// import { withInfo } from '@storybook/addon-info';

// addDecorator(
//     withInfo({
//       header: false, // Global configuration for the info addon across all of your stories.
//     })
// );


// // automatically import all files ending in *.stories.js
// const req = require.context('../stories', true, /\.stories\.js$/);
// function loadStories() {
//   req.keys().forEach(filename => req(filename));
// }

// configure(loadStories, module);

import { configure } from '@storybook/react';
import '!style-loader!css-loader!sass-loader!./scss-loader.scss';

configure(require.context('../stories', true, /\.stories\.js$/), module);