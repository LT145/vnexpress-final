"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Dropcursor from '@tiptap/extension-dropcursor';
import History from '@tiptap/extension-history'

const lowlight = createLowlight(common)

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'resize-handle mx-auto block',
          width: '640',
          height: '480'
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'table table-bordered',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Underline,
      Strike,
      Subscript,
      Superscript,
      Highlight.configure({
        multicolor: true
      }),
      Youtube.configure({
        inline: false,
        width: 640,
        height: 480,
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Dropcursor,
      History,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor border rounded-lg overflow-hidden">
      <div className="border-b p-2 flex flex-wrap gap-2 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Đậm"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Nghiêng"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Gạch chân"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Gạch ngang"
        >
          <s>S</s>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('subscript') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Chỉ số dưới"
        >
          x₂
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('superscript') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Chỉ số trên"
        >
          x²
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('highlight') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Đánh dấu"
        >
          <span className="bg-yellow-200">H</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          type="button"
          title="Tiêu đề"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Danh sách không thứ tự"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Danh sách có thứ tự"
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('taskList') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Danh sách công việc"
        >
          ☐ Task
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
          type="button"
          title="Căn trái"
        >
          ←
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
          type="button"
          title="Căn giữa"
        >
          ↔
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
          type="button"
          title="Căn phải"
        >
          →
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Nhập URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Chèn liên kết"
        >
          🔗
        </button>
        <button
          onClick={async () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                // Hiển thị ảnh tạm thời từ file local
                const tempUrl = URL.createObjectURL(file);
                editor.chain().focus().setImage({ 
                  src: tempUrl
                }).run();
                
                // Upload ảnh lên server
                const formData = new FormData();
                formData.append('image', file);
                try {
                  const response = await fetch(`https://api.imgbb.com/1/upload?key=d56688ff153b4c9dcb972fab16a5aadd`, {
                    method: 'POST',
                    body: formData,
                    // Remove mode: 'no-cors'
                  });
                  const data = await response.json();
                  if (data.data?.url) {
                    // Cập nhật lại ảnh với URL từ server
                    editor.chain().focus().setImage({ 
                      src: data.data.url
                    }).run();
                  } else {
                    alert('Tải ảnh lên thất bại');
                  }
                } catch (error) {
                  console.error('Error uploading image:', error);
                  alert('Tải ảnh lên thất bại');
                }
              }
            };
            input.click();
          }}
          className="p-2 rounded hover:bg-gray-200"
          type="button"
          title="Chèn ảnh"
        >
          🖼
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Nhập URL video YouTube:');
            if (url) {
              editor.chain().focus().setYoutubeVideo({
                src: url
              }).run();
            }
          }}
          className="p-2 rounded hover:bg-gray-200"
          type="button"
          title="Chèn video YouTube"
        >
          📺
        </button>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-2 rounded hover:bg-gray-200"
          type="button"
          title="Chèn bảng"
        >
          📊
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
          type="button"
          title="Chèn mã code"
        >
          {`</>`}
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          type="button"
          title="Hoàn tác"
        >
          ↩
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          type="button"
          title="Làm lại"
        >
          ↪
        </button>
        <input
          type="color"
          onInput={e => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 p-0 rounded cursor-pointer"
          title="Màu chữ"
        />
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[200px] prose max-w-none [&_.table]:w-full [&_.table]:border-collapse [&_.table_td]:border [&_.table_th]:border [&_.table_td]:p-2 [&_.table_th]:p-2" />
    </div>
  );
}