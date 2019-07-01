/**
 * @param {Buffer} content
 * @param {string} path
 * @param {string|RegExp} base
 * */
const transformContentUrlBase = (content, path, base) => {
    return content.toString().replace(/{root_url}|{start_url_base}/g, base);
};

module.exports = {
    transformContentUrlBase,
};
