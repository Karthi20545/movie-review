import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { FiSearch, FiUser, FiLogOut, FiMenu, FiMoon, FiSun, FiPlayCircle, FiFilm, FiX } from 'react-icons/fi';

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            setIsMobileMenuOpen(false);
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
        <nav className="navbar" style={{ borderBottom: 'none', padding: '0.8rem 0' }}>
            <div className="container nav-content flex-col" style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex' }}>
                
                {/* Top Bar for both Mobile and Desktop */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {/* Left Side: Logo and Desktop Dropdown */}
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
                        
                        {/* Desktop Categories Dropdown */}
                        <div ref={dropdownRef} style={{ position: 'relative' }} className="desktop-only">
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
                                <FiMenu size={18} /> Menu <span style={{ fontSize: '0.6rem', marginLeft: '2px' }}>?</span>
                            </button>
                            
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
                    
                    {/* Center: Search Bar (Desktop Only) */}
                    <form onSubmit={handleSearch} className="desktop-only" style={{ flex: 1, maxWidth: '800px', margin: '0 2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden', width: '100%' }}>
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

                    {/* Right Side: Links (Desktop Only) */}
                    <div className="desktop-only" style={{ alignItems: 'center', gap: '1.5rem' }}>
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

                    {/* Mobile Toggle Button */}
                    <div className="mobile-only" style={{ alignItems: 'center', gap: '1rem' }}>
                        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            {theme === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
                        </button>
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                <div className={`mobile-menu-container ${isMobileMenuOpen ? 'open' : ''}`}>
                    <form onSubmit={handleSearch} style={{ width: '100%' }}>
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <Link to="/new-releases" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMobileMenuOpen(false)}>New Releases</Link>
                        <Link to="/kollywood" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMobileMenuOpen(false)}>Kollywood Movies</Link>
                        <Link to="/actors" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMobileMenuOpen(false)}>Actors</Link>
                        <Link to="/directors" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMobileMenuOpen(false)}>Directors</Link>
                        <Link to="/trailers-reviews" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMobileMenuOpen(false)}>Trailers & Reviews</Link>
                        
                        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.5rem 0' }}></div>
                        
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                                )}
                                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Logged in as {user.name}</span>
                                <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontWeight: '500', padding: 0 }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/admin" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
                                <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                            </>
                        )}
                    </div>
                </div>
                
            </div>
        </nav>
    );
};

export default Navbar;
