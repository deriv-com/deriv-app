/**
 * Transform string to truncated string / string with ellipsis
 */
const getTruncatedString = (
    input: string,
    options?: {
        type: 'head' | 'middle' | 'tail';
        length?: number;
    }
) => {
    const { type = 'tail', length = 8 } = options || {};
    if (input.length <= length) {
        return input;
    }
    switch (type) {
        case 'head':
            return `...${input.substring(input.length - length)}`;
        case 'middle':
            return `${input.substring(0, length / 2)}...${input.substring(input.length - length / 2)}`;
        case 'tail':
            return `${input.substring(0, length)}...`;
        default:
            return input;
    }
};

export default getTruncatedString;
