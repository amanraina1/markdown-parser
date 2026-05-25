interface Button {
  key: string;
  label?: string;
  title?: string;
  sep?: boolean;
}

const buttons: Button[] = [
  { key: "h1", label: "H1", title: "Heading 1" },
  { key: "h2", label: "H2", title: "Heading 2" },
  { key: "h3", label: "H3", title: "Heading 3" },

  { key: "sep1", sep: true },
  { key: "bold", label: "B", title: "Bold (**text**)" },
  { key: "italic", label: "I", title: "Italic (text)" },
  { key: "underline", label: "U", title: "Underline (__text__)" },
  { key: "strikethrough", label: "S̶", title: "Strikethrough (~~text~~)" },

  { key: "sep2", sep: true },
  { key: "code", label: "</>", title: "Inline code" },
  { key: "codeblock", label: "", title: "Code block" },

  { key: "sep3", sep: true },
  { key: "blockquote", label: "❝", title: "Blockquote (> text)" },
  { key: "ul", label: "• List", title: "Unordered list" },
  { key: "ol", label: "1. List", title: "Ordered list" },

  { key: "sep4", sep: true },
  { key: "link", label: "🔗", title: "Link [text](url)" },
  { key: "hr", label: "—", title: "Horizontal rule (---)" },
];

export default function Toolbar({ actions }) {
  return (
    <div className="toolbar">
      {buttons.map((button) =>
        button.sep ? (
          <div key={button.key} className="toolbar-sep"></div>
        ) : (
          <button
            key={button.key}
            className="tool-btn"
            title={button.title}
            onMouseDown={(e) => {
              e.preventDefault();
              actions[button.key]?.();
            }}
          >
            {button.label}
          </button>
        ),
      )}
    </div>
  );
}
