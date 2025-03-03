import React from 'react';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PlayModalProps {
    title: string;
    content: React.ReactNode;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
    
}

const PlayModal: React.FC<PlayModalProps> = ({ title, content, confirmText, cancelText, onConfirm, onCancel }) => {
    return (
        <div className="play-modal">
            <div className="play-modal-header">
                <h2 className="play-modal-title">{title}</h2>
                <div className="play-modal-header-icon play-confirm-modal-icon">
                    {/* Add any icons if needed */}
                </div>
            </div>
            <div className="play-modal-content">
                <p className="play-confirm-modal-message">{content}</p>
            </div>
            <div className="play-modal-footer">
            <button className="play-confirm-modal-btn" onClick={onConfirm}><FontAwesomeIcon icon={faCheck}  className='play-modal-icon'/>{confirmText}</button>
                <button className="play-cancel-modal-btn" onClick={onCancel}><FontAwesomeIcon icon={faXmark} className='play-modal-icon'/>{cancelText}</button>
                
            </div>
        </div>
    );
}

export default PlayModal;
