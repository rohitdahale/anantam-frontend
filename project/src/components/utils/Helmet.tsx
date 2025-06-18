import { useEffect } from 'react';

interface HelmetProps {
  title: string;
}

export const Helmet = ({ title }: HelmetProps) => {
  useEffect(() => {
    // Update the document title
    document.title = title;
    
    // Clean up on unmount
    return () => {
      const defaultTitle = document.querySelector('title[data-default]');
      if (defaultTitle) {
        document.title = defaultTitle.textContent || '';
      }
    };
  }, [title]);

  return null;
};