import '../styles/Loader.css';

function Loader({ size = 'inline' }) {
    return (
        <div className={`loader-container${size === 'full' ? ' loader-full' : ''}`}>
            <div className="spinner"></div>
        </div>
    );
}

export default Loader;
