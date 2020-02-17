// Things to do before touching this module :P
// 1- Please read https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
// 2- Please read RawMarker.jsx in https://github.com/binary-com/SmartCharts
// 3- Please read contract-store.js & trade.jsx carefully
//
// Things to remember when touching this module.
// 1- Business logic goes into *-contract.jsx files.
// 2- Keep files in ./Helpers simple and declarative.

import TickContract from './tick-contract.jsx';
import NonTickContract from './non-tick-contract.jsx';
import DigitContract from './digit-contract.jsx';

export default {
    TickContract,
    NonTickContract,
    DigitContract,
};
