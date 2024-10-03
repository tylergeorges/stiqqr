'use client';

import { useEditor, EditorContent, textblockTypeInputRule, mergeAttributes } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import History from '@tiptap/extension-history';
import Placeholder from '@tiptap/extension-placeholder';

interface EditorProps {
  issueTitle: string;
  desc?: string;
}

const Title = Heading.extend({
  name: 'title',
  group: 'title',
  parseHTML: () => [{ tag: 'h1:first-child' }],
  renderHTML({ node, HTMLAttributes }) {
    const level = this.options.levels.includes(node.attrs.level)
      ? node.attrs.level
      : this.options.levels[0];
    const classes: { [index: number]: string } = {
      1: 'text-2xl font-semibold prose',
      2: 'text-xl font-semibold',
      3: 'text-lg font-semibold',
      4: 'font-semibold'
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

export const Editor = ({ issueTitle, desc }: EditorProps) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'outline-none focus-visible:outline-none'
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
            1: 'text-[22px] font-semibold',
            2: 'text-[19px] font-semibold',
            3: 'text-[17px] font-semibold',
            4: 'font-semibold'
          };

          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`
            }),
            0
          ];
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
        placeholder: ({ node }) => {
          if (node.type.name === 'title') {
            return 'Issue title';
          }

          return 'Add description...';
        }
      })
    ],

    content: `
    <h1>${issueTitle}</h1>
    
    <p>${desc}</p>
    `
  });

  return (
    <EditorContent
      editor={editor}
      className="prose max-w-full text-[15px] outline-none focus-visible:outline-none prose-p:mt-0 prose-p:text-foreground"
    />
  );
};
