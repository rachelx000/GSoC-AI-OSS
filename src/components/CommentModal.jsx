import { useEffect, useRef } from 'react';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSctMDjH7TnP2cYW1NrSu7NdC-bVgzKTI50nlVImmY-JyJiIFw/viewform';
const EMBED_URL = `${FORM_URL}?embedded=true`;

export default function CommentModal({ onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="comment-dialog"
      aria-labelledby="comment-dialog-title"
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="comment-modal">
        <header className="comment-modal-header">
          <div>
            <h2 id="comment-dialog-title">Feedback Form</h2>
          </div>
          <button type="button" className="comment-modal-close" aria-label="Close comment form" onClick={onClose} autoFocus>
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <iframe
          className="comment-form-frame"
          src={EMBED_URL}
          title="GSoC AI-to-OSS comment form"
          loading="lazy"
        />

        <footer className="comment-modal-footer">
          <span>Having trouble viewing the form?</span>
          <a href={FORM_URL} target="_blank" rel="noreferrer">Open it in a new tab</a>
        </footer>
      </div>
    </dialog>
  );
}
