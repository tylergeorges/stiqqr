'use client';

import {
  useEditor,
  EditorContent,
  textblockTypeInputRule,
  mergeAttributes,
  Editor as EditorType
} from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import History from '@tiptap/extension-history';
import Placeholder from '@tiptap/extension-placeholder';
import { forwardRef, useImperativeHandle } from 'react';

export interface EditorInstance {
  getTitle: () => string | undefined;
  getDescription: () => string | undefined;
  getEditor: () => EditorType;
}

interface EditorProps {
  issueTitle?: string;
  desc?: string | null;
}

const Title = Heading.extend({
  name: 'title',
  group: 'title',
  parseHTML: () => [{ tag: 'h1:first-child' }],
  renderText({ node }) {
    if (!node?.textContent?.trim()) return '';

    return node.textContent;
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = this.options.levels.includes(node.attrs.level)
      ? node.attrs.level
      : this.options.levels[0];
    const classes: { [index: number]: string } = {
      1: 'text-2xl font-semibold ',
      2: 'text-xl font-semibold ',
      3: 'text-lg font-semibold ',
      4: 'font-semibold '
    };

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `${classes[level]}`
      }),
      0
    ];
  }
}).configure({ levels: [1] });

const DocumentWithTitle = Document.extend({
  content: 'title block+'
});

export const Editor = forwardRef<EditorInstance, EditorProps>(({ issueTitle, desc }, ref) => {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'outline-none focus-visible:outline-none relative'
      }
    },
    extensions: [
      DocumentWithTitle,
      Paragraph,
      Text,
      Title,
      Bold,
      Italic,
      History,
      Heading.extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];

          const classes: { [index: number]: string } = {
            1: 'text-[22px] font-semibold relative',
            2: 'text-[19px] font-semibold relative',
            3: 'text-[17px] font-semibold relative',
            4: 'font-semibold relative'
          };

          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`
            }),
            0
          ];
        },
        renderText({ node }) {
          if (!node.textContent?.trim()) return '';

          const levels = {
            1: '#',
            2: '##',
            3: '###',
            4: '####'
          };

          const level = levels[node.attrs.level as keyof typeof levels];

          return `${level} ${node.textContent}`;
        },

        addInputRules() {
          return this.options.levels.map((level: number) => {
            return textblockTypeInputRule({
              find: new RegExp(`^(#{1,${level}}) $`),
              type: this.type,
              getAttributes: {
                level
              }
            });
          });
        }
      }).configure({ levels: [1, 2, 3, 4] }),

      Placeholder.configure({
        showOnlyCurrent: false,
        emptyNodeClass:
          'cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-0 before:left-0 before:text-mauve-11 before:opacity-50 before-pointer-events-none relative before:top-0 before:left-0',
        placeholder: ({ node }) => {
          if (node.type.name === 'title') {
            return 'Issue title';
          }

          return 'Add description...';
        }
      })
    ],

    content: `
    <h1>${issueTitle ?? ''}</h1>
    <p>${desc ?? ''}</p>
    `
  });

  useImperativeHandle(ref, () => {
    return {
      getEditor: () => {
        if (editor) return editor;
      },
      getTitle: () => {
        if (!editor) return;
        const headingNode = editor.state.doc.child(0);
        const title = headingNode.firstChild?.text;

        if (!title) return;

        const titleOffset = title.length + 2;

        return editor.state.doc.textBetween(0, titleOffset);
      },
      getDescription: () => {
        if (!editor) return;
        const headingNode = editor.state.doc.child(0);

        const title = headingNode.firstChild?.text;

        const editorContent = editor.getText();

        if (!title) {
          return editorContent.substring(1);
        }

        const titleOffset = title.length;

        return editorContent.substring(titleOffset + 2);
      }
    } as EditorInstance;
  });

  return (
    <EditorContent
      editor={editor}
      className="prose relative max-w-full text-[15px] outline-none focus-visible:outline-none prose-p:mt-0 prose-p:text-foreground"
    />
  );
});

Editor.displayName = 'Editor';
