import React, { useState } from 'react';
import { FiAward, FiFilm, FiUser, FiCalendar, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const mockActors = [
    { 
        id: 91555, name: 'Rajinikanth', category: 'Legends', debut: '1975',
        image: 'https://image.tmdb.org/t/p/original/cQBcrXqcQPfXOQfNfgO3slJM2xi.jpg', 
        knownFor: 'Baasha, Sivaji, Enthiran',
        awards: 'Padma Bhushan, Padma Vibhushan'
    },
    { 
        id: 93193, name: 'Kamal Haasan', category: 'Legends', debut: '1960',
        image: 'https://image.tmdb.org/t/p/original/xqnKeA127YoXfjDPjPKIJF8Kd2C.jpg', 
        knownFor: 'Nayakan, Indian, Vikram',
        awards: '4 National Awards, Padma Shri'
    },
    { 
        id: 91547, name: 'Vijay', category: 'hero', debut: '1992',
        image: 'https://image.tmdb.org/t/p/original/zbQ1sDRVRHkroWwvrnqYKMerl66.jpg', 
        knownFor: 'Ghilli, Thuppakki, Leo',
        awards: '3 Tamil Nadu State Film Awards'
    },
    { 
        id: 148360, name: 'Ajith Kumar', category: 'hero', debut: '1990',
        image: 'https://image.tmdb.org/t/p/original/ak351kpntba09MDiw24jRPgfnWA.jpg', 
        knownFor: 'Mankatha, Billa, Viswasam',
        awards: '3 Filmfare Awards South'
    },
    { 
        id: 85720, name: 'Suriya', category: 'hero', debut: '1997',
        image: 'https://image.tmdb.org/t/p/original/hIFXv3gIjlNS78gJmaguEOxvfPH.jpg', 
        knownFor: 'Ghajini, Singam, Soorarai Pottru',
        awards: 'National Film Award'
    },
    { 
        id: 93191, name: 'Vikram', category: 'hero', debut: '1990',
        image: 'https://image.tmdb.org/t/p/original/o11aBHj4gFkTPgh6zsLHPq67b0b.jpg', 
        knownFor: 'Anniyan, Sethu, Ponniyin Selvan',
        awards: 'National Film Award'
    },
    { 
        id: 550165, name: 'Dhanush', category: 'Contemporary', debut: '2002',
        image: 'https://image.tmdb.org/t/p/original/xnGKntkTDURY5mJ0sOVRI3VIDsY.jpg', 
        knownFor: 'Aadukalam, Asuran, Karnan',
        awards: '2 National Film Awards'
    },
    { 
        id: 1123766, name: 'Vijay Sethupathi', category: 'Contemporary', debut: '2010',
        image: 'https://image.tmdb.org/t/p/original/7fragn88rli7iKZLT3aRubtBxml.jpg', 
        knownFor: '96, Super Deluxe, Vikram',
        awards: 'National Film Award'
    },
    { 
        id: 587982, name: 'Sivakarthikeyan', category: 'Contemporary', debut: '2012',
        image: 'https://image.tmdb.org/t/p/original/jgy9y3V8QqZmu5r8sMxrGCzXuyp.jpg', 
        knownFor: 'Doctor, Don, Maaveeran',
        awards: '4 SIIMA Awards'
    },
    { 
        id: 123066, name: 'Karthi', category: 'Contemporary', debut: '2007',
        image: 'https://image.tmdb.org/t/p/original/npZUMAZBru1wgFefkv5kS3Ezl1z.jpg', 
        knownFor: 'Paruthiveeran, Kaithi, PS-1',
        awards: '3 Filmfare Awards South'
    },
    { 
        id: 91548, name: 'Nayanthara', category: 'heroine', debut: '2003',
        image: 'https://image.tmdb.org/t/p/original/sYUzvjsSsqeOgBblSzda6ZwwbEa.jpg', 
        knownFor: 'Aramm, Naanum Rowdy Dhaan',
        awards: '5 Filmfare Awards South'
    },
    { 
        id: 116925, name: 'Trisha', category: 'heroine', debut: '1999',
        image: 'https://image.tmdb.org/t/p/original/5uBPNIJEhL434D4BhXbCo6SotNw.jpg', 
        knownFor: 'Vinnaithaandi Varuvaayaa, 96, PS-1',
        awards: '5 Filmfare Awards South'
    },
    { 
        id: 225312, name: 'Samantha', category: 'heroine', debut: '2010',
        image: 'https://image.tmdb.org/t/p/original/zYhIHLwCYraQG7tgkvxUsrIg1Do.jpg', 
        knownFor: 'Theri, Mersal, Super Deluxe',
        awards: '4 Filmfare Awards South'
    },
    { 
        id: 1295762, name: 'Keerthy Suresh', category: 'heroine', debut: '2013',
        image: 'https://image.tmdb.org/t/p/original/fTdgSinsAitdujBBEUEA72GY0pv.jpg', 
        knownFor: 'Mahanati, Rajini Murugan, Remo',
        awards: 'National Film Award'
    },
    { 
        id: 88167, name: 'Anushka Shetty', category: 'heroine', debut: '2005',
        image: 'https://image.tmdb.org/t/p/original/zpe6Es8kdNOXuPdXiJvqxzsmN6z.jpg', 
        knownFor: 'Baahubali, Arundhati, Bhaagamathie',
        awards: '3 CineMAA Awards'
    },
    { 
        id: 85721, name: 'Tamannaah', category: 'heroine', debut: '2005',
        image: 'https://image.tmdb.org/t/p/original/t4WYoKiFAyO1Rhjv7O03EKmJHp4.jpg', 
        knownFor: 'Ayan, Baahubali, Paiyaa',
        awards: 'SIIMA Award'
    },
    { 
        id: 147324, name: 'Jyothika', category: 'heroine', debut: '1998',
        image: 'https://image.tmdb.org/t/p/original/n8JVr2ToMbTz3XsJ7uo95J3hgCj.jpg', 
        knownFor: 'Chandramukhi, Mozhi, 36 Vayadhinile',
        awards: '3 Filmfare Awards South'
    },
    { 
        id: 141705, name: 'Simran', category: 'heroine', debut: '1995',
        image: 'https://image.tmdb.org/t/p/original/BRsVC78sFbFy0NQhaUkGkuUUOL.jpg', 
        knownFor: 'Vaali, Kannathil Muthamittal, Petta',
        awards: '3 Filmfare Awards South'
    },
    { 
        id: 3063910, name: 'Sneha', category: 'heroine', debut: '2000',
        image: 'https://image.tmdb.org/t/p/original/9ynw91mnpUAIlHu71W70LiAPZQZ.jpg', 
        knownFor: 'Autograph, Anandham, Pirivom Santhippom',
        awards: '2 Tamil Nadu State Film Awards'
    },
    { 
        id: 81092, name: 'Asin', category: 'heroine', debut: '2001',
        image: 'https://image.tmdb.org/t/p/original/86oUMGp7lPZtKiAUhdoQgM9QtDp.jpg', 
        knownFor: 'Ghajini, Pokkiri, Dasavathaaram',
        awards: '3 Filmfare Awards'
    },
    { 
        id: 85883, name: 'Shruti Haasan', category: 'heroine', debut: '2009',
        image: 'https://image.tmdb.org/t/p/original/1zYJuSccSA45VVBdgozpRcL99Rd.jpg', 
        knownFor: '3, 7aum Arivu, Vedalam',
        awards: '3 Filmfare Awards South'
    },
    { 
        id: 237967, name: 'Hansika Motwani', category: 'heroine', debut: '2007',
        image: 'https://image.tmdb.org/t/p/original/3xCuu8Wwj8TCCtYjVTiXt1nGTtn.jpg', 
        knownFor: 'Oru Kal Oru Kannadi, Engeyum Kadhal',
        awards: 'SIIMA Award'
    },
    { 
        id: 113809, name: 'Kajal Aggarwal', category: 'heroine', debut: '2004',
        image: 'https://image.tmdb.org/t/p/original/hIV5HeHM9xUxhbDdhtM8q56AuXE.jpg', 
        knownFor: 'Thuppakki, Magadheera, Mersal',
        awards: '2 SIIMA Awards'
    },
    { 
        id: 1143308, name: 'Rakul Preet Singh', category: 'heroine', debut: '2009',
        image: 'https://image.tmdb.org/t/p/original/rYCgaWjQJ0IkxN9k47URLca7g1j.jpg', 
        knownFor: 'Theeran Adhigaaram Ondru, Spyder',
        awards: 'SIIMA Award'
    },
    { 
        id: 1114583, name: 'Aishwarya Rajesh', category: 'heroine', debut: '2010',
        image: 'https://image.tmdb.org/t/p/original/9xChl6zSGT9Svx5jghZg1yrW47w.jpg', 
        knownFor: 'Kaaka Muttai, Vada Chennai, Kanaa',
        awards: 'Tamil Nadu State Film Award'
    },
    { 
        id: 1900674, name: 'Priya Bhavani Shankar', category: 'heroine', debut: '2017',
        image: 'https://image.tmdb.org/t/p/original/sX5Ue02f5kzOzVCa0R3dV2yPRmO.jpg', 
        knownFor: 'Meyaadha Maan, Kadaikutty Singam',
        awards: 'SIIMA Award Nomination'
    },
    { 
        id: 222760, name: 'Silambarasan TR', category: 'Contemporary', debut: '2002',
        image: 'https://image.tmdb.org/t/p/original/1T35CiKVldfxElZfQqaoN6GhvuU.jpg', 
        knownFor: 'Vinnaithaandi Varuvaayaa, Maanaadu',
        awards: 'Filmfare Award South'
    },
    { 
        id: 237966, name: 'Jayam Ravi', category: 'Contemporary', debut: '2003',
        image: 'https://image.tmdb.org/t/p/original/wKZNz2kOYPYbSrVDIdHZHtQqHs1.jpg', 
        knownFor: 'Jayam, Thani Oruvan, PS-1',
        awards: '3 SIIMA Awards'
    },
    { 
        id: 550170, name: 'Arya', category: 'Contemporary', debut: '2005',
        image: 'https://image.tmdb.org/t/p/original/bF1321KIKhA199tFfR5L04b90W8.jpg', 
        knownFor: 'Naan Kadavul, Boss Engira Bhaskaran',
        awards: 'Filmfare Award South'
    },
    { 
        id: 86903, name: 'Vishal', category: 'Contemporary', debut: '2004',
        image: 'https://image.tmdb.org/t/p/original/eUf8d7o7yF9mHOnYwYcI940hH5U.jpg', 
        knownFor: 'Sandakozhi, Thupparivaalan',
        awards: 'Tamil Nadu State Film Award'
    }
];

const categories = ['All Stars', 'Legends', 'Contemporary', 'hero', 'heroine'];

const Actors = () => {
    const [activeCategory, setActiveCategory] = useState('All Stars');
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [personDetails, setPersonDetails] = useState(null);
    const [loadingPerson, setLoadingPerson] = useState(false);
    const navigate = useNavigate();

    const filteredActors = activeCategory === 'All Stars' 
        ? mockActors 
        : mockActors.filter(actor => actor.category === activeCategory);

    const handleActorClick = async (actor) => {
        setSelectedPerson(actor);
        setPersonDetails(null);
        setLoadingPerson(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/movies/person/${actor.id}`);
            setPersonDetails(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPerson(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 2rem', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                    <FiUser size={32} color="#e50914" />
                    <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>
                        Talent Directory
                    </h1>
                </div>
                
                {/* Category Pills */}
                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.5rem 1.2rem',
                                borderRadius: '20px',
                                border: activeCategory === cat ? '1px solid #e50914' : '1px solid #444',
                                backgroundColor: activeCategory === cat ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                                color: activeCategory === cat ? '#e50914' : '#aaa',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '0.9rem',
                                fontWeight: activeCategory === cat ? '600' : '400',
                                textTransform: 'capitalize'
                            }}
                            onMouseEnter={(e) => {
                                if(activeCategory !== cat) {
                                    e.currentTarget.style.borderColor = '#888';
                                    e.currentTarget.style.color = '#fff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if(activeCategory !== cat) {
                                    e.currentTarget.style.borderColor = '#444';
                                    e.currentTarget.style.color = '#aaa';
                                }
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Actor Grid - Reduced sizes for professional look */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
                    {filteredActors.map(actor => (
                        <div key={actor.id} style={{ 
                            backgroundColor: 'var(--bg-secondary)', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            border: '1px solid #2a2a2a'
                        }}
                        onClick={() => handleActorClick(actor)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.borderColor = '#444';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = '#2a2a2a';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        >
                            <img 
                                src={actor.image} 
                                alt={actor.name} 
                                style={{ width: '100%', height: '260px', objectFit: 'cover', objectPosition: 'top center' }} 
                            />
                            
                            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.8rem', margin: 0, color: 'var(--text-primary)' }}>
                                    {actor.name}
                                </h3>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ color: '#555' }}>DEBUT:</span> {actor.debut}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <span style={{ color: '#555' }}>KNOWN FOR:</span> {actor.knownFor}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredActors.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#666', padding: '4rem' }}>
                        <p style={{ fontSize: '1.1rem' }}>No profiles found in this category.</p>
                    </div>
                )}
            </div>

            {/* Person Details Modal */}
            {selectedPerson && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '900px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        border: '1px solid var(--border-color)',
                        position: 'relative'
                    }}>
                        <button 
                            onClick={() => setSelectedPerson(null)}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', zIndex: 10 }}
                        >
                            <FiX size={30} />
                        </button>

                        {loadingPerson || !personDetails ? (
                            <div style={{ padding: '5rem', textAlign: 'center' }}>
                                <h2>Loading Profile...</h2>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                                    <img 
                                        src={personDetails.profile_path} 
                                        alt={personDetails.name} 
                                        style={{ width: '250px', height: '375px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }} 
                                    />
                                    <div style={{ flex: '1 1 300px' }}>
                                        <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: '#e50914' }}>{personDetails.name}</h2>
                                        <div style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', gap: '2rem' }}>
                                            <span><strong>Born:</strong> {personDetails.birthday || 'N/A'}</span>
                                            <span><strong>Place of Birth:</strong> {personDetails.place_of_birth || 'N/A'}</span>
                                        </div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Biography</h4>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '10px' }}>
                                            {personDetails.biography || 'Biography not available.'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div style={{ padding: '2rem' }}>
                                    <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', borderLeft: '3px solid #e50914', paddingLeft: '10px' }}>Known For</h3>
                                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                                        {personDetails.movies.map(movie => (
                                            <div 
                                                key={movie.imdbID}
                                                style={{ minWidth: '150px', cursor: 'pointer', transition: 'transform 0.2s' }}
                                                onClick={() => navigate(`/movie/${movie.imdbID}`)}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <img src={movie.Poster} alt={movie.Title} style={{ width: '150px', height: '225px', objectFit: 'cover', borderRadius: '8px' }} />
                                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.Title}</p>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{movie.Year}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Actors;
