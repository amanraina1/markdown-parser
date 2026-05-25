export default function Preview({ html }: { html: string }) {
  return (
    <div
      className="preview-content markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
