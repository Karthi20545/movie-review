import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--bg-secondary)', padding: '3rem 0', marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
            <div className="container flex flex-col items-center gap-4">
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>© 2026 Movie App. All rights reserved.</p>
                
                <div className="flex gap-4" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
                    <Link to="#" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>About</Link>
                    <span style={{ color: '#555' }}>|</span>
                    <Link to="#" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Kollywood</Link>
                    <span style={{ color: '#555' }}>|</span>
                    <Link to="#" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Directors</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
