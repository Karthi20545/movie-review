import React from 'react';

const About = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '4rem 2rem', color: 'var(--text-primary)' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center', background: '-webkit-linear-gradient(#fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    About CineRate
                </h1>
                
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '3rem', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                    <h2 style={{ color: '#e50914', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Our Mission</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Welcome to CineRate, your ultimate destination for authentic and insightful movie reviews. We are passionate about storytelling, acting, cinematography, and music. Our mission is to build a vibrant community where cinema lovers can explore, discuss, and celebrate the magic of movies.
                    </p>

                    <h2 style={{ color: '#e50914', marginBottom: '1.5rem', fontSize: '1.8rem' }}>What We Do</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        From legendary classics to contemporary blockbusters, we cover a wide spectrum of Tamil Cinema and beyond. We provide detailed categorizations, actor and director spotlights, and a platform for you to voice your opinions through user reviews.
                    </p>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '3rem' }}>
                        <div style={{ flex: '1 1 200px', backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>10,000+</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Movies Reviewed</p>
                        </div>
                        <div style={{ flex: '1 1 200px', backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>500K+</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Community Members</p>
                        </div>
                        <div style={{ flex: '1 1 200px', backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>24/7</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Cinema Updates</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
