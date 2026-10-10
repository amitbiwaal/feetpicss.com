"use client";

import { Image } from "@tiptap/extension-image";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { TextSelection } from "@tiptap/pm/state";
import { EditorContent, useEditor, type ChainedCommands, type Editor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useReducer, useRef, useState, type ReactNode } from "react";

export type UploadedImage = { url: string; width: number; height: number };

type Props = {
  initialHtml: string;
  onChange: (html: string) => void;
  uploadImage: (file: File) => Promise<UploadedImage>;
};

type Popover = "link" | "image" | null;

// Defined once: this component re-renders on every keystroke, and fresh option objects on each
// render would make Tiptap re-apply its configuration every time.
const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    // rel/target are decided on the server when the post is saved (see lib/sanitize.ts).
    link: { openOnClick: false, autolink: true, defaultProtocol: "https", HTMLAttributes: { rel: null, target: null } },
  }),
  Image.configure({ allowBase64: false }),
  Placeholder.configure({ placeholder: "Start writing your article…" }),
  CharacterCount,
];

const EDITOR_PROPS = { attributes: { class: "prose", "aria-label": "Article content" } };

/** Turns "example.com" into "https://example.com" but leaves /paths, #anchors and mailto: alone. */
function normalizeUrl(value: string): string {
  const url = value.trim();
  if (!url) return "";
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(url)) return url;
  return `https://${url}`;
}

/**
 * Re-renders the caller after every editor transaction so the toolbar reflects the selection.
 * (Tiptap's useEditorState is not used here: created without an editor, it keeps returning its
 * first, empty snapshot until a transaction happens, which never comes if rendering waits on it.)
 */
function useRerenderOnTransaction(editor: Editor | null) {
  const [, tick] = useReducer((count: number) => count + 1, 0);
  useEffect(() => {
    if (!editor) return;
    const onTransaction = () => tick();
    editor.on("transaction", onTransaction);
    return () => {
      editor.off("transaction", onTransaction);
    };
  }, [editor]);
}

function ToolButton(props: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`rte-btn${props.active ? " on" : ""}`}
      title={props.label}
      aria-label={props.label}
      aria-pressed={props.active}
      disabled={props.disabled}
      // Keep the text selection in the editor when a toolbar button is pressed.
      onMouseDown={(event) => event.preventDefault()}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function RichTextEditor({ initialHtml, onChange, uploadImage }: Props) {
  const [popover, setPopover] = useState<Popover>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [focused, setFocused] = useState(false);
  const [startHtml] = useState(initialHtml);
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    // The editor is created in the browser only; rendering it on the server causes hydration mismatches.
    immediatelyRender: false,
    extensions: EXTENSIONS,
    // Only the HTML present at mount seeds the editor; later prop changes (after a save) are ignored.
    content: startHtml,
    editorProps: EDITOR_PROPS,
    onUpdate: ({ editor: instance }) => onChange(instance.isEmpty ? "" : instance.getHTML()),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  });

  useRerenderOnTransaction(editor);

  if (!editor) {
    return (
      <div className="rte">
        <div className="rte-loading muted">Loading editor…</div>
      </div>
    );
  }

  const state = {
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    underline: editor.isActive("underline"),
    strike: editor.isActive("strike"),
    h2: editor.isActive("heading", { level: 2 }),
    h3: editor.isActive("heading", { level: 3 }),
    h4: editor.isActive("heading", { level: 4 }),
    bulletList: editor.isActive("bulletList"),
    orderedList: editor.isActive("orderedList"),
    blockquote: editor.isActive("blockquote"),
    link: editor.isActive("link"),
    canUndo: editor.can().undo(),
    canRedo: editor.can().redo(),
    words: editor.storage.characterCount.words() as number,
  };

  const openLink = () => {
    setLinkUrl((editor.getAttributes("link").href as string | undefined) ?? "");
    setPopover(popover === "link" ? null : "link");
  };

  const applyLink = () => {
    const href = normalizeUrl(linkUrl);
    const chain = editor.chain().focus().extendMarkRange("link");
    if (!href) {
      chain.unsetLink().run();
    } else if (editor.state.selection.empty && !editor.isActive("link")) {
      // Nothing selected: insert the URL itself as the linked text.
      chain.insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run();
    } else {
      chain
        .setLink({ href })
        // Put the cursor after the link and drop the link mark, so whatever is typed next is plain text.
        .command(({ tr, state }) => {
          tr.setSelection(TextSelection.create(tr.doc, tr.selection.to));
          tr.removeStoredMark(state.schema.marks.link);
          return true;
        })
        .run();
    }
    setPopover(null);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setPopover(null);
  };

  const openImage = () => {
    setUploadError("");
    setImageAlt("");
    setPopover(popover === "image" ? null : "image");
  };

  const onFileChosen = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const image = await uploadImage(file);
      // The empty paragraph gives the cursor somewhere to land after the image. Without it the
      // image itself stays selected and the next keystroke would replace it.
      editor
        .chain()
        .focus()
        .insertContent([
          {
            type: "image",
            attrs: { src: image.url, alt: imageAlt.trim(), width: image.width, height: image.height },
          },
          { type: "paragraph" },
        ])
        .run();
      setPopover(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const run = (command: (chain: ChainedCommands) => ChainedCommands) => () =>
    command(editor.chain().focus()).run();

  return (
    <div className={`rte${focused ? " focused" : ""}`}>
      <div className="rte-toolbar" role="toolbar" aria-label="Formatting">
        <ToolButton label="Heading 2" active={state.h2} onClick={run((c) => c.toggleHeading({ level: 2 }))}>
          H2
        </ToolButton>
        <ToolButton label="Heading 3" active={state.h3} onClick={run((c) => c.toggleHeading({ level: 3 }))}>
          H3
        </ToolButton>
        <ToolButton label="Heading 4" active={state.h4} onClick={run((c) => c.toggleHeading({ level: 4 }))}>
          H4
        </ToolButton>
        <span className="sep" aria-hidden="true" />
        <ToolButton label="Bold (Ctrl+B)" active={state.bold} onClick={run((c) => c.toggleBold())}>
          <b>B</b>
        </ToolButton>
        <ToolButton label="Italic (Ctrl+I)" active={state.italic} onClick={run((c) => c.toggleItalic())}>
          <i>I</i>
        </ToolButton>
        <ToolButton label="Underline (Ctrl+U)" active={state.underline} onClick={run((c) => c.toggleUnderline())}>
          <u>U</u>
        </ToolButton>
        <ToolButton label="Strikethrough" active={state.strike} onClick={run((c) => c.toggleStrike())}>
          <s>S</s>
        </ToolButton>
        <span className="sep" aria-hidden="true" />
        <ToolButton label="Bullet list" active={state.bulletList} onClick={run((c) => c.toggleBulletList())}>
          • List
        </ToolButton>
        <ToolButton label="Numbered list" active={state.orderedList} onClick={run((c) => c.toggleOrderedList())}>
          1. List
        </ToolButton>
        <ToolButton label="Quote" active={state.blockquote} onClick={run((c) => c.toggleBlockquote())}>
          “ ”
        </ToolButton>
        <ToolButton label="Divider line" onClick={run((c) => c.setHorizontalRule())}>
          ―
        </ToolButton>
        <span className="sep" aria-hidden="true" />
        <ToolButton label="Link" active={state.link || popover === "link"} onClick={openLink}>
          Link
        </ToolButton>
        <ToolButton label="Insert image" active={popover === "image"} onClick={openImage}>
          Image
        </ToolButton>
        <span className="sep" aria-hidden="true" />
        <ToolButton label="Undo (Ctrl+Z)" disabled={!state.canUndo} onClick={run((c) => c.undo())}>
          ↶
        </ToolButton>
        <ToolButton label="Redo (Ctrl+Y)" disabled={!state.canRedo} onClick={run((c) => c.redo())}>
          ↷
        </ToolButton>
        <ToolButton label="Clear formatting" onClick={run((c) => c.unsetAllMarks().clearNodes())}>
          Clear
        </ToolButton>
      </div>

      {popover === "link" ? (
        <div className="rte-pop">
          <label htmlFor="rte-link-url">Link URL</label>
          <input
            id="rte-link-url"
            type="url"
            inputMode="url"
            placeholder="https://example.com or /blog/another-post"
            value={linkUrl}
            autoFocus
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }
              if (event.key === "Escape") setPopover(null);
            }}
          />
          <button type="button" className="a-btn small primary" onClick={applyLink}>
            Apply
          </button>
          {state.link ? (
            <button type="button" className="a-btn small" onClick={removeLink}>
              Remove link
            </button>
          ) : null}
        </div>
      ) : null}

      {popover === "image" ? (
        <div className="rte-pop">
          <label htmlFor="rte-image-alt">Image description (alt text)</label>
          <input
            id="rte-image-alt"
            type="text"
            placeholder="Describe the image for search engines and screen readers"
            maxLength={200}
            value={imageAlt}
            autoFocus
            onChange={(event) => setImageAlt(event.target.value)}
          />
          <button
            type="button"
            className="a-btn small primary"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          >
            {uploading ? "Uploading…" : "Choose image"}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            onChange={(event) => onFileChosen(event.target.files?.[0])}
          />
          {uploadError ? (
            <span className="save-note bad" role="alert">
              {uploadError}
            </span>
          ) : null}
        </div>
      ) : null}

      <EditorContent editor={editor} className="rte-content" />

      <div className="rte-foot">
        <span>{state.words} words</span>
        <span>About {Math.max(1, Math.round(state.words / 220))} min read</span>
      </div>
    </div>
  );
}
