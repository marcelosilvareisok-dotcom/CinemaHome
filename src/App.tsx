/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { getPopularMovies, getPopularSeries, getTrending } from './services/tmdb';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/series" element={<Category title="Séries" fetchData={getPopularSeries} mediaType="tv" />} />
          <Route path="/movies" element={<Category title="Filmes" fetchData={getPopularMovies} mediaType="movie" />} />
          <Route path="/trending" element={<Category title="Bombando" fetchData={getTrending} />} />
          <Route path="/my-list" element={<MyList />} />
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
