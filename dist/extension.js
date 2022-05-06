/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createWebview = void 0;
const vscode = __webpack_require__(1);
const path_1 = __webpack_require__(3);
const renderHtml_1 = __webpack_require__(4);
const createWebview = async (extensionPath) => {
    const { fileName } = vscode.window.visibleTextEditors[0].document;
    let appkey = '';
    try {
        // todo: 同一工作区打开多项目时的情况
        const rootPath = vscode.workspace.workspaceFolders[0].uri.path;
        const envFile = await vscode.workspace.fs.readFile(vscode.Uri.file(`${rootPath}/.env`));
        const envStr = envFile.toString();
        const startIndex = envStr.indexOf('VUE_APP_NAME=');
        if (startIndex !== -1) {
            for (let i = startIndex + 13; i < envStr.length; i++) {
                if (envStr[i] === '\n') {
                    break;
                }
                else {
                    appkey = appkey + envStr[i];
                }
            }
        }
    }
    catch (error) {
        console.log('error', error);
    }
    const panel = vscode.window.createWebviewPanel('FETools', 'FETools', vscode.ViewColumn.Three, {
        enableScripts: true,
        enableCommandUris: true,
    });
    // 构造HTML
    const html = (0, renderHtml_1.default)({
        scripts: [{
                src: panel.webview.asWebviewUri(vscode.Uri.file((0, path_1.join)(extensionPath, 'fevue3/dist/assets', 'index.js'))),
            }],
        links: [{
                href: panel.webview.asWebviewUri(vscode.Uri.file((0, path_1.join)(extensionPath, 'fevue3/dist/assets', 'index.css'))),
                rel: 'stylesheet',
            }],
    });
    panel.webview.html = html;
    panel.webview.postMessage({
        cfgObj: {
            fileName,
            appkey,
            extensionPath: panel.webview.asWebviewUri(vscode.Uri.file((0, path_1.join)(extensionPath, 'fevue3/src/assets', ''))),
        },
    });
    // panel.webview.onDidReceiveMessage(messageHandler(panel.webview));
    panel.webview.onDidReceiveMessage((event) => {
        console.log(event, '接收的消息');
    });
};
exports.createWebview = createWebview;


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function default_1({ links = [], scripts = [] }) {
    return `
        <!doctype html>
        <html lang="zh">
        <head>
            <meta charset="UTF-8">
            <meta
            name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
            >
            <meta
            http-equiv="X-UA-Compatible"
            content="ie=edge"
            >
            ${links.map(({ href, rel }) => `<link rel="${rel}" href="${href}">`)}
            <style>
            * { 
                padding:0;
                margin:0;
                box-sizing: border-box;
                font-size: 14px;
            }
            body {
                background-color: #fff;
            }
            </style>
        </head>
        <body style="padding: 0;">
            <div id="app" />
            ${scripts.map(({ src }) => `<script type="text/javascript" src="${src.toString()}" />`)}
        </body>
        </html>
    `;
}
exports["default"] = default_1;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderSideBar = exports.SidebarItems = exports.SideBarItem = void 0;
const vscode = __webpack_require__(1);
const constants_1 = __webpack_require__(6);
class SideBarItem extends vscode.TreeItem {
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
    }
}
exports.SideBarItem = SideBarItem;
class SidebarItems {
    constructor(items) {
        this.items = items;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element) {
            return null;
        }
        else {
            const sidebarItems = [];
            let sideBarItem = null;
            this.items.map((item) => {
                sideBarItem = new SideBarItem(item.label, vscode.TreeItemCollapsibleState.None);
                sideBarItem.command = {
                    command: 'edu-tools.handleClickItem',
                    title: item.label,
                    arguments: [item.url, item.label, item.isOpenBrowser],
                };
                sidebarItems.push(sideBarItem);
            });
            return sidebarItems;
        }
    }
}
exports.SidebarItems = SidebarItems;
const renderSideBar = () => {
    // const uiSidebarItems = new SidebarItems(uiItems);
    // const flowSidebarItems = new SidebarItems(flowItems);
    const eduSidebarItems = new SidebarItems(constants_1.eduItems);
    // vscode.window.registerTreeDataProvider('ui-tools', uiSidebarItems);
    // vscode.window.registerTreeDataProvider('workflow-tools', flowSidebarItems);
    vscode.window.registerTreeDataProvider('edu-tools', eduSidebarItems);
};
exports.renderSideBar = renderSideBar;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.eduItems = exports.flowItems = exports.uiItems = void 0;
exports.uiItems = [
    {
        isOpenBrowser: true,
        label: '页面模板库',
        url: 'https://www.baidu.com'
    }, {
        isOpenBrowser: true,
        label: '区块模板库',
        url: 'https://www.baidu.com'
    }
];
exports.flowItems = [
    {
        isOpenBrowser: true,
        label: 'ceui',
        url: 'https://www.baidu.com'
    }, {
        isOpenBrowser: true,
        label: '测试',
        url: 'https://www.baidu.com'
    }
];
exports.eduItems = [
    {
        isOpenBrowser: true,
        label: 'MDN 教程及手册',
        url: 'https://developer.mozilla.org/en-US/'
    }, {
        isOpenBrowser: false,
        label: 'ES6 教程',
        url: 'https://es6.ruanyifeng.com/'
    }, {
        isOpenBrowser: false,
        label: 'vue3 教程',
        url: 'https://v3.vuejs.org/'
    }
];


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sideBarClick = void 0;
const vscode = __webpack_require__(1);
const sideBarClick = (url, title, isOpenBrowser) => {
    if (isOpenBrowser) {
        vscode.env.openExternal(vscode.Uri.parse(url));
    }
    else {
        const panel = vscode.window.createWebviewPanel('webview', '', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.title = title;
        panel.webview.html = `<!DOCTYPE html>
          <html lang="en">
            <head>
              <style>
                * { box-sizing: border-box; }
                body, html {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
              </style>
            </head>
            <body>
              <iframe src='http://127.0.0.1:3000/' style="height:100%; width:100%;background-color: #f8f8f8" frameborder="no" border="0" />
            </body>
          </html>
        `;
    }
};
exports.sideBarClick = sideBarClick;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.completion = void 0;
const vscode_1 = __webpack_require__(1);
const tagCompletionProvider_1 = __webpack_require__(9);
const attrCompletionProvider_1 = __webpack_require__(13);
const attrValueCompletionProvider_1 = __webpack_require__(14);
const eventCompletionProvider_1 = __webpack_require__(15);
const WORD_REG = /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/gi;
const type = [
    { language: 'vue', scheme: 'file' },
    { language: 'html', scheme: 'file' }
];
const completion = (context) => {
    const tagCompletionProvider = new tagCompletionProvider_1.default();
    const attrCompletionProvider = new attrCompletionProvider_1.default();
    const attrValueCompletionProvider = new attrValueCompletionProvider_1.default();
    const eventCompletionProvider = new eventCompletionProvider_1.default();
    const tagCompletion = vscode_1.languages.registerCompletionItemProvider(type, tagCompletionProvider, '<');
    const attrCompletion = vscode_1.languages.registerCompletionItemProvider(type, attrCompletionProvider, ' ', ':', '\n');
    const attrValueCompletion = vscode_1.languages.registerCompletionItemProvider(type, attrValueCompletionProvider, '"', "'");
    const eventCompletion = vscode_1.languages.registerCompletionItemProvider(type, eventCompletionProvider, '@', ':');
    const vueLanguageConfig = vscode_1.languages.setLanguageConfiguration('vue', { wordPattern: WORD_REG });
    context.subscriptions.push(tagCompletion, attrCompletion, attrValueCompletion, eventCompletion, vueLanguageConfig);
};
exports.completion = completion;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_1 = __webpack_require__(1);
const index_1 = __webpack_require__(10);
const util_1 = __webpack_require__(12);
class TagCompletionProvider {
    constructor() {
        this.quotes = '"';
        this.size = 2;
        this.wrapAttributes = 'force-expand-multiline';
        this.TAG_START_REG = /<([\w-]*)$/;
    }
    buildTagSuggestion(itemDesc) {
        const tagSnippets = itemDesc.snippets;
        const that = this;
        function build(tagDesc) {
            // 如果是文本，直接返回文本
            if (tagDesc.text) {
                return tagDesc.text;
            }
            let html = `<${tagDesc.tag}`;
            // 处理属性
            if (tagDesc.attrs) {
                const attrs = tagDesc.attrs;
                Object.keys(attrs).forEach((attrName) => {
                    if (attrs[attrName] === null) {
                        // 无值属性，例如：<input disabled></input>
                        html += ` ${attrName}`;
                    }
                    else {
                        // 添加属性 例如 value="123"
                        html += ` ${attrName}=${that.quotes}${attrs[attrName]}${that.quotes}`;
                    }
                });
            }
            // 如果是自闭合标签，则直接返回
            if (tagDesc.selfClose) {
                html += '/>';
                return html;
            }
            html += '>';
            if (tagDesc.children) {
                tagDesc.children.forEach((child) => {
                    html += `${build(child)}`;
                });
            }
            html += `</${tagDesc.tag}>`;
            return html;
        }
        const snippets = build(tagSnippets);
        // 去掉头部<，因为这个字符由用户已经输入
        const _snippets = snippets.slice(1);
        return {
            label: itemDesc.prefix || itemDesc.name,
            sortText: `0${itemDesc.sort || ''}${itemDesc.prefix || itemDesc.name}`,
            insertText: new vscode_1.SnippetString(_snippets),
            kind: vscode_1.CompletionItemKind.Class,
            detail: `[VUE] ${itemDesc.detail || itemDesc.name}`,
            documentation: itemDesc.documentation || snippets
        };
    }
    provideCompletionItems(document, position) {
        this.quotes = (0, util_1.getConfig)('double-quotes') ? '"' : "'";
        this.size = (0, util_1.getConfig)('indent-size') || 2;
        const txt = (0, util_1.getTextBeforePosition)(document, position);
        if (this.TAG_START_REG.test(txt) && !(0, util_1.notInTemplate)(document, position)) {
            return index_1.default.map((item) => {
                return this.buildTagSuggestion(item);
            });
        }
        return [];
    }
}
exports["default"] = TagCompletionProvider;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const btn_1 = __webpack_require__(11);
const normalComponents = [
    btn_1.default
];
exports["default"] = normalComponents;


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const btn = {
    type: 'normal',
    prefix: 'el-button',
    name: 'el-button',
    props: [
        {
            key: 'size',
            default: '',
            options: [
                {
                    value: 'large',
                    detail: '大号按钮',
                    documentation: '大号按钮'
                },
                {
                    value: 'small',
                    detail: '小号按钮',
                    documentation: '小号按钮'
                }
            ],
            detail: '控制按钮大小',
            documentation: '注意 icon 类型的 button 不支持'
        },
        {
            key: 'html-type',
            default: '',
            options: [
                {
                    value: 'button',
                    detail: '普通按钮',
                    documentation: '普通按钮'
                },
                {
                    value: 'submit',
                    detail: '提交按钮',
                    documentation: '提交按钮'
                },
                {
                    value: 'reset',
                    detail: '重置按钮',
                    documentation: '重置按钮'
                }
            ],
            detail: '按钮原生类型',
            documentation: '设置 button 原生的 type 类型'
        },
        {
            key: 'loading',
            isBoolean: true,
            options: [],
            detail: '加载状态',
            documentation: '是否处于加载中状态'
        },
        {
            key: 'disabled',
            isBoolean: true,
            options: [],
            detail: '禁用状态',
            documentation: '是否设置禁用状态'
        },
        {
            key: 'icon',
            options: [],
            detail: '按钮左侧图标类型',
            documentation: '设置按钮左侧图标类型'
        },
        {
            key: 'type',
            default: '',
            options: [
                {
                    value: 'primary',
                    detail: '基础按钮',
                    documentation: '基础按钮<就是蓝框框那个>'
                },
                {
                    value: 'text',
                    detail: '文字按钮',
                    documentation: '文字按钮'
                },
                {
                    value: 'text-primary',
                    detail: '基础文字按钮',
                    documentation: '基础文字按钮'
                }
            ],
            detail: '按钮类型',
            documentation: '设置按钮类型'
        },
        {
            key: 'dashed',
            isBoolean: true,
            options: [],
            detail: '虚线边框',
            documentation: '是否设置虚线边框'
        },
    ],
    events: [
        {
            key: 'click',
            detail: '点击事件',
            documentation: '按钮点击事件(非原生事件)'
        }
    ],
    detail: '按钮组件',
    documentation: '用于触发一个行动并形成决策的组件',
    snippets: {
        tag: 'el-button',
        attrs: {
            type: 'primary'
        }
    },
    path: '/#/components/btn'
};
exports["default"] = btn;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConfig = exports.getPreTagAndAttrAndEvent = exports.findAllSubAttrFromLine = exports.getPreTag = exports.notInScript = exports.notInTemplate = exports.getTextBeforePosition = void 0;
const vscode_1 = __webpack_require__(1);
const PRE_TAG_REG = /<([\w-]+)(\s[:@-\w]*(=['"][:@-\w]*['"])?)*\s*(\s:)?/;
const END_TAG_REG = /(\/>)|(<\/[\w-]+>)(\s)*$/;
const PRE_ATTR_REG = /\s([\w\.@:-]+)(=['"][\w\.@:-]*['"])?/g;
/**
 * 获取当前行在当前位置之前的文本
 * @param position 当前光标位置
 */
function getTextBeforePosition(document, position) {
    const start = new vscode_1.Position(position.line, 0);
    const range = new vscode_1.Range(start, position);
    return document.getText(range);
}
exports.getTextBeforePosition = getTextBeforePosition;
function notInTemplate(document, position) {
    let line = position.line;
    while (line) {
        if (/^\s*<template.*>\s*$/.test(document.lineAt(line).text)) {
            return false;
        }
        if (/^\s*<script.*>\s*$/.test(document.lineAt(line).text)) {
            return true;
        }
        if (/^\s*<style.*>\s*$/.test(document.lineAt(line).text)) {
            return true;
        }
        if (/^\s*<\/template>.*$/.test(document.lineAt(line).text)) {
            return true;
        }
        line--;
    }
    return false;
}
exports.notInTemplate = notInTemplate;
function notInScript(document, position) {
    let line = position.line;
    while (line) {
        if (/^\s*<script.*>\s*$/.test(document.lineAt(line).text)) {
            return false;
        }
        if (/^\s*<template.*>\s*$/.test(document.lineAt(line).text)) {
            return true;
        }
        if (/^\s*<style.*>\s*$/.test(document.lineAt(line).text)) {
            return true;
        }
        if (/^\s*<\/script>.*$/.test(document.lineAt(line).text)) {
            return true;
        }
        line--;
    }
    return false;
}
exports.notInScript = notInScript;
function getPreTag(document, position) {
    let line = position.line;
    let curLine = position.line;
    let txt = getTextBeforePosition(document, position);
    let tagMatch = PRE_TAG_REG.exec(txt);
    if (END_TAG_REG.test(txt)) {
        return null;
    }
    if (tagMatch === null) {
        while (line - curLine < 10 && curLine >= 0 && tagMatch === null) {
            curLine--;
            txt = document.lineAt(curLine).text;
            tagMatch = PRE_TAG_REG.exec(txt);
            if (END_TAG_REG.test(txt)) {
                return null;
            }
        }
    }
    if (tagMatch !== null) {
        return tagMatch[1];
    }
    return null;
}
exports.getPreTag = getPreTag;
// 找到这个标签所有属性，包括prop和event
function findAllSubAttrFromLine(parent) {
    const result = {};
    let match = PRE_ATTR_REG.exec(parent);
    while (match !== null) {
        const attrStr = match[1].split('=')[0] || '';
        result[attrStr] = true;
        match = PRE_ATTR_REG.exec(parent);
    }
    return result;
}
exports.findAllSubAttrFromLine = findAllSubAttrFromLine;
function getPreTagAndAttrAndEvent(document, position) {
    let line = position.line;
    let curLine = position.line;
    let txt = getTextBeforePosition(document, position);
    let tagMatch = PRE_TAG_REG.exec(txt);
    if (END_TAG_REG.test(txt)) {
        return null;
    }
    let attrMap = {
        ...findAllSubAttrFromLine(txt)
    };
    const result = {
        tag: '',
        attrs: attrMap
    };
    if (tagMatch === null) {
        while (line - curLine < 10 && curLine >= 0 && tagMatch === null) {
            curLine--;
            txt = document.lineAt(curLine).text;
            if (END_TAG_REG.test(txt)) {
                return null;
            }
            tagMatch = PRE_TAG_REG.exec(txt);
            attrMap = {
                ...attrMap,
                ...findAllSubAttrFromLine(txt)
            };
        }
    }
    else {
        result.tag = tagMatch[1];
    }
    return result;
}
exports.getPreTagAndAttrAndEvent = getPreTagAndAttrAndEvent;
function getConfig(key) {
    const config = vscode_1.workspace.getConfiguration('element-vue-helper');
    return config.get(key);
}
exports.getConfig = getConfig;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_1 = __webpack_require__(1);
const index_1 = __webpack_require__(10);
const util_1 = __webpack_require__(12);
class AttrCompletionProvider {
    constructor() {
        this.quotes = '"';
        this.IS_ATTR = /\s((:|(v-bind:))?)(\w-)*$/;
    }
    buildAttrSuggestion(attrDesc, completeEqualSign) {
        let insertText = '';
        if (attrDesc.isBoolean && !completeEqualSign) {
            insertText = `${attrDesc.key}`;
        }
        else {
            insertText = `${attrDesc.key}=${this.quotes}\$\{0:${attrDesc.default || ''}\}${this.quotes}`;
        }
        return {
            label: attrDesc.key,
            sortText: `0${attrDesc.sort || ''}${attrDesc.key}`,
            insertText: new vscode_1.SnippetString(insertText),
            kind: vscode_1.CompletionItemKind.Property,
            detail: `[VUE] ${attrDesc.detail || attrDesc.key}`,
            documentation: attrDesc.documentation || insertText
        };
    }
    provideCompletionItems(document, position) {
        const txt = (0, util_1.getTextBeforePosition)(document, position);
        const match = this.IS_ATTR.exec(txt);
        let completeEqualSign = false;
        if (match === null) {
            return [];
        }
        if (match[1] === ':' || match[1] === 'v-bind:') {
            completeEqualSign = true;
        }
        this.quotes = (0, util_1.getConfig)('double-quotes') ? '"' : "'";
        const res = (0, util_1.getPreTagAndAttrAndEvent)(document, position);
        if (res?.tag && !(0, util_1.notInTemplate)(document, position)) {
            const tagInfo = index_1.default.filter((item) => item.name === res.tag)[0] || { props: [] };
            const attrs = tagInfo.props || [];
            const attrsSuggestion = [];
            attrs.forEach((item) => {
                if (!res.attrs[item.key]) {
                    attrsSuggestion.push(this.buildAttrSuggestion(item, completeEqualSign));
                }
            });
            return attrsSuggestion;
        }
        return [];
    }
}
exports["default"] = AttrCompletionProvider;


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_1 = __webpack_require__(1);
const index_1 = __webpack_require__(10);
const util_1 = __webpack_require__(12);
class AttrValueCompletionProvider {
    constructor() {
        this.IS_ATTR_VALUE = /((v-bind:)|:)?([\w-]+)=['"][^'"]*$/;
    }
    buildAttrValueSuggestion(attrOptionDesc) {
        const insertText = `\$\{0:${attrOptionDesc.value}\}`;
        return {
            label: attrOptionDesc.value,
            sortText: `0${attrOptionDesc.sort || ''}${attrOptionDesc.value}`,
            insertText: new vscode_1.SnippetString(insertText),
            kind: vscode_1.CompletionItemKind.Value,
            detail: `[VUE] ${attrOptionDesc.detail || attrOptionDesc.value}`,
            documentation: attrOptionDesc.documentation || insertText
        };
    }
    provideCompletionItems(document, position) {
        const txt = (0, util_1.getTextBeforePosition)(document, position);
        const tag = (0, util_1.getPreTag)(document, position);
        const match = this.IS_ATTR_VALUE.exec(txt) || [];
        const attrName = match[3];
        if (tag && attrName && !(0, util_1.notInTemplate)(document, position)) {
            const tagInfo = index_1.default.filter((item) => item.name === tag)[0] || { props: [] };
            const attrs = tagInfo.props.filter((item) => item.key === attrName)[0] || { options: [] };
            const options = attrs.options || [];
            return options.map((option) => this.buildAttrValueSuggestion(option));
        }
        return [];
    }
}
exports["default"] = AttrValueCompletionProvider;


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode_1 = __webpack_require__(1);
const index_1 = __webpack_require__(10);
const util_1 = __webpack_require__(12);
class EventCompletionProvider {
    constructor() {
        this.quotes = '"';
        this.IS_EVENT = /\s(@|(v-on:))[\w-]*$/;
    }
    buildEventSuggestion(eventDesc) {
        const insertText = `${eventDesc.key}=${this.quotes}\$0${this.quotes}`;
        return {
            label: eventDesc.key,
            sortText: `0${eventDesc.sort || ''}${eventDesc.key}`,
            insertText: new vscode_1.SnippetString(insertText),
            kind: vscode_1.CompletionItemKind.Method,
            detail: `[VUE] ${eventDesc.detail || ''}`,
            documentation: eventDesc.documentation || insertText
        };
    }
    provideCompletionItems(document, position) {
        const txt = (0, util_1.getTextBeforePosition)(document, position);
        const match = this.IS_EVENT.exec(txt);
        if (match === null) {
            return [];
        }
        this.quotes = (0, util_1.getConfig)('double-quotes') ? '"' : "'";
        // attrs包括了event
        const res = (0, util_1.getPreTagAndAttrAndEvent)(document, position);
        if (res.tag && !(0, util_1.notInTemplate)(document, position)) {
            const tagInfo = index_1.default.filter((item) => item.name === res.tag)[0] || { events: [] };
            const events = tagInfo.events || [];
            const eventsSuggestion = [];
            events.forEach((item) => {
                if (!res.attrs[`@${item.key}`]) {
                    eventsSuggestion.push(this.buildEventSuggestion(item));
                }
            });
            return eventsSuggestion;
        }
        return [];
    }
}
exports["default"] = EventCompletionProvider;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const createWebview_1 = __webpack_require__(2);
const renderSideBar_1 = __webpack_require__(5);
const sideBarClick_1 = __webpack_require__(7);
const completion_1 = __webpack_require__(8);
function activate(context) {
    console.log('Congratulations, your extension "fetools" is now active!');
    vscode.window.showInformationMessage('欢迎使用FETools!');
    (0, renderSideBar_1.renderSideBar)();
    vscode.commands.registerCommand('edu-tools.handleClickItem', (url, title, isOpenBrowser) => {
        (0, sideBarClick_1.sideBarClick)(url, title, isOpenBrowser);
    });
    (0, completion_1.completion)(context);
    context.subscriptions.push(vscode.commands.registerCommand('openWebview', async () => {
        console.log('执行');
        (0, createWebview_1.createWebview)(context.extensionPath);
    }));
    // context.subscriptions.push(vscode.commands.registerCommand('openCfgPanel', async () => {
    //     // 当前可视窗口
    // 	const { document } = vscode.window.visibleTextEditors[0];
    // 	// 获取可视窗口文件内容
    //     const cfgFile = await document.getText().replace(/\s\s|\n/g, '');
    //     createWebview(context.extensionPath, cfgFile);
    // }));
    let disposable = vscode.commands.registerCommand('fetools.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from FETools!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map