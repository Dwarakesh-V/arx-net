import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function ImagePlaceholder({ text, height = '300px' }) {
  return (
    <div className="image-placeholder" style={{ minHeight: height }}>
      <ImageIcon size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
      <p style={{ margin: 0 }}>{text}</p>
    </div>
  );
}
