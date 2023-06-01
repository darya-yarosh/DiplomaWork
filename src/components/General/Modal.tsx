import "components/General/Modal.css";

interface ModalProps {
    onClose: () => void
    children: JSX.Element
}

export default function Modal({
    children,
    onClose,
}: React.PropsWithChildren<ModalProps>) {
    return (
        <div className="modal" >
            <div className="modal-content">
                <span className="modal-close" onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    )
}