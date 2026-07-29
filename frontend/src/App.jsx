import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Pages (to be created)
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/About';
import Actors from './pages/Actors';
import Directors from './pages/Directors';
import NewReleases from './pages/NewReleases';
import KollywoodMovies from './pages/KollywoodMovies';
import TrailersReviews from './pages/TrailersReviews';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/actors" element={<Actors />} />
                <Route path="/directors" element={<Directors />} />
                <Route path="/new-releases" element={<NewReleases />} />
                <Route path="/kollywood" element={<KollywoodMovies />} />
                <Route path="/trailers-reviews" element={<TrailersReviews />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
