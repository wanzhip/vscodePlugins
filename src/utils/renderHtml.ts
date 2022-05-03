import { Uri } from 'vscode';

export interface HtmlOptions {
    links?: LinkOptions[];
    scripts?: ScriptOptions[];
}

export interface LinkOptions {
    rel?: string;
    href: Uri;
}

export interface ScriptOptions {
    src: Uri;
}

export default function ({ links = [], scripts = []}: HtmlOptions) {
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
