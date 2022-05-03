import { languages } from 'vscode';
import TagCompletionProvider from './provider/tagCompletionProvider';
import AttrCompletionProvider from './provider/attrCompletionProvider';
import AttrValueCompletionProvider from './provider/attrValueCompletionProvider';
import EventCompletionProvider from './provider/eventCompletionProvider';

const WORD_REG = /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/gi
const type = [
    { language: 'vue', scheme: 'file'}, 
    { language: 'html', scheme: 'file'}
];
export const completion = (context: any) => {
    const tagCompletionProvider = new TagCompletionProvider();
    const attrCompletionProvider = new AttrCompletionProvider();
    const attrValueCompletionProvider = new AttrValueCompletionProvider();
    const eventCompletionProvider = new EventCompletionProvider();

    const tagCompletion = languages.registerCompletionItemProvider(type, tagCompletionProvider, '<');
    const attrCompletion = languages.registerCompletionItemProvider(type, attrCompletionProvider, ' ', ':', '\n');
    const attrValueCompletion = languages.registerCompletionItemProvider(type, attrValueCompletionProvider, '"', "'");
    const eventCompletion = languages.registerCompletionItemProvider(type, eventCompletionProvider, '@', ':');
    const vueLanguageConfig = languages.setLanguageConfiguration('vue', { wordPattern: WORD_REG });
    context.subscriptions.push(
        tagCompletion,
        attrCompletion,
        attrValueCompletion,
        eventCompletion,
        vueLanguageConfig
    );
}; 
