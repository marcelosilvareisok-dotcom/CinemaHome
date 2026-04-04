/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Player from './pages/Player';
import Details from './pages/Details';
import Plan from './pages/Plan';
import PlanSuccess from './pages/PlanSuccess';
import Search from './pages/Search';
import Category from './pages/Category';
import MyList from './pages/MyList';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Downloads from './pages/Downloads';
import { getTrending } from './services/tmdb';
import CinematicIntro from './components/CinematicIntro';

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return sessionStorage.getItem('hasSeenIntro') !== 'true';
  });

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem('hasSeenIntro', 'true');
      }, 4000); // 4 seconds total for the animation to play out
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  return (
    <Router>
      <AnimatePresence>
        {showIntro && <CinematicIntro key="intro" />}
      </AnimatePresence>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/series" element={<Series />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/trending" element={<Category title="Bombando" fetchData={getTrending} />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/play/:type/:id" element={<Player />} />
          <Route path="/details/:type/:id" element={<Details />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/plan/success" element={<PlanSuccess />} />
        </Routes>
      </Layout>
    </Router>
  );
}
