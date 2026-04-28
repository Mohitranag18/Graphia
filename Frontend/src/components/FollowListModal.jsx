import { useNavigate } from 'react-router-dom';
import BlankImage from '../assets/blank_profile_picture2.png';
import '../styles/FollowListModal.css';

function FollowListModal({ isOpen, onClose, title, users }) {
    const nav = useNavigate();

    if (!isOpen) return null;

    const handleUserClick = (username) => {
        onClose();
        nav(`/user/${username}`);
        window.location.reload();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="follow-modal-overlay" onClick={handleOverlayClick}>
            <div className="follow-modal-card">
                <div className="follow-modal-header">
                    <h3>{title}</h3>
                    <button className="follow-modal-close" onClick={onClose}>×</button>
                </div>
                <div className="follow-modal-body">
                    {users.length === 0 ? (
                        <p className="follow-modal-empty">
                            {title === 'Followers' ? 'No followers yet' : 'Not following anyone yet'}
                        </p>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.username}
                                className="follow-user-item"
                                onClick={() => handleUserClick(user.username)}
                            >
                                <img
                                    src={user.profile_image || BlankImage}
                                    alt={user.username}
                                    className="follow-user-avatar"
                                />
                                <div className="follow-user-info">
                                    <span className="follow-user-username">@{user.username}</span>
                                    {(user.first_name || user.last_name) && (
                                        <span className="follow-user-name">
                                            {[user.first_name, user.last_name].filter(Boolean).join(' ')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default FollowListModal;
