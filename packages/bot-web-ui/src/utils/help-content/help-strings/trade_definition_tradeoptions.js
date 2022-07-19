import { localize } from '@deriv/translations';

export default {
    text: [
        localize(
            'This block is used to define trade options within the Trade parameters root block. Some options are only applicable for certain trade types. Parameters such as duration and stake are common among most trade types. Prediction is used for trade types such as Digits, while barrier offsets are for trade types that involve barriers such as Touch/No Touch, Ends In/Out, etc.'
        ),
        localize('Example:'),
    ],
};
