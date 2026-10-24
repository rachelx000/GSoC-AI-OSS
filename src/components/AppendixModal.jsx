import { useEffect, useRef } from 'react';
import appendixUrl from '../assets/GSoC_appendix.pdf?url';

export default function AppendixModal({ onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="appendix-dialog"
      aria-labelledby="appendix-dialog-title"
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="appendix-modal">
        <header className="appendix-modal-header">
          <h2 id="appendix-dialog-title">Appendix</h2>
          <button
            type="button"
            className="appendix-modal-close"
            aria-label="Close appendix"
            onClick={onClose}
            autoFocus
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <iframe
          className="appendix-pdf-frame"
          src={`${appendixUrl}#view=FitH`}
          title="GSoC AI-to-OSS appendix PDF"
        />

        <footer className="appendix-modal-footer">
          <a href={appendixUrl} target="_blank" rel="noreferrer">
            Open in new tab
          </a>
          <a className="appendix-download" href={appendixUrl} download="GSoC_appendix.pdf">
            Download PDF
          </a>
        </footer>
      </div>
    </dialog>
  );
}
