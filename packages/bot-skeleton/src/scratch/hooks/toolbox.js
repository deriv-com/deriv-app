import { localize } from '@deriv/translations';
import DBotStore from '../dbot-store';

/**
 * Width of the toolbox, which changes only in vertical layout.
 * This is the sum of the width of the flyout (250) and some extra padding (25).
 * @type {number}
 */
Blockly.Toolbox.prototype.width = 25;

/**
 * Initializes the toolbox.
 */
Blockly.Toolbox.prototype.init = function () {
    const workspace = this.workspace_;
    const svg = this.workspace_.getParentSvg();

    /**
     * HTML container for the Toolbox menu.
     * @type {Element}
     */
    this.HtmlDiv = goog.dom.createDom(goog.dom.TagName.DIV, 'toolbox toolbox--hidden');
    this.HtmlDiv.setAttribute('id', 'gtm-toolbox');
    this.HtmlDiv.setAttribute('dir', workspace.RTL ? 'RTL' : 'LTR');

    // @deriv/bot: Create Toolbox header
    const el_toolbox_header = goog.dom.createDom(goog.dom.TagName.DIV, 'toolbox__header');
    const el_toolbox_title = goog.dom.createDom(goog.dom.TagName.DIV, 'toolbox__title');

    el_toolbox_title.textContent = localize('Blocks menu');
    el_toolbox_header.appendChild(el_toolbox_title);
    this.HtmlDiv.appendChild(el_toolbox_header);

    svg.parentNode.insertBefore(this.HtmlDiv, svg);

    // Clicking on toolbox closes popups.
    Blockly.bindEventWithChecks_(
        this.HtmlDiv,
        'mousedown',
        this,
        function (e) {
            // Cancel any gestures in progress.
            this.workspace_.cancelCurrentGesture();

            if (Blockly.utils.isRightButton(e) || e.target === this.HtmlDiv) {
                // Close flyout.
                Blockly.hideChaff(false);
            } else {
                // Just close popups.
                Blockly.hideChaff(true);
            }
            Blockly.Touch.clearTouchIdentifier(); // Don't block future drags.
        },
        /* opt_noCaptureIdentifier */ false,
        /* opt_noPreventDefault */ true
    );

    this.createFlyout_();
    this.categoryMenu_ = new Blockly.Toolbox.CategoryMenu(this, this.HtmlDiv);
    this.populate_(workspace.options.languageTree);
    this.categoryMenu_.allCategories_ = [];
    this.categoryMenu_.categories_.forEach(category => {
        const clone_category = { ...category };
        this.categoryMenu_.allCategories_.push(clone_category);
    });
    this.position();
};

/**
 * Fill the toolbox with categories and blocks.
 * @param {!Node} newTree DOM tree of blocks.
 * @private
 * @deriv/bot: We don't want to `showAll` or `setSelectedItem` here (like in Scratch)
 */
Blockly.Toolbox.prototype.populate_ = function (newTree) {
    const parent = this.categoryMenu_.parentHtml_;
    parent.removeChild(parent.lastChild);

    this.categoryMenu_.populate(newTree);

    const { toggleStrategyModal } = DBotStore.instance;
    if (toggleStrategyModal) {
        const quick_strat_btn = document.createElement('BUTTON');
        quick_strat_btn.innerHTML = localize('Quick strategy');
        quick_strat_btn.className = 'toolbox__button dc-btn effect dc-btn--primary dc-btn__medium';
        quick_strat_btn.id = 'gtm-quick-strategy';
        quick_strat_btn.onclick = toggleStrategyModal;

        parent.appendChild(quick_strat_btn);
    }
};

Blockly.Toolbox.prototype.showSearch = function (search) {
    const flyout_content = [];
    const workspace = Blockly.derivWorkspace;
    const search_term = search.replace(/\s+/g, ' ').trim().toUpperCase();
    const search_words = search_term.split(' ');
    const all_variables = workspace.getVariablesOfType('');
    const all_procedures = Blockly.Procedures.allProcedures(workspace);
    const { flyout } = DBotStore.instance;

    flyout.setVisibility(false);

    // avoid general term which the result will return most of the blocks
    const general_term = [
        localize('THE'),
        localize('OF'),
        localize('YOU'),
        localize('IS'),
        localize('THIS'),
        localize('THEN'),
        localize('A'),
        localize('AN'),
    ];

    if (search_term.length === 0) {
        return;
    } else if (search_term.length <= 1 || search_words.every(term => general_term.includes(term))) {
        flyout.setIsSearchFlyout(true);
        flyout.setContents(flyout_content, search);
        return;
    }

    const {
        categoryMenu_: { allCategories_ },
    } = this;
    const block_contents = allCategories_
        .filter(category => !category.has_child_category_)
        .map(category => {
            let contents = category.contents_.length ? category.contents_ : category.dynamic_;

            if (typeof contents === 'string') {
                const fnToApply = Blockly.derivWorkspace.getToolboxCategoryCallback(contents);
                contents = fnToApply(Blockly.derivWorkspace);
            }

            const only_block_contents = contents.filter(content => content.tagName.toUpperCase() === 'BLOCK');
            return only_block_contents;
        })
        .flat();

    const pushIfNotExists = (array, element_to_push) => {
        if (!array.some(element => element === element_to_push)) {
            array.push(element_to_push);
        }
    };

    const pushBlockWithPriority = priority => {
        block_contents.forEach(block_content => {
            const block_type = block_content.getAttribute('type');
            const block = Blockly.Blocks[block_type];
            const block_meta = block.meta instanceof Function && block.meta();
            const block_definitions = block.definition instanceof Function && block.definition();
            const block_name = block_meta.display_name;
            const block_type_terms = block_type.toUpperCase().split('_');
            const block_name_terms = block_name.toUpperCase().split(' ');
            const definition_key_to_search = /^((message)|(tooltip)|(category))/;

            switch (priority) {
                // when the search text match exactly the block's name
                case 'exact_block_name': {
                    if (search_term === block_name.toUpperCase() || search_term === block_type.toUpperCase()) {
                        pushIfNotExists(flyout_content, block_content);
                    }
                    break;
                }
                // when there's multiple search text and all the search text match block's name or block type
                case 'match_words': {
                    if (
                        search_words.every(word => block_name_terms.some(term => term.includes(word))) ||
                        search_words.every(word => block_type_terms.some(term => term.includes(word)))
                    ) {
                        pushIfNotExists(flyout_content, block_content);
                    }
                    break;
                }
                // when some of search word match block's name or block's type
                case 'block_term': {
                    if (
                        block_type_terms.some(term => search_words.some(word => term.includes(word))) ||
                        block_name_terms.some(term => search_words.some(word => term.includes(word)))
                    ) {
                        pushIfNotExists(flyout_content, block_content);
                    }
                    break;
                }
                case 'block_definitions': {
                    // eslint-disable-next-line consistent-return
                    Object.keys(block_definitions).forEach(key => {
                        const definition = block_definitions[key];

                        if (
                            definition_key_to_search.test(key) &&
                            search_words.some(word => definition.includes(word))
                        ) {
                            pushIfNotExists(flyout_content, block_content);
                        }

                        if (definition instanceof Array) {
                            definition.forEach(def => {
                                const definition_strings = JSON.stringify(def).toUpperCase();

                                if (
                                    def.type === 'field_dropdown' &&
                                    search_term.length > 2 &&
                                    search_words.some(word => definition_strings.includes(word))
                                ) {
                                    pushIfNotExists(flyout_content, block_content);
                                }
                            });
                        }
                    });
                    break;
                }
                case 'block_meta': {
                    // block_meta matched
                    const matched_meta = Object.keys(block_meta)
                        .filter(key => key !== 'display_name')
                        .find(key => {
                            const block_meta_strings = block_meta[key]
                                .toUpperCase()
                                .replace(/[^\w\s]/gi, '')
                                .split(' ');

                            return search_words.some(word => block_meta_strings.some(meta => meta.includes(word)));
                        });

                    if (matched_meta && matched_meta.length) {
                        pushIfNotExists(flyout_content, block_content);
                    }
                    break;
                }
                default:
                    break;
            }
        });
    };

    const priority_order = ['exact_block_name', 'match_words', 'block_term', 'block_definitions', 'block_meta'];

    priority_order.forEach(priority => pushBlockWithPriority(priority));

    // block_variable_name matched
    const matched_variables = all_variables.filter(variable => variable.name.toUpperCase().includes(search_term));
    const variables_blocks = Blockly.DataCategory.search(matched_variables);
    // eslint-disable-next-line consistent-return
    const unique_var_blocks = variables_blocks.filter(variable_block => {
        return flyout_content.indexOf(variable_block) === -1;
    });
    if (unique_var_blocks && unique_var_blocks.length) {
        flyout_content.unshift(...unique_var_blocks);
    }

    // block_procedure_name matched
    const searched_procedures = { 0: [], 1: [] };
    const procedures_callnoreturn = all_procedures[0];
    const procedures_callreturn = all_procedures[1];
    Object.keys(procedures_callnoreturn).forEach(key => {
        const procedure = procedures_callnoreturn[key];

        if (procedure[0].toUpperCase().includes(search_term)) {
            searched_procedures['0'].unshift(procedure);
        }
    });

    Object.keys(procedures_callreturn).forEach(key => {
        const procedure = procedures_callreturn[key];

        if (procedure[0].toUpperCase().includes(search_term)) {
            searched_procedures['1'].unshift(procedure);
        }
    });

    const procedures_blocks = Blockly.Procedures.populateDynamicProcedures(searched_procedures);
    // eslint-disable-next-line consistent-return
    const unique_proce_blocks = procedures_blocks.filter(procedure_block => {
        return flyout_content.indexOf(procedure_block) === -1;
    });
    if (unique_proce_blocks.length) {
        flyout_content.unshift(...unique_proce_blocks);
    }

    flyout.setIsSearchFlyout(true);
    flyout.setContents(flyout_content, search);
};

/**
 * @deriv/bot: Show blocks for a specific category in flyout
 * @private
 */
Blockly.Toolbox.prototype.showCategory_ = function (category_id) {
    const { flyout } = DBotStore.instance;
    const selected_category = this.categoryMenu_.categories_.find(category => category.id_ === category_id);
    let flyout_content = selected_category.getContents();

    // Dynamic categories
    if (typeof flyout_content === 'string') {
        const fnToApply = this.workspace_.getToolboxCategoryCallback(flyout_content);
        flyout_content = fnToApply(this.workspace_);
    }

    flyout.setIsSearchFlyout(false);
    flyout.setSelectedCategory(category_id);
    flyout.setContents(flyout_content);
};

Blockly.Toolbox.prototype.getCategoryContents = function (selected_category) {
    let xml_list = selected_category.getContents();

    // Dynamic categories
    if (typeof xml_list === 'string') {
        const fnToApply = this.workspace_.getToolboxCategoryCallback(xml_list);
        xml_list = fnToApply(this.workspace_);
    }

    return xml_list;
};

/**
 * Used to determine the css classes for the menu item for this category
 * based on its current state.
 * @private
 * @param {boolean=} selected Indication whether the category is currently selected.
 * @return {string} The css class names to be applied, space-separated.
 * @deriv/bot: Custom class names
 */
Blockly.Toolbox.Category.prototype.getMenuItemClassName_ = function (selected) {
    const classNames = ['toolbox__item', `toolbox__category--${this.id_}`];

    if (selected) {
        classNames.push('toolbox__category--selected');
    }

    return classNames.join(' ');
};

/**
 * Opens the selected category
 * @deriv/bot: Category-specific flyouts + removed opt_shouldScroll
 * @param {Blockly.Toolbox.Category} item The category to select.
 * @param {boolean} should_close_on_same_category Close when select the same category
 */
Blockly.Toolbox.prototype.setSelectedItem = function (item, should_close_on_same_category = true) {
    const {
        instance: { flyout },
    } = DBotStore;
    if (this.selectedItem_) {
        // They selected a different category but one was already open.  Close it.
        this.selectedItem_.setSelected(false);

        // Selecting the same category will close it.
        if (
            item &&
            !item.is_category_return_ &&
            !item.has_child_category_ &&
            this.selectedItem_.id_ === item.id_ &&
            should_close_on_same_category
        ) {
            this.selectedItem_ = null;
            if (flyout.is_visible) {
                flyout.setVisibility(false);
            }
            return;
        }
    }

    this.selectedItem_ = item;

    if (!item) {
        flyout.setVisibility(false);
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
            const category_nodes = [parent_category, el_separator, ...Array.from(children)];

            category_nodes.forEach(childNode => el_xml.appendChild(childNode));
            xml_document.appendChild(el_xml);
            return el_xml;
        };

        if (this.selectedItem_.is_category_return_) {
            // Go up a level if this is a return category
            const findCategory = category_collection => {
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

            const { toolbox: toolbox_xml } = this.workspace_.cached_xml;
            const toolbox_dom = Blockly.Xml.textToDom(toolbox_xml);
            const selected_category = findCategory(toolbox_dom.children);

            if (selected_category) {
                const el_parent = selected_category.parentElement;

                flyout.setVisibility(false);
                if (el_parent.tagName === 'xml') {
                    this.workspace_.updateToolbox(toolbox_xml);
                } else {
                    const newTree = getCategoryTree(
                        el_parent.getAttribute('name'),
                        el_parent.getAttribute('id'),
                        el_parent.getAttribute('colour'),
                        el_parent.children
                    );

                    this.workspace_.updateToolbox(newTree);
                }
            }
        } else if (this.selectedItem_.has_child_category_) {
            // Show categories in toolbox that are descendants of `this.selectedItem_`
            const newTree = getCategoryTree(
                this.selectedItem_.name_,
                this.selectedItem_.id_,
                this.selectedItem_.colour_,
                this.selectedItem_.contents_
            );

            flyout.setVisibility(false);
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
 * @deriv/bot: Calls showAll() in Scratch, we don't want that.
 */
Blockly.Toolbox.prototype.refreshSelection = function () {};

/**
 * Create the DOM for a category in the toolbox.
 * @deriv/bot: Custom class names + injection of description
 */
Blockly.Toolbox.Category.prototype.createDom = function () {
    const toolbox = this.parent_.parent_;
    const el_item = goog.dom.createDom('div', this.getMenuItemClassName_());

    // Rename localize function to avoid variables being pushed to Crowdin.
    // The names + descriptions are extracted using a script in extract-translations.js
    const toolboxLocalize = localize;

    this.item_ = el_item;

    if (this.is_category_return_) {
        const el_category_arrow = goog.dom.createDom('div', 'toolbox__category-arrow toolbox__category-arrow--left');
        el_item.appendChild(el_category_arrow);
    } else {
        const el_colour = goog.dom.createDom('div', 'toolbox__category-colour');
        el_item.appendChild(el_colour);
    }

    const el_label = goog.dom.createDom('div', 'toolbox__label', toolboxLocalize(this.name_));
    const el_toolbox_text = goog.dom.createDom('div', 'toolbox__category-text');

    this.label_ = el_label;
    el_toolbox_text.appendChild(el_label);

    if (this.description_) {
        const el_description = goog.dom.createDom('div', 'toolbox__description', toolboxLocalize(this.description_));
        el_toolbox_text.appendChild(el_description);
    }

    el_item.appendChild(el_toolbox_text);

    if (this.has_child_category_) {
        const el_category_arrow = goog.dom.createDom('div', 'toolbox__category-arrow toolbox__category-arrow--right');
        el_item.appendChild(el_category_arrow);
    } else if (this.iconURI_) {
        // If category has iconURI attribute, it refers to an entry in our bot-sprite.svg
        // const el_icon = goog.dom.createDom('div', { class: 'toolbox__icon' });
        // ReactDOM.render(<Icon icon={this.iconURI_} />, el_icon);
        // el_item.appendChild(el_icon);
    }

    this.parentHtml_.appendChild(el_item);

    Blockly.bindEvent_(el_item, 'mouseup', toolbox, toolbox.setSelectedItemFactory(this));
};

/**
 * Get the contents of this category.
 * @return {!Array|string} xmlList List of blocks to show, or a string with the
 * name of a custom category.
 * @deriv/bot: Use this.dynamic_ rather than this.custom_ for dynamic categories
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
 * @deriv/bot: Set some extra properties on the Blockly.Toolbox.Category
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
 * @deriv/bot: We don't need secondaryColour
 */
Blockly.Toolbox.Category.prototype.setColour = function (node) {
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
 * @deriv/bot: Custom class names
 */
Blockly.Toolbox.CategoryMenu.prototype.createDom = function () {
    const className = this.parent_.horizontalLayout_ ? 'toolbox__horizontal-category-menu' : 'toolbox__category-menu';

    this.table = goog.dom.createDom('div', className);
    this.parentHtml_.appendChild(this.table);
};

/**
 * Fill the toolbox with categories and blocks by creating a new
 * {Blockly.Toolbox.Category} for every category tag in the toolbox xml.
 * @param {Node} domTree DOM tree of blocks, or null.
 */
Blockly.Toolbox.CategoryMenu.prototype.populate = function (domTree, is_subcategory = false) {
    if (!domTree) {
        return;
    }

    // Remove old categories
    if (!is_subcategory) {
        this.dispose();
        this.createDom();
    }

    domTree.childNodes.forEach(childNode => {
        const is_category = () => childNode.tagName && childNode.tagName.toUpperCase() === 'CATEGORY';
        const is_separator = () => childNode.tagName && childNode.tagName.toUpperCase() === 'SEP';

        if (is_category()) {
            const row_class = childNode.getAttribute('is_category_return')
                ? 'toolbox__category-return'
                : 'toolbox__row';
            const el_row = goog.dom.createDom('div', { class: row_class });

            // Convert xml web-class attributes to class attributes in el_row
            const web_classes = childNode.getAttribute('web-class');
            if (web_classes) {
                web_classes.split(' ').forEach(className => el_row.classList.add(className));
            }

            const toolbox_category = new Blockly.Toolbox.Category(this, el_row, childNode);

            const child = childNode.children;
            /* eslint-disable consistent-return */
            const subCategory = Object.keys(child).map(key => {
                if (child[key].tagName === 'category') {
                    return child[key];
                }
            });

            if (subCategory.length) {
                this.populate(childNode, true);
            }

            if (!is_subcategory) {
                this.table.appendChild(el_row);
            }
            this.categories_.push(toolbox_category);
        } else if (is_separator()) {
            const el_separator = goog.dom.createDom('div', { class: 'toolbox__separator' });
            this.table.appendChild(el_separator);
        }
    });

    this.height_ = this.table.offsetHeight;
};

Blockly.Toolbox.prototype.refreshCategory = function () {
    const category = this.getSelectedItem();

    this.setSelectedItem(category, false);
};

Blockly.Toolbox.prototype.setVisibility = function (is_open) {
    const { flyout } = DBotStore.instance;

    flyout.setVisibility(false);

    if (is_open) {
        this.removeStyle('toolbox--hidden');
    } else {
        this.addStyle('toolbox--hidden');

        if (this.selectedItem_) {
            this.selectedItem_.setSelected(false);
            this.selectedItem_ = null;
        }
    }
};
