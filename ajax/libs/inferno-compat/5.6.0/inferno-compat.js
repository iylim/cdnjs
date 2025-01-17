(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('inferno'), require('inferno-clone-vnode'), require('inferno-create-class'), require('inferno-create-element')) :
    typeof define === 'function' && define.amd ? define(['exports', 'inferno', 'inferno-clone-vnode', 'inferno-create-class', 'inferno-create-element'], factory) :
    (factory((global.Inferno = global.Inferno || {}),global.Inferno,global.Inferno,global.Inferno,global.Inferno));
}(this, (function (exports,inferno,infernoCloneVnode,infernoCreateClass,infernoCreateElement) { 'use strict';

    var NO_OP = '$NO_OP';
    var isBrowser = !!(typeof window !== 'undefined' && window.document);
    var isArray = Array.isArray;
    function isNullOrUndef(o) {
        return isUndefined(o) || isNull(o);
    }
    function isInvalid(o) {
        return isNull(o) || o === false || isTrue(o) || isUndefined(o);
    }
    function isFunction(o) {
        return typeof o === 'function';
    }
    function isString(o) {
        return typeof o === 'string';
    }
    function isNull(o) {
        return o === null;
    }
    function isTrue(o) {
        return o === true;
    }
    function isUndefined(o) {
        return o === void 0;
    }
    function isObject(o) {
        return typeof o === 'object';
    }

    function isValidElement(obj) {
        var isNotANullObject = isObject(obj) && isNull(obj) === false;
        if (isNotANullObject === false) {
            return false;
        }
        var flags = obj.flags;
        return (flags & (14 /* Component */ | 481 /* Element */)) > 0;
    }

    /**
     * @module Inferno-Compat
     */
    /**
     * Inlined PropTypes, there is propType checking ATM.
     */
    // tslint:disable-next-line:no-empty
    function proptype() { }
    proptype.isRequired = proptype;
    var getProptype = function () { return proptype; };
    var PropTypes = {
        any: getProptype,
        array: proptype,
        arrayOf: getProptype,
        bool: proptype,
        checkPropTypes: function () { return null; },
        element: getProptype,
        func: proptype,
        instanceOf: getProptype,
        node: getProptype,
        number: proptype,
        object: proptype,
        objectOf: getProptype,
        oneOf: getProptype,
        oneOfType: getProptype,
        shape: getProptype,
        string: proptype,
        symbol: proptype
    };

    /**
     * This is a list of all SVG attributes that need special casing,
     * namespacing, or boolean value assignment.
     *
     * When adding attributes to this list, be sure to also add them to
     * the `possibleStandardNames` module to ensure casing and incorrect
     * name warnings.
     *
     * SVG Attributes List:
     * https://www.w3.org/TR/SVG/attindex.html
     * SMIL Spec:
     * https://www.w3.org/TR/smil
     */
    var ATTRS = [
        'accent-height',
        'alignment-baseline',
        'arabic-form',
        'baseline-shift',
        'cap-height',
        'clip-path',
        'clip-rule',
        'color-interpolation',
        'color-interpolation-filters',
        'color-profile',
        'color-rendering',
        'dominant-baseline',
        'enable-background',
        'fill-opacity',
        'fill-rule',
        'flood-color',
        'flood-opacity',
        'font-family',
        'font-size',
        'font-size-adjust',
        'font-stretch',
        'font-style',
        'font-constiant',
        'font-weight',
        'glyph-name',
        'glyph-orientation-horizontal',
        'glyph-orientation-vertical',
        'horiz-adv-x',
        'horiz-origin-x',
        'image-rendering',
        'letter-spacing',
        'lighting-color',
        'marker-end',
        'marker-mid',
        'marker-start',
        'overline-position',
        'overline-thickness',
        'paint-order',
        'panose-1',
        'pointer-events',
        'rendering-intent',
        'shape-rendering',
        'stop-color',
        'stop-opacity',
        'strikethrough-position',
        'strikethrough-thickness',
        'stroke-dasharray',
        'stroke-dashoffset',
        'stroke-linecap',
        'stroke-linejoin',
        'stroke-miterlimit',
        'stroke-opacity',
        'stroke-width',
        'text-anchor',
        'text-decoration',
        'text-rendering',
        'underline-position',
        'underline-thickness',
        'unicode-bidi',
        'unicode-range',
        'units-per-em',
        'v-alphabetic',
        'v-hanging',
        'v-ideographic',
        'v-mathematical',
        'vector-effect',
        'vert-adv-y',
        'vert-origin-x',
        'vert-origin-y',
        'word-spacing',
        'writing-mode',
        'x-height',
        'xlink:actuate',
        'xlink:arcrole',
        'xlink:href',
        'xlink:role',
        'xlink:show',
        'xlink:title',
        'xlink:type',
        'xml:base',
        'xmlns:xlink',
        'xml:lang',
        'xml:space'
    ];
    var SVGDOMPropertyConfig = {};
    var CAMELIZE = /[\-\:]([a-z])/g;
    var capitalize = function (token) { return token[1].toUpperCase(); };
    ATTRS.forEach(function (original) {
        var reactName = original.replace(CAMELIZE, capitalize);
        SVGDOMPropertyConfig[reactName] = original;
    });

    function unmountComponentAtNode(container) {
        inferno.render(null, container);
        return true;
    }
    function extend(base) {
        var arguments$1 = arguments;

        for (var i = 1, obj = (void 0); i < arguments.length; i++) {
            if ((obj = arguments$1[i])) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        base[key] = obj[key];
                    }
                }
            }
        }
        return base;
    }
    function flatten(arr, result) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var value = arr[i];
            if (isArray(value)) {
                flatten(value, result);
            }
            else {
                result.push(value);
            }
        }
        return result;
    }
    var ARR = [];
    var Children = {
        map: function map(children, fn, ctx) {
            if (isNullOrUndef(children)) {
                return children;
            }
            children = Children.toArray(children);
            if (ctx && ctx !== children) {
                fn = fn.bind(ctx);
            }
            return children.map(fn);
        },
        forEach: function forEach(children, fn, ctx) {
            if (isNullOrUndef(children)) {
                return;
            }
            children = Children.toArray(children);
            if (ctx && ctx !== children) {
                fn = fn.bind(ctx);
            }
            for (var i = 0, len = children.length; i < len; i++) {
                var child = isInvalid(children[i]) ? null : children[i];
                fn(child, i, children);
            }
        },
        count: function count(children) {
            children = Children.toArray(children);
            return children.length;
        },
        only: function only(children) {
            children = Children.toArray(children);
            if (children.length !== 1) {
                throw new Error('Children.only() expects only one child.');
            }
            return children[0];
        },
        toArray: function toArray(children) {
            if (isNullOrUndef(children)) {
                return [];
            }
            // We need to flatten arrays here,
            // because React does it also and application level code might depend on that behavior
            if (isArray(children)) {
                var result = [];
                flatten(children, result);
                return result;
            }
            return ARR.concat(children);
        }
    };
    inferno.Component.prototype.isReactComponent = {};
    var currentComponent = null;
    inferno.options.beforeRender = function (component) {
        currentComponent = component;
    };
    inferno.options.afterRender = function () {
        currentComponent = null;
    };
    var version = '15.4.2';
    function normalizeGenericProps(props) {
        for (var prop in props) {
            if (prop === 'onDoubleClick') {
                props.onDblClick = props[prop];
                props[prop] = void 0;
            }
            if (prop === 'htmlFor') {
                props.for = props[prop];
                props[prop] = void 0;
            }
            var mappedProp = SVGDOMPropertyConfig[prop];
            if (mappedProp && props[prop] && mappedProp !== prop) {
                props[mappedProp] = props[prop];
                props[prop] = void 0;
            }
        }
    }
    function normalizeFormProps(name, props) {
        if ((name === 'input' || name === 'textarea') && props.type !== 'radio' && props.onChange) {
            var type = props.type;
            var eventName;
            if (!type || type === 'text') {
                eventName = 'oninput';
            }
            else if (type === 'file') {
                eventName = 'onchange';
            }
            if (eventName && !props[eventName]) {
                props[eventName] = props.onChange;
                props.onChange = void 0;
            }
        }
    }
    // we need to add persist() to Event (as React has it for synthetic events)
    // this is a hack and we really shouldn't be modifying a global object this way,
    // but there isn't a performant way of doing this apart from trying to proxy
    // every prop event that starts with "on", i.e. onClick or onKeyPress
    // but in reality devs use onSomething for many things, not only for
    // input events
    if (typeof Event !== 'undefined') {
        var eventProtoType = Event.prototype;
        if (!eventProtoType.persist) {
            // tslint:disable-next-line:no-empty
            eventProtoType.persist = function () { };
        }
        if (!eventProtoType.isDefaultPrevented) {
            eventProtoType.isDefaultPrevented = function () {
                return this.defaultPrevented;
            };
        }
        if (!eventProtoType.isPropagationStopped) {
            eventProtoType.isPropagationStopped = function () {
                return this.cancelBubble;
            };
        }
    }
    function iterableToArray(iterable) {
        var iterStep;
        var tmpArr = [];
        do {
            iterStep = iterable.next();
            tmpArr.push(iterStep.value);
        } while (!iterStep.done);
        return tmpArr;
    }
    var g = typeof window === 'undefined' ? global : window;
    var hasSymbolSupport = typeof g.Symbol !== 'undefined';
    var symbolIterator = hasSymbolSupport ? g.Symbol.iterator : '';
    var oldCreateVNode = inferno.options.createVNode;
    inferno.options.createVNode = function (vNode) {
        var children = vNode.children;
        var ref = vNode.ref;
        var props = vNode.props;
        if (isNullOrUndef(props)) {
            props = vNode.props = {};
        }
        // React supports iterable children, in addition to Array-like
        if (hasSymbolSupport && !isNull(children) && !isArray(children) && typeof children === 'object' && isFunction(children[symbolIterator])) {
            vNode.children = iterableToArray(children[symbolIterator]());
        }
        if (typeof ref === 'string' && !isNull(currentComponent)) {
            if (!currentComponent.refs) {
                currentComponent.refs = {};
            }
            vNode.ref = function (val) {
                this.refs[ref] = val;
            }.bind(currentComponent);
        }
        if (vNode.className) {
            props.className = vNode.className;
        }
        if (!isNullOrUndef(children) && isNullOrUndef(props.children)) {
            props.children = children;
        }
        if (vNode.flags & 14 /* Component */) {
            if (isString(vNode.type)) {
                vNode.flags = inferno.getFlagsForElementVnode(vNode.type);
                if (props) {
                    inferno.normalizeProps(vNode);
                }
            }
        }
        var flags = vNode.flags;
        if (flags & 448 /* FormElement */) {
            normalizeFormProps(vNode.type, props);
        }
        if (flags & 481 /* Element */) {
            normalizeGenericProps(props);
        }
        if (oldCreateVNode) {
            oldCreateVNode(vNode);
        }
    };
    // Credit: preact-compat - https://github.com/developit/preact-compat :)
    function shallowDiffers(a, b) {
        for (var i in a) {
            if (!(i in b)) {
                return true;
            }
        }
        for (var i$1 in b) {
            if (a[i$1] !== b[i$1]) {
                return true;
            }
        }
        return false;
    }
    var PureComponent = (function (Component) {
        function PureComponent () {
            Component.apply(this, arguments);
        }

        if ( Component ) PureComponent.__proto__ = Component;
        PureComponent.prototype = Object.create( Component && Component.prototype );
        PureComponent.prototype.constructor = PureComponent;

        PureComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate (props, state) {
            return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
        };

        return PureComponent;
    }(inferno.Component));
    var WrapperComponent = (function (Component) {
        function WrapperComponent () {
            Component.apply(this, arguments);
        }

        if ( Component ) WrapperComponent.__proto__ = Component;
        WrapperComponent.prototype = Object.create( Component && Component.prototype );
        WrapperComponent.prototype.constructor = WrapperComponent;

        WrapperComponent.prototype.getChildContext = function getChildContext () {
            // tslint:disable-next-line
            return this.props.context;
        };
        WrapperComponent.prototype.render = function render (props) {
            return props.children;
        };

        return WrapperComponent;
    }(inferno.Component));
    function unstable_renderSubtreeIntoContainer(parentComponent, vNode, container, callback) {
        var wrapperVNode = inferno.createComponentVNode(4 /* ComponentClass */, WrapperComponent, {
            children: vNode,
            context: parentComponent.context
        });
        inferno.render(wrapperVNode, container);
        var component = vNode.children;
        if (callback) {
            // callback gets the component as context, no other argument.
            callback.call(component);
        }
        return component;
    }
    // Credit: preact-compat - https://github.com/developit/preact-compat
    var ELEMENTS = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr circle clipPath defs ellipse g image line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan'.split(' ');
    function createFactory(type) {
        return infernoCreateElement.createElement.bind(null, type);
    }
    var DOM = {};
    for (var i = ELEMENTS.length; i--;) {
        DOM[ELEMENTS[i]] = createFactory(ELEMENTS[i]);
    }
    function findDOMNode(ref) {
        if (ref && ref.nodeType) {
            return ref;
        }
        if (!ref || ref.$UN) {
            return null;
        }
        if (ref.$LI) {
            return ref.$LI.dom;
        }
        return null;
    }
    // Mask React global in browser enviornments when React is not used.
    if (isBrowser && typeof window.React === 'undefined') {
        var exports$1 = {
            Children: Children,
            Component: inferno.Component,
            DOM: DOM,
            EMPTY_OBJ: inferno.EMPTY_OBJ,
            NO_OP: NO_OP,
            PropTypes: PropTypes,
            PureComponent: PureComponent,
            __spread: extend,
            cloneElement: infernoCloneVnode.cloneVNode,
            cloneVNode: infernoCloneVnode.cloneVNode,
            createClass: infernoCreateClass.createClass,
            createComponentVNode: inferno.createComponentVNode,
            createElement: infernoCreateElement.createElement,
            createFactory: createFactory,
            createPortal: inferno.createPortal,
            createRenderer: inferno.createRenderer,
            createTextVNode: inferno.createTextVNode,
            createVNode: inferno.createVNode,
            directClone: inferno.directClone,
            findDOMNode: findDOMNode,
            getFlagsForElementVnode: inferno.getFlagsForElementVnode,
            getNumberStyleValue: inferno.getNumberStyleValue,
            hydrate: inferno.hydrate,
            isValidElement: isValidElement,
            linkEvent: inferno.linkEvent,
            normalizeProps: inferno.normalizeProps,
            options: inferno.options,
            render: inferno.render,
            unmountComponentAtNode: unmountComponentAtNode,
            unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
            version: version
        };
        window.React = exports$1;
        window.ReactDOM = exports$1;
    }
    var index = {
        Children: Children,
        Component: inferno.Component,
        DOM: DOM,
        EMPTY_OBJ: inferno.EMPTY_OBJ,
        NO_OP: NO_OP,
        PropTypes: PropTypes,
        PureComponent: PureComponent,
        __spread: extend,
        cloneElement: infernoCloneVnode.cloneVNode,
        cloneVNode: infernoCloneVnode.cloneVNode,
        createClass: infernoCreateClass.createClass,
        createComponentVNode: inferno.createComponentVNode,
        createElement: infernoCreateElement.createElement,
        createFactory: createFactory,
        createPortal: inferno.createPortal,
        createRenderer: inferno.createRenderer,
        createTextVNode: inferno.createTextVNode,
        createVNode: inferno.createVNode,
        directClone: inferno.directClone,
        findDOMNode: findDOMNode,
        getFlagsForElementVnode: inferno.getFlagsForElementVnode,
        getNumberStyleValue: inferno.getNumberStyleValue,
        hydrate: inferno.hydrate,
        isValidElement: isValidElement,
        linkEvent: inferno.linkEvent,
        normalizeProps: inferno.normalizeProps,
        options: inferno.options,
        render: inferno.render,
        unmountComponentAtNode: unmountComponentAtNode,
        unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
        version: version
    };

    exports.Component = inferno.Component;
    exports.EMPTY_OBJ = inferno.EMPTY_OBJ;
    exports.createComponentVNode = inferno.createComponentVNode;
    exports.createPortal = inferno.createPortal;
    exports.createRenderer = inferno.createRenderer;
    exports.createTextVNode = inferno.createTextVNode;
    exports.createVNode = inferno.createVNode;
    exports.directClone = inferno.directClone;
    exports.getFlagsForElementVnode = inferno.getFlagsForElementVnode;
    exports.getNumberStyleValue = inferno.getNumberStyleValue;
    exports.hydrate = inferno.hydrate;
    exports.linkEvent = inferno.linkEvent;
    exports.normalizeProps = inferno.normalizeProps;
    exports.options = inferno.options;
    exports.render = inferno.render;
    exports.cloneElement = infernoCloneVnode.cloneVNode;
    exports.cloneVNode = infernoCloneVnode.cloneVNode;
    exports.createClass = infernoCreateClass.createClass;
    exports.createElement = infernoCreateElement.createElement;
    exports.Children = Children;
    exports.DOM = DOM;
    exports.NO_OP = NO_OP;
    exports.PropTypes = PropTypes;
    exports.PureComponent = PureComponent;
    exports.createFactory = createFactory;
    exports.__spread = extend;
    exports.findDOMNode = findDOMNode;
    exports.isValidElement = isValidElement;
    exports.unmountComponentAtNode = unmountComponentAtNode;
    exports.unstable_renderSubtreeIntoContainer = unstable_renderSubtreeIntoContainer;
    exports.version = version;
    exports.default = index;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
