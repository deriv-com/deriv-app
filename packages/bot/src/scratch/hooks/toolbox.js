import React            from 'react';
import ReactDOM         from 'react-dom';
import { ArrowIcon }    from '../../components/Icons.jsx';
import { translate }    from '../../utils/lang/i18n';

/* eslint-disable func-names, no-underscore-dangle */

/**
 * Initializes the toolbox.
 */
Blockly.Toolbox.prototype.init = function() {
    const workspace = this.workspace_;
    const svg = this.workspace_.getParentSvg();

    /**
     * HTML container for the Toolbox menu.
     * @type {Element}
     */
    this.HtmlDiv = goog.dom.createDom(goog.dom.TagName.DIV, 'toolbox');
    this.HtmlDiv.setAttribute('dir', workspace.RTL ? 'RTL' : 'LTR');

    // deriv-bot: Create Toolbox header
    const el_toolbox_header = goog.dom.createDom(goog.dom.TagName.DIV, 'toolbox__header');
    const el_toolbox_title = goog.dom.createDom(goog.dom.TagName.DIV, 'toolbox__title');

    el_toolbox_title.textContent = translate('Blocks Library');
    el_toolbox_header.appendChild(el_toolbox_title);
    this.HtmlDiv.appendChild(el_toolbox_header);

    const el_toolbox_search = goog.dom.createDom(goog.dom.TagName.INPUT, { 'id': 'search_input', 'placeholder': 'Search' });

    this.HtmlDiv.appendChild(el_toolbox_search);

    el_toolbox_search.addEventListener('keyup', () => {
        const toolbox = workspace.toolbox_;

        toolbox.setSelectedItem(toolbox.categoryMenu_.categories_.find(menuCategory => menuCategory.id_ === 'search'));
    });

    svg.parentNode.insertBefore(this.HtmlDiv, svg);

    // Clicking on toolbox closes popups.
    Blockly.bindEventWithChecks_(this.HtmlDiv, 'mousedown', this, function(e) {
        // Cancel any gestures in progress.
        this.workspace_.cancelCurrentGesture();

        if (Blockly.utils.isRightButton(e) || e.target === this.HtmlDiv) {
            // Close flyout.
            Blockly.hideChaff(false);
        } else {
            // Just close popups.
            Blockly.hideChaff(true);
        }
        Blockly.Touch.clearTouchIdentifier();  // Don't block future drags.
    }, /* opt_noCaptureIdentifier */ false, /* opt_noPreventDefault */ true);

    this.createFlyout_();
    this.categoryMenu_ = new Blockly.Toolbox.CategoryMenu(this, this.HtmlDiv);
    this.populate_(workspace.options.languageTree);
    this.position();
};

/**
 * Fill the toolbox with categories and blocks.
 * @param {!Node} newTree DOM tree of blocks.
 * @private
 * deriv-bot: We don't want to `showAll` or `setSelectedItem` here (like in Scratch)
 */
Blockly.Toolbox.prototype.populate_ = function (newTree) {
    this.categoryMenu_.populate(newTree);
};

/**
 * deriv-bot: Show blocks for a specific category in flyout
 * @private
 */
Blockly.Toolbox.prototype.showCategory_ = function (category_id) {
    let flyout_content;

    if (category_id === 'search') {
        let search_term = document.getElementById('search_input').value;
        const all_variables = this.flyout_.workspace_.getVariablesOfType('');

        if (search_term.length <= 1) {
            this.flyout_.hide();
            return;
        }

        flyout_content = {
            type      : 'search',
            blocks    : [],
            fn_blocks : {},
            var_blocks: {
                blocks     : [],
                blocks_type: [],
            },
        };

        if (typeof search_term === 'string') {
            search_term = search_term.trim().toLowerCase();
            search_term = search_term.split(' ');
        }

        const blocks = Blockly.Blocks;
        Object.keys(blocks).forEach(blockKey => {
            let keywords = ` ${blockKey}`;
            const block = blocks[blockKey];
            const block_meta = block.meta instanceof Function && block.meta();
            const block_definition = block.definition instanceof Function && block.definition();

            if (!block_meta) {
                return;
            }

            Object.keys(block_meta).forEach(key => {
                const meta = block_meta[key];
                keywords += ` ${meta}`;
            });

            Object.keys(block_definition).forEach(key => {
                const definition = block_definition[key];

                if (typeof definition === 'string') {
                    keywords += ` ${definition}`;
                } else if (definition instanceof Array) {
                    definition.forEach(def => {
                        if (def instanceof Object) {
                            keywords += !def.type.includes('image') ? ` ${JSON.stringify(def)}` : '';
                        } else {
                            keywords += ` ${def}`;
                        }
                    });
                }
            });

            const block_category = block_definition && block_definition.category;
            const category =
                this.categoryMenu_.categories_
                    .find(menuCategory => menuCategory.id_ === block_category);
            const contents = category && category.getContents();
            search_term.forEach(term => {
                if (keywords.toLowerCase().includes(term)) {
                    if (contents === 'PROCEDURE') {
                        flyout_content.fn_blocks[blockKey] = block;
                    } else if (contents === 'VARIABLE') {
                        flyout_content.var_blocks.blocks_type.push(blockKey);
                        flyout_content.var_blocks.blocks = all_variables;
                    } else if (contents instanceof Array) {
                        const blockContents = contents
                            .filter(content => content.attributes[0].nodeValue === blockKey);

                        if (blockContents.length && flyout_content.blocks.indexOf(blockContents[0]) === -1) {
                            flyout_content.blocks.push(blockContents[0]);
                        }
                    }
                }
            });
        });

        all_variables.forEach(variable => {
            search_term.forEach(term => {
                if (variable.name.toLowerCase().includes(term)
                && flyout_content.var_blocks.blocks.indexOf(variable) === -1) {
                    flyout_content.var_blocks.blocks.push(variable);
                    flyout_content.var_blocks.blocks_type = ['variables_get', 'variables_set', 'math_change'];
                }
            });
        });
    } else {
        const category = this.categoryMenu_.categories_.find(menuCategory => menuCategory.id_ === category_id);
        if (!category) {
            return;
        }

        flyout_content = [];
        flyout_content = flyout_content.concat(category.getContents());
    }

    this.flyout_.autoClose = true;
    this.flyout_.show(flyout_content);
};

/**
 * Used to determine the css classes for the menu item for this category
 * based on its current state.
 * @private
 * @param {boolean=} selected Indication whether the category is currently selected.
 * @return {string} The css class names to be applied, space-separated.
 * deriv-bot: Custom class names
 */
Blockly.Toolbox.Category.prototype.getMenuItemClassName_ = function(selected) {
    const classNames = ['toolbox__item', `toolbox__category--${this.id_}`];

    if (selected) {
        classNames.push('toolbox__category--selected');
    }
    
    return classNames.join(' ');
};

/**
 * Opens the selected category
 * deriv-bot: Category-specific flyouts + removed opt_shouldScroll
 * @param {Blockly.Toolbox.Category} item The category to select.
 */
Blockly.Toolbox.prototype.setSelectedItem = function (item) {
    if (this.selectedItem_) {
        // They selected a different category but one was already open.  Close it.
        this.selectedItem_.setSelected(false);

        // Selecting the same category will close it.
        if (
            item &&
            !item.is_category_return_ &&
            !item.has_child_category_ &&
            this.selectedItem_.id_ === item.id_
        ) {
            this.selectedItem_ = null;
            this.flyout_.hide();
            return;
        }
    }

    this.selectedItem_ = item;

    if (item === null) {
        this.flyout_.hide();
    } else {
        const getCategoryTree = (parent_name, parent_id, colour, children) => {
            const xml_document = document.implementation.createDocument(null, null, null);
            const el_xml = xml_document.createElement('xml');
            const parent_category = xml_document.createElement('category');

            parent_category.setAttribute('name', parent_name);
            parent_category.setAttribute('id', parent_id);
            parent_category.setAttribute('is_category_return', true);
            parent_category.setAttribute('colour', colour);

            const el_separator = xml_document.createElement('sep');
            const category_nodes = [
                parent_category,
                el_separator,
                ...Array.from(children),
            ];

            category_nodes.forEach(childNode => el_xml.appendChild(childNode));
            xml_document.appendChild(el_xml);
            return el_xml;
        };

        if (this.selectedItem_.is_category_return_) {
            // Go up a level if this is a return category
            const findCategory = (category_collection) => {
                // Finds a category based on `this.selectedItem_.id_` in the given `category_collection`
                for (let i = 0; i < category_collection.length; i++) {
                    const el_category = category_collection[i];
                    const is_correct_child =
                        el_category.tagName.toUpperCase() === 'CATEGORY' &&
                        el_category.getAttribute('id') === this.selectedItem_.id_;

                    if (is_correct_child) {
                        return el_category;
                    }

                    const category = findCategory(el_category.children);
                    if (category) {
                        return category;
                    }
                }
                return null;
            };

            const { initial_toolbox_xml } = this.workspace_;
            const toolboxDom = Blockly.Xml.textToDom(initial_toolbox_xml);
            const selected_category = findCategory(toolboxDom.children);

            if (selected_category) {
                const el_parent = selected_category.parentElement;

                if (el_parent.tagName === 'xml') {
                    this.flyout_.hide();
                    this.workspace_.updateToolbox(initial_toolbox_xml);
                } else {
                    const newTree = getCategoryTree(
                        el_parent.getAttribute('name'),
                        el_parent.getAttribute('id'),
                        el_parent.getAttribute('colour'),
                        el_parent.children,
                    );

                    this.flyout_.hide();
                    this.workspace_.updateToolbox(newTree);
                }
            }
        } else if (this.selectedItem_.has_child_category_) {
            // Show categories in toolbox that are descendants of `this.selectedItem_`
            const newTree = getCategoryTree(
                this.selectedItem_.name_,
                this.selectedItem_.id_,
                this.selectedItem_.colour_,
                this.selectedItem_.contents_,
            );

            this.flyout_.hide();
            this.workspace_.updateToolbox(newTree);
        } else {
            // Show blocks that belong to this category.
            this.selectedItem_.setSelected(true);
            this.showCategory_(this.selectedItem_.id_);
        }
    }
};

/**
 * Update the flyout's contents without closing it.  Should be used in response
 * to a change in one of the dynamic categories, such as variables or
 * procedures.
 * deriv-bot: Calls showAll() in Scratch, we don't want that.
 */
Blockly.Toolbox.prototype.refreshSelection = function () {
    // Hello, I'm doing nothing. :)
};

/**
 * Create the DOM for a category in the toolbox.
 * deriv-bot: Custom class names + injection of description
 */
Blockly.Toolbox.Category.prototype.createDom = function () {
    const toolbox = this.parent_.parent_;
    const el_item = goog.dom.createDom('div', this.getMenuItemClassName_());

    this.item_ = el_item;

    if (this.is_category_return_) {
        const el_return_arrow = goog.dom.createDom('div', 'toolbox__category-arrow toolbox__category-arrow--back');
        ReactDOM.render(<ArrowIcon className='arrow' />, el_return_arrow);
        el_item.appendChild(el_return_arrow);
    } else {
        const el_colour = goog.dom.createDom('div', 'toolbox__category-colour');
        el_item.appendChild(el_colour);
    }
    
    const el_label = goog.dom.createDom('div', 'toolbox__label', this.name_);
    const el_toolbox_text = goog.dom.createDom('div', 'toolbox__category-text');

    this.label_ = el_label;
    el_toolbox_text.appendChild(el_label);
    
    if (this.description_) {
        const el_description = goog.dom.createDom('div', 'toolbox__description', this.description_);
        el_toolbox_text.appendChild(el_description);
    }

    el_item.appendChild(el_toolbox_text);

    if (this.has_child_category_) {
        const el_category_arrow = goog.dom.createDom('div', 'toolbox__category-arrow toolbox__category-arrow--open');
        ReactDOM.render(<ArrowIcon className='arrow' />, el_category_arrow);
        el_item.appendChild(el_category_arrow);
    } else if (this.iconURI_) {
        // If category has iconURI attribute, it refers to an entry in our bot-sprite.svg
        const el_icon = goog.dom.createDom('div', { class: 'toolbox__icon' });
        el_icon.innerHTML = `<svg><use xlink:href="./dist/bot-sprite.svg#${this.iconURI_}"></use></svg>`;
        el_item.appendChild(el_icon);
    }

    this.parentHtml_.appendChild(el_item);

    Blockly.bindEvent_(el_item, 'mouseup', toolbox, toolbox.setSelectedItemFactory(this));
};

/**
 * Get the contents of this category.
 * @return {!Array|string} xmlList List of blocks to show, or a string with the
 * name of a custom category.
 * deriv-bot: Use this.dynamic_ rather than this.custom_ for dynamic categories
 * if we specify this.custom_, parseContents() is never called (see core/toolbox.js),
 * so we don't get extra props we require. See parseContents_
 */
Blockly.Toolbox.Category.prototype.getContents = function () {
    return this.custom_ || this.dynamic_ || this.contents_;
};

/**
* Set the contents of this category from DOM.
* @param {Node} domTree DOM tree of blocks.
* @constructor
* deriv-bot: Set some extra properties on the Blockly.Toolbox.Category
*/
Blockly.Toolbox.Category.prototype.parseContents_ = function (domTree) {
    this.description_ = domTree.getAttribute('description');
    this.dynamic_ = domTree.getAttribute('dynamic');
    this.is_category_return_ = !!domTree.getAttribute('is_category_return');

    domTree.childNodes.forEach(child => {
        if (child.tagName) {
            const tag = child.tagName.toUpperCase();

            if (tag === 'CATEGORY') {
                this.has_child_category_ = true;
            }

            switch (tag) {
                case 'BLOCK':
                case 'SHADOW':
                case 'LABEL':
                case 'BUTTON':
                case 'SEP':
                case 'TEXT':
                case 'CATEGORY':
                    this.contents_.push(child);
                    break;
                default:
                    break;
            }
        }
    });
};

/**
 * Set the colour of the category's background from a DOM node.
 * @param {Node} node DOM node with "colour" and "secondaryColour" attribute.
 *     Colours are a hex string or hue on a colour wheel (0-360).
 * deriv-bot: We don't need secondaryColour
 */
Blockly.Toolbox.Category.prototype.setColour = function(node) {
    const colour = node.getAttribute('colour');

    if (goog.isString(colour)) {
        if (colour.match(/^#[0-9a-fA-F]{6}$/)) {
            this.colour_ = colour;
        } else {
            this.colour_ = Blockly.hueToRgb(colour);
        }
        this.hasColours_ = true;
    } else {
        this.colour_ = '#000000';
    }
};

/**
 * Create the DOM for the category menu.
 * deriv-bot: Custom class names
 */
Blockly.Toolbox.CategoryMenu.prototype.createDom = function() {
    const className = this.parent_.horizontalLayout_ ?
        'toolbox__horizontal-category-menu' :
        'toolbox__category-menu';

    this.table = goog.dom.createDom('div', className);
    this.parentHtml_.appendChild(this.table);
};

/**
 * Fill the toolbox with categories and blocks by creating a new
 * {Blockly.Toolbox.Category} for every category tag in the toolbox xml.
 * @param {Node} domTree DOM tree of blocks, or null.
 */
Blockly.Toolbox.CategoryMenu.prototype.populate = function (domTree) {
    if (!domTree) {
        return;
    }

    // Remove old categories
    this.dispose();
    this.createDom();

    domTree.childNodes.forEach(childNode => {
        const is_category = () => childNode.tagName && childNode.tagName.toUpperCase() === 'CATEGORY';
        const is_separator = () => childNode.tagName && childNode.tagName.toUpperCase() === 'SEP';

        if (is_category()) {
            const row_class = childNode.getAttribute('is_category_return') ?
                'toolbox__category-return' :
                'toolbox__row';
            const el_row = goog.dom.createDom('div', { class: row_class });

            // Convert xml web-class attributes to class attributes in el_row
            const web_classes = childNode.getAttribute('web-class');
            if (web_classes) {
                web_classes.split(' ').forEach(className => el_row.classList.add(className));
            }

            const toolbox_category = new Blockly.Toolbox.Category(this, el_row, childNode);
            
            this.table.appendChild(el_row);
            this.categories_.push(toolbox_category);
        } else if (is_separator()) {
            const el_separator = goog.dom.createDom('div', { class: 'toolbox__separator' });
            this.table.appendChild(el_separator);
        }
    });

    this.height_ = this.table.offsetHeight;
};
