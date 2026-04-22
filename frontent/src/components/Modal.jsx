export function Modal({ isOpen, title, onClose, children }) {


  if (!isOpen) {

    return null;
  }

  return (

    <div className="modal-backdrop" onClick={onClose}>

      <div
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"  >
        <div className="modal-header">
        <h3>{title}</h3>
          <button className="icon-button" onClick={onClose} type="button">
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
