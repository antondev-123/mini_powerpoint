import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

const SlideView = ({ content, layout }) => (
  <div className={`slide ${layout}`}>
    <div className="slide-content">
      <Markdown
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\\n$/, "")}
                style={okaidia}
                language={match[1]}
                PreTag="div"
                {...rest}
              />
            ) : (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  </div>
);

export default SlideView;