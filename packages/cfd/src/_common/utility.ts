const template = (string: string, content: string[]) => {
    let to_replace = content;
    if (content && !Array.isArray(content)) {
        to_replace = [content];
    }
    return string.replace(/\[_(\d+)]/g, (s, index) => to_replace[+index - 1]);
};

/**
 * Creates a DOM element and adds any attributes to it.
 *
 * @param {String} tag_name: the tag to create, e.g. 'div', 'a', etc
 * @param {Object} attributes: all the attributes to assign, e.g. { id: '...', class: '...', html: '...', ... }
 * @return the created DOM element
 */
const createElement = <K extends keyof HTMLElementTagNameMap>(
    tag_name: K,
    attributes: ElementCreationOptions
): HTMLElement => {
    const el = document.createElement(tag_name);
    Object.keys(attributes).forEach((attr: string) => {
        const value = attr;
        if (attr === 'text') {
            el.textContent = value;
        } else if (attr === 'html') {
            el.innerHTML = value;
        } else {
            el.setAttribute(attr, value);
        }
    });
    return el;
};

let static_hash: string;
const getStaticHash = () => {
    static_hash =
        static_hash || (document.querySelector('script[src*="main"]')?.getAttribute('src') || '').split('.')[1];
    return static_hash;
};

class PromiseClass {
    promise: Promise<unknown>;
    reject?: (reason?: any) => void;
    resolve!: (value: unknown) => void;
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

export { template, createElement, getStaticHash, PromiseClass };
