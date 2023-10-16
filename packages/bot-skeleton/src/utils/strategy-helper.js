/** Helper function to perform sequential execution of functions */
export const pipe = (...fns) => {
    return initialValue => {
        return fns.reduce((nextParam, fn) => fn(nextParam), initialValue);
    };
};

/** Helper function to parse block information from XML */
export const extractBlocksFromXml = xml => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const blocks = xmlDoc.getElementsByTagName('block');

    const blocksTypeAndFields = Array.from(blocks).map(block => {
        const type = block.getAttribute('type');
        const fields = Array.from(block.getElementsByTagName('field')).map(field => {
            return {
                name: field.getAttribute('name'),
                value: field.textContent.trim(),
            };
        });
        return { type, fields };
    });

    return blocksTypeAndFields;
};

/** Helper function to sort block childs based on type or field name */
export const sortBlockChild = blocksArray =>
    blocksArray.sort((a, b) => {
        if (a.type < b.type) {
            return -1;
        }
        if (a.type > b.type) {
            return 1;
        }
        return JSON.stringify(a.fields) < JSON.stringify(b.fields) ? -1 : 1;
    });

/** Compare two blocks by field name and value */
const areFieldsEqual = (fields1, fields2) => {
    if (fields1?.length !== fields2?.length) {
        return false;
    }
    for (let i = 0; i < fields1.length; i++) {
        if (fields1[i]?.name !== fields2[i]?.name || fields1[i]?.value !== fields2[i]?.value) {
            return false;
        }
    }
    return true;
};

/** Sanitize XMLs and compare them */
export const compareXml = (xml1, xml2) => {
    // Extract block information from the XMLs and sort the blocks
    const sortedBlocks1 = pipe(extractBlocksFromXml, sortBlockChild);
    const sortedBlocks2 = pipe(extractBlocksFromXml, sortBlockChild);
    const blocks1 = sortedBlocks1(xml1);
    const blocks2 = sortedBlocks2(xml2);

    // Compare the sorted blocks
    if (blocks1?.length !== blocks2?.length) {
        return false;
    }
    for (let i = 0; i < blocks1.length; i++) {
        if (blocks1[i]?.type !== blocks2[i]?.type || !areFieldsEqual(blocks1[i]?.fields, blocks2[i]?.fields)) {
            return false;
        }
    }

    return true;
};
