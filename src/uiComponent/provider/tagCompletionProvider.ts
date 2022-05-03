import {
  CompletionItemProvider, ProviderResult, TextDocument, Position, CompletionItem, 
  CompletionList, CompletionItemKind, SnippetString
} from 'vscode';

import config from '../config/index';
import { getTextBeforePosition, notInTemplate, getConfig } from '../util';

export default class TagCompletionProvider implements CompletionItemProvider {
  quotes: string = '"';
  size: number = 2;
  wrapAttributes: 'auto' | 'force' | 'force-expand-multiline' | 'force-aligned' | 'aligned-multiple' = 'force-expand-multiline';

  TAG_START_REG = /<([\w-]*)$/;

  buildTagSuggestion(itemDesc: any) {
    const tagSnippets = itemDesc.snippets;
    const that = this;
    function build(tagDesc: any) {
      // 如果是文本，直接返回文本
      if (tagDesc.text) {
        return tagDesc.text;
      }
      let html = `<${tagDesc.tag}`;
      // 处理属性
      if (tagDesc.attrs) {
        const attrs = tagDesc.attrs;
        Object.keys(attrs).forEach((attrName: string) => {
          if (attrs[attrName] === null) {
            // 无值属性，例如：<input disabled></input>
            html += ` ${attrName}`;
          } else {
            // 添加属性 例如 value="123"
            html += ` ${attrName}=${that.quotes}${attrs[attrName]}${that.quotes}`;
          }
        })
      }
      // 如果是自闭合标签，则直接返回
      if (tagDesc.selfClose) {
        html += '/>'
        return html;
      }
      html += '>'
      if (tagDesc.children) {
        tagDesc.children.forEach((child: any) => {
          html += `${build(child)}`;
        })
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
      insertText: new SnippetString(_snippets),
      kind: CompletionItemKind.Class,
      detail: `[VUE] ${itemDesc.detail || itemDesc.name}`,
      documentation: itemDesc.documentation || snippets
    }
  }

  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList> {
    this.quotes = getConfig('double-quotes') ? '"' : "'";
    this.size = getConfig('indent-size') || 2;
    
    const txt = getTextBeforePosition(document, position);
    if(this.TAG_START_REG.test(txt) && !notInTemplate(document, position)) {
      return config.map((item: any) => {
        return this.buildTagSuggestion(item);
      });
    }
    return [];
  }
}