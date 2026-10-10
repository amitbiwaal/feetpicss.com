"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { savePostAction, type PostInput } from "@/lib/actions/posts";
import type { PostImage, PostStatus } from "@/lib/posts";
import { SITE, slugify } from "@/lib/site";
import { RichTextEditor, type UploadedImage } from "./RichTextEditor";

type Props = {
  initial: PostInput;
  /** True until the post has been saved for the first time. */
  isNew: boolean;
  /** Existing category names, offered as suggestions. */
  categories: string[];
};

type Notice = { kind: "ok" | "bad"; text: string } | null;

const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MAX = 160;

async function uploadImage(file: File): Promise<UploadedImage> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json().catch(() => null)) as (UploadedImage & { error?: string }) | null;
  if (!response.ok || !data?.url) throw new Error(data?.error ?? "Upload failed. Try again.");
  return { url: data.url, width: data.width, height: data.height };
}

function Counter({ value, max }: { value: string; max: number }) {
  return (
    <div className={`counter${value.length > max ? " over" : ""}`}>
      {value.length} / {max}
    </div>
  );
}

export function PostEditor({ initial, isNew, categories }: Props) {
  const postId = initial.id;
  const [saved, setSaved] = useState(!isNew);
  const [savedStatus, setSavedStatus] = useState<PostStatus>(initial.status);
  const [savedSlug, setSavedSlug] = useState(initial.slug);
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  // A new post's slug follows the title until the slug field is edited by hand.
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [content, setContent] = useState(initial.content);
  const [coverImage, setCoverImage] = useState<PostImage | null>(initial.coverImage);
  const [category, setCategory] = useState(initial.category);
  const [tags, setTags] = useState(initial.tags.join(", "));
  const [author, setAuthor] = useState(initial.author);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [seoDescription, setSeoDescription] = useState(initial.seoDescription);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Notice>(null);
  const [dirty, setDirty] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);
  const [pending, startTransition] = useTransition();
  const coverInput = useRef<HTMLInputElement>(null);
  // Counts edits, so a save can tell whether anything changed while its request was in flight.
  const revision = useRef(0);

  const effectiveSlug = slugEdited ? slug : slugify(title);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  /** Wraps a state setter so any edit marks the form as having unsaved changes. */
  function edit<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      revision.current += 1;
      setDirty(true);
      setNotice(null);
    };
  }

  function save(status: PostStatus) {
    setErrors({});
    setNotice(null);
    const savedRevision = revision.current;
    startTransition(async () => {
      let result: Awaited<ReturnType<typeof savePostAction>>;
      try {
        result = await savePostAction({
          id: postId,
          title,
          slug: effectiveSlug,
          excerpt,
          content,
          coverImage,
          category,
          tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          author,
          seoTitle,
          seoDescription,
          status,
        });
      } catch {
        setNotice({ kind: "bad", text: "Could not save. Check your connection and that you are still signed in." });
        return;
      }

      if (!result.ok) {
        setErrors(result.errors);
        setNotice({ kind: "bad", text: result.errors.form ?? "Fix the highlighted fields and save again." });
        return;
      }

      // Something typed while the request was in flight is not in what was just saved.
      const editedMeanwhile = revision.current !== savedRevision;
      setSaved(true);
      setSavedSlug(result.slug);
      setSavedStatus(result.status);
      setSlugEdited(true);
      if (!editedMeanwhile) {
        // The server may have adjusted the slug (made it unique); show what was stored.
        setSlug(result.slug);
        setDirty(false);
      }
      const done = result.status === "published" ? "Published — the live site is updated." : "Draft saved.";
      setNotice({ kind: "ok", text: editedMeanwhile ? `${done} Changes made since are not saved yet.` : done });
    });
  }

  // Ctrl/Cmd+S saves without changing the current published/draft state. The ref always points
  // at the latest closure, so the key listener can be attached once.
  const quickSave = useRef<() => void>(() => {});
  useEffect(() => {
    quickSave.current = () => save(savedStatus);
  });
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        quickSave.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function onCoverChosen(file: File | undefined) {
    if (!file) return;
    setCoverBusy(true);
    setErrors((current) => ({ ...current, coverImage: "" }));
    try {
      const image = await uploadImage(file);
      edit(setCoverImage)({ ...image, alt: coverImage?.alt ?? "" });
    } catch (error) {
      setErrors((current) => ({
        ...current,
        coverImage: error instanceof Error ? error.message : "Upload failed.",
      }));
    } finally {
      setCoverBusy(false);
      if (coverInput.current) coverInput.current.value = "";
    }
  }

  const isPublished = savedStatus === "published";
  const serpTitle = `${seoTitle || title || "Post title"} | ${SITE.name}`;
  const serpDescription = seoDescription || excerpt || "Add an excerpt or SEO description to control this text.";

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>{saved ? "Edit post" : "New post"}</h1>
          <p>
            <span className={`status ${savedStatus}`}>{saved ? savedStatus : "not saved"}</span>
            {dirty ? " · Unsaved changes" : ""}
          </p>
        </div>
        <div className="editor-actions">
          {notice ? (
            <span className={`save-note ${notice.kind}`} role={notice.kind === "bad" ? "alert" : "status"}>
              {notice.text}
            </span>
          ) : null}
          {saved ? (
            <a className="a-btn" href={`/admin/posts/${postId}/preview`} target="_blank" rel="noopener">
              Preview
            </a>
          ) : null}
          {isPublished && !dirty ? (
            <a className="a-btn" href={`/blog/${savedSlug}`} target="_blank" rel="noopener">
              View live
            </a>
          ) : null}
          <button type="button" className="a-btn" disabled={pending} onClick={() => save("draft")}>
            {isPublished ? "Unpublish (save as draft)" : "Save draft"}
          </button>
          <button type="button" className="a-btn primary" disabled={pending} onClick={() => save("published")}>
            {pending ? "Saving…" : isPublished ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="editor-grid">
        <div>
          <label className="sr-only" htmlFor="post-title">
            Post title
          </label>
          <input
            id="post-title"
            className="title-input"
            type="text"
            placeholder="Post title"
            maxLength={140}
            value={title}
            aria-invalid={errors.title ? true : undefined}
            onChange={(event) => edit(setTitle)(event.target.value)}
          />
          {errors.title ? (
            <p className="save-note bad" role="alert">
              {errors.title}
            </p>
          ) : null}

          <RichTextEditor initialHtml={initial.content} onChange={edit(setContent)} uploadImage={uploadImage} />
          {errors.content ? (
            <p className="save-note bad" role="alert" style={{ marginTop: 8 }}>
              {errors.content}
            </p>
          ) : null}
        </div>

        <aside className="editor-side" aria-label="Post settings">
          <div className="a-card">
            <h2>Post settings</h2>
            <div className="field compact">
              <label htmlFor="post-slug">URL slug</label>
              <div className="slug-row">
                <span>/blog/</span>
                <input
                  id="post-slug"
                  type="text"
                  value={effectiveSlug}
                  maxLength={80}
                  spellCheck={false}
                  autoCapitalize="none"
                  aria-invalid={errors.slug ? true : undefined}
                  onChange={(event) => {
                    setSlugEdited(true);
                    edit(setSlug)(event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"));
                  }}
                />
              </div>
              {errors.slug ? <span className="err">{errors.slug}</span> : null}
              {isPublished ? <span className="hint">Changing the slug of a live post breaks existing links.</span> : null}
            </div>
            <div className="field compact">
              <label htmlFor="post-excerpt">Excerpt</label>
              <textarea
                id="post-excerpt"
                value={excerpt}
                maxLength={300}
                placeholder="One or two sentences shown on the blog list. Left empty, it is taken from the article."
                onChange={(event) => edit(setExcerpt)(event.target.value)}
              />
            </div>
            <div className="field compact">
              <label htmlFor="post-category">Category</label>
              <input
                id="post-category"
                type="text"
                list="post-categories"
                value={category}
                maxLength={40}
                placeholder="Guides"
                onChange={(event) => edit(setCategory)(event.target.value)}
              />
              <datalist id="post-categories">
                {categories.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
            <div className="field compact">
              <label htmlFor="post-tags">Tags</label>
              <input
                id="post-tags"
                type="text"
                value={tags}
                placeholder="privacy, pricing, beginners"
                onChange={(event) => edit(setTags)(event.target.value)}
              />
              <span className="hint">Separate tags with commas.</span>
            </div>
            <div className="field compact">
              <label htmlFor="post-author">Author</label>
              <input
                id="post-author"
                type="text"
                value={author}
                maxLength={60}
                placeholder={SITE.defaultAuthor}
                onChange={(event) => edit(setAuthor)(event.target.value)}
              />
            </div>
          </div>

          <div className="a-card">
            <h2>Cover image</h2>
            <div className="cover-box">
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImage.url} alt="" width={coverImage.width} height={coverImage.height} />
              ) : (
                <p className="muted">Shown at the top of the post, on the blog list and when shared.</p>
              )}
              <div className="row">
                <button
                  type="button"
                  className="a-btn small"
                  disabled={coverBusy}
                  onClick={() => coverInput.current?.click()}
                >
                  {coverBusy ? "Uploading…" : coverImage ? "Replace" : "Upload image"}
                </button>
                {coverImage ? (
                  <button type="button" className="a-btn small danger" onClick={() => edit(setCoverImage)(null)}>
                    Remove
                  </button>
                ) : null}
              </div>
              <input
                ref={coverInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                onChange={(event) => onCoverChosen(event.target.files?.[0])}
              />
            </div>
            {errors.coverImage ? (
              <p className="save-note bad" role="alert">
                {errors.coverImage}
              </p>
            ) : null}
            {coverImage ? (
              <div className="field compact" style={{ marginTop: 12 }}>
                <label htmlFor="post-cover-alt">Image description (alt text)</label>
                <input
                  id="post-cover-alt"
                  type="text"
                  maxLength={200}
                  value={coverImage.alt}
                  onChange={(event) => edit(setCoverImage)({ ...coverImage, alt: event.target.value })}
                />
              </div>
            ) : null}
          </div>

          <div className="a-card">
            <h2>Search engine preview</h2>
            <div className="serp" aria-hidden="true">
              <div className="url">
                {SITE.domain} › blog › {effectiveSlug || "post-url"}
              </div>
              <div className="t">{serpTitle}</div>
              <div className="d">{serpDescription}</div>
            </div>
            <div className="field compact" style={{ marginTop: 14 }}>
              <label htmlFor="post-seo-title">SEO title</label>
              <input
                id="post-seo-title"
                type="text"
                value={seoTitle}
                maxLength={70}
                placeholder={title || "Defaults to the post title"}
                onChange={(event) => edit(setSeoTitle)(event.target.value)}
              />
              <Counter value={seoTitle || title} max={SEO_TITLE_MAX} />
            </div>
            <div className="field compact">
              <label htmlFor="post-seo-description">Meta description</label>
              <textarea
                id="post-seo-description"
                value={seoDescription}
                maxLength={170}
                placeholder="Defaults to the excerpt"
                onChange={(event) => edit(setSeoDescription)(event.target.value)}
              />
              <Counter value={seoDescription || excerpt} max={SEO_DESCRIPTION_MAX} />
            </div>
          </div>

          <p className="save-note">
            Tip: press Ctrl+S to save. <Link href="/admin">Back to all posts</Link>
          </p>
        </aside>
      </div>
    </>
  );
}
