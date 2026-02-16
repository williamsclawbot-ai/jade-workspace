'use client';

import { useState } from 'react';
import { Copy, Download, Share2, Edit2 } from 'lucide-react';

interface Document {
  id: string;
  folder: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentViewerProps {
  document: Document;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(document.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/markdown;charset=utf-8,' + encodeURIComponent(document.content)
    );
    element.setAttribute('download', `${document.title}.md`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Simple markdown to HTML conversion
  const renderMarkdown = (content: string) => {
    let html = content;

    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Lists
    html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    return html;
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Document Header */}
      <div className="border-b border-jade-light px-8 py-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold text-jade-purple mb-2">
              {document.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {document.folder} • Updated {new Date(document.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-jade-cream rounded-lg transition-colors tooltip"
              title="Copy to clipboard"
            >
              <Copy size={20} className="text-jade-purple" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-jade-cream rounded-lg transition-colors"
              title="Download as markdown"
            >
              <Download size={20} className="text-jade-purple" />
            </button>
            <button
              className="p-2 hover:bg-jade-cream rounded-lg transition-colors"
              title="Share document"
            >
              <Share2 size={20} className="text-jade-purple" />
            </button>
            <button
              className="p-2 hover:bg-jade-cream rounded-lg transition-colors"
              title="Edit document"
            >
              <Edit2 size={20} className="text-jade-purple" />
            </button>
          </div>
        </div>
        {copied && (
          <div className="text-sm text-green-600">✓ Copied to clipboard</div>
        )}
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl prose prose-sm">
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(document.content),
            }}
          />
        </div>
      </div>

      {/* Document Footer */}
      <div className="border-t border-jade-light px-8 py-4 bg-jade-cream text-sm text-gray-600">
        <div className="flex justify-between">
          <div>Created: {new Date(document.createdAt).toLocaleDateString()}</div>
          <div>Words: {document.content.split(/\s+/).length}</div>
        </div>
      </div>
    </div>
  );
}
