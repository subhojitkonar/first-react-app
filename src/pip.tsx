import React from 'react';
import { createRoot } from 'react-dom/client';
import { Calculator } from './components/calculator/Calculator';

interface DocumentPictureInPicture {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
}

declare global {
  interface Window {
    documentPictureInPicture?: DocumentPictureInPicture;
  }
}

let pipWindowRef: Window | null = null;

function cloneStyles(targetDoc: Document) {
  // Clone <link rel="stylesheet"> and <style> tags so styles apply inside PiP window
  const head = targetDoc.head;
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const newLink = targetDoc.createElement('link');
    newLink.rel = 'stylesheet';
    (newLink as HTMLLinkElement).href = (link as HTMLLinkElement).href;
    head.appendChild(newLink);
  });
  document.querySelectorAll('style').forEach(style => {
    const newStyle = targetDoc.createElement('style');
    newStyle.textContent = style.textContent;
    head.appendChild(newStyle);
  });
}

export async function openCalculatorPiP() {
  try {
    if (!window.documentPictureInPicture) {
      alert('Document Picture-in-Picture not supported in this browser. Try Chrome 116+ or enable the experimental flag.');
      return;
    }
    // Close existing window first
    if (pipWindowRef && !pipWindowRef.closed) {
      pipWindowRef.close();
    }
    const pip = await window.documentPictureInPicture.requestWindow({ width: 360, height: 560 });
    pipWindowRef = pip;

    // Apply current theme class
    if (document.body.classList.contains('dark')) {
      pip.document.body.classList.add('dark');
    }
    pip.document.body.style.margin = '0';
    pip.document.body.style.padding = '8px';
    cloneStyles(pip.document);

    const mount = pip.document.createElement('div');
    pip.document.body.appendChild(mount);
    createRoot(mount).render(
      <React.StrictMode>
        <Calculator />
      </React.StrictMode>
    );

    // Listen for theme changes from main window
    interface ThemeChangeDetail {
      dark: boolean;
    }

    function onTheme(e: Event) {
      const detail = (e as CustomEvent<ThemeChangeDetail>).detail;
      const useDark = detail?.dark;
      pip.document.body.classList.toggle('dark', !!useDark);
    }
    window.addEventListener('theme-change', onTheme);
    pip.addEventListener('pagehide', () => window.removeEventListener('theme-change', onTheme));
  } catch (err) {
    console.error('Failed to open PiP window', err);
  }
}

export function closeCalculatorPiP() {
  if (pipWindowRef && !pipWindowRef.closed) pipWindowRef.close();
  pipWindowRef = null;
}
