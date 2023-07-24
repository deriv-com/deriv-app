export const ATTRIBUTES_TO_REMOVE = [
    'xmlns',
    'is_dbot',
    'collection',
    'x',
    'y',
    'id',
    'type',
    'iscloud',
    'islocal',
    'collapsed',
];

export const removeAttributesFromXml = (xmlString = '', attributeNames) => {
    // Remove attribute names like collection/is_dbot from the string
    const regex = new RegExp(`(${attributeNames.join('|')})="[^"]*"`, 'g');
    const withoutAttributes = xmlString.replace(regex, '');
    return removeWhiteSpaceFromXml(withoutAttributes);
};

export const removeWhiteSpaceFromXml = (xmlString = '') => {
    // Remove all whitespace characters (including spaces and new lines)
    const withoutWhitespace = xmlString.replace(/\s/g, '');
    return withoutWhitespace;
};
