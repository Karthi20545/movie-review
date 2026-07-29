import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { FiSearch, FiUser, FiLogOut, FiMenu, FiMoon, FiSun, FiPlayCircle, FiFilm } from 'react-icons/fi';

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?search=${encodeURIComponent(keyword.trim())}`);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dropdownStyle = {
        position: 'absolute',
        top: '100%',
        left: '0',
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)',
        minWidth: '220px',
        borderRadius: '4px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        display: isMenuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        padding: '0.5rem 0',
        zIndex: 1000,
        marginTop: '10px'
    };

    const dropdownItemStyle = {
        padding: '0.8rem 1.5rem',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.95rem',
        transition: 'background 0.2s',
    };

    return (
        <nav className="navbar" style={{ borderBottom: 'none', padding: '0.8rem 2rem' }}>
            <div className="container nav-content flex items-center justify-between" style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
                
                {/* Left Side: Logo and Menu Dropdown */}
                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" style={{ 
                        backgroundColor: '#f5c518', 
                        color: '#000', 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '4px', 
                        fontWeight: '900', 
                        fontSize: '1.4rem',
                        textDecoration: 'none',
                        letterSpacing: '-0.5px'
                    }}>
                        CineRate
                    </Link>
                    
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{ 
                                color: 'var(--text-primary)', 
                                backgroundColor: 'var(--bg-secondary)', 
                                border: 'none', 
                                cursor: 'pointer', 
                                fontSize: '1rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: '600'
                            }}
                        >
                            <FiMenu size={18} /> Menu <span style={{ fontSize: '0.6rem', marginLeft: '2px' }}>▼</span>
                        </button>
                        
                        {/* Dropdown Content */}
                        <div style={dropdownStyle}>
                            <Link to="/new-releases" style={dropdownItemStyle} onClick={() => setIsMenuOpen(false)}>
                                <FiFilm size={16} color="#666" /> New Releases
                            </Link>
                            <Link to="/kollywood" style={dropdownItemStyle} onClick={() => setIsMenuOpen(false)}>
                                <FiFilm size={16} color="#666" /> Kollywood Movies
                            </Link>
                            <Link to="/actors" style={dropdownItemStyle} onClick={() => setIsMenuOpen(false)}>
                                <FiUser size={16} color="#666" /> Actors
                            </Link>
                            <Link to="/directors" style={dropdownItemStyle} onClick={() => setIsMenuOpen(false)}>
                                <FiUser size={16} color="#666" /> Directors
                            </Link>
                            <Link to="/trailers-reviews" style={dropdownItemStyle} onClick={() => setIsMenuOpen(false)}>
                                <FiPlayCircle size={16} color="#666" /> Trailers & Reviews
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Center: Search Bar */}
                <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '800px', margin: '0 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <input 
                            type="text" 
                            placeholder="Search movies..." 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            style={{ 
                                border: 'none', background: 'transparent', color: 'var(--text-primary)', 
                                padding: '0.6rem 1rem', outline: 'none', width: '100%', fontSize: '0.95rem' 
                            }}
                        />
                        <button type="submit" style={{ background: 'var(--accent-primary)', border: 'none', padding: '0.6rem 1rem', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiSearch size={18} />
                        </button>
                    </div>
                </form>

                {/* Right Side: Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    
                    
                    <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Toggle Theme">
                        {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                    </button>

                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '500' }}>
                                    <FiUser size={18} /> Admin
                                </Link>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '500' }}>
                                    <FiUser size={18} /> {user.name}
                                </span>
                                <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '500', padding: 0 }}>
                                    <FiLogOut size={18} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/admin" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '500' }}>
                                <FiUser size={18} /> Admin
                            </Link>
                            <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '500' }}>
                                <FiUser size={18} /> Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
