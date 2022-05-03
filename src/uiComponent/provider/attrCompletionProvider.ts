import {
  CompletionItemProvider, ProviderResult, TextDocument, Position, CompletionItem, CompletionList, CompletionItemKind,
  SnippetString
} from 'vscode';

import config from '../config/index';
import { notInTemplate, getPreTagAndAttrAndEvent, getConfig, getTextBeforePosition } from '../util';

export default class AttrCompletionProvider implements CompletionItemProvider {
  quotes: string = '"';

  IS_ATTR = /\s((:|(v-bind:))?)(\w-)*$/;

  buildAttrSuggestion(attrDesc: any, completeEqualSign: boolean) {
    let insertText = '';
    if (attrDesc.isBoolean && !completeEqualSign) {
      insertText = `${attrDesc.key}`;
    } else {
      insertText = `${attrDesc.key}=${this.quotes}\$\{0:${attrDesc.default || ''}\}${this.quotes}`;
    }
    return {
      label: attrDesc.key,
      sortText: `0${attrDesc.sort || ''}${attrDesc.key}`,
      insertText: new SnippetString(insertText),
      kind: CompletionItemKind.Property,
      detail: `[VUE] ${attrDesc.detail || attrDesc.key}`,
      documentation: attrDesc.documentation || insertText
    }
  }

  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList> {
    const txt = getTextBeforePosition(document, position);
    const match = this.IS_ATTR.exec(txt);
    let completeEqualSign = false;
    if (match === null) {
      return [];
    }
    if (match[1] === ':' || match[1] === 'v-bind:') {
      completeEqualSign = true;
    }
    
    this.quotes = getConfig('double-quotes') ? '"' : "'";
    const res: any = getPreTagAndAttrAndEvent(document, position)
    if (res?.tag && !notInTemplate(document, position)) {
      const tagInfo = config.filter((item: any) => item.name === res.tag)[0] || { props: [] };
      const attrs: any[] = tagInfo.props || [];
      const attrsSuggestion: any = [];
      attrs.forEach((item: any) => {
        if (!res.attrs[item.key]) {
          attrsSuggestion.push(this.buildAttrSuggestion(item, completeEqualSign));
        }
      });
      return attrsSuggestion;
    }
    return [];
  }
}