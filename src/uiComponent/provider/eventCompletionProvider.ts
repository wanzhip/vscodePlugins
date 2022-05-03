import {
  CompletionItemProvider, ProviderResult,
  TextDocument, Position, CompletionItem, CompletionList, CompletionItemKind,
  SnippetString
} from 'vscode';

import config from '../config/index';
import { notInTemplate, getPreTagAndAttrAndEvent, getConfig, getTextBeforePosition } from '../util';

export default class EventCompletionProvider implements CompletionItemProvider {
  quotes: string = '"';

  IS_EVENT = /\s(@|(v-on:))[\w-]*$/;

  buildEventSuggestion(eventDesc: any) {
    const insertText = `${eventDesc.key}=${this.quotes}\$0${this.quotes}`;

    return {
      label: eventDesc.key,
      sortText: `0${eventDesc.sort || ''}${eventDesc.key}`,
      insertText: new SnippetString(insertText),
      kind: CompletionItemKind.Method,
      detail: `[VUE] ${eventDesc.detail || ''}`,
      documentation: eventDesc.documentation || insertText
    }
  }

  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList> {
    const txt = getTextBeforePosition(document, position);
    const match = this.IS_EVENT.exec(txt);
    if (match === null) {
      return [];
    }
    this.quotes = getConfig('double-quotes') ? '"' : "'";
    // attrs包括了event
    const res: any = getPreTagAndAttrAndEvent(document, position);

    if (res.tag && !notInTemplate(document, position)) {
      const tagInfo = config.filter((item: any) => item.name === res.tag)[0] || {events: []};
      const events: any[] = tagInfo.events || [];
      const eventsSuggestion: any = [];
      events.forEach((item: any) => {
        if (!res.attrs[`@${item.key}`]) {
          eventsSuggestion.push(this.buildEventSuggestion(item));
        }
      })
      return eventsSuggestion;
    }
    return [];
  }
}
