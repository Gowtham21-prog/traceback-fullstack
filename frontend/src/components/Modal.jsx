import Icon from './Icon';

export default function Modal({ open, onClose, large, children, showClose = true }) {
  if (!open) return null;
  return (
    <div className="modal-over" style={{ display: 'flex' }} onClick={onClose}>
      <div className={`modal-box ${large ? 'modal-lg' : ''}`} onClick={(e) => e.stopPropagation()}>
        {showClose && (
          <button className="modal-x" onClick={onClose}>
            <Icon name="close" style={{ fontSize: 18 }} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
