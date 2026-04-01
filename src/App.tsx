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

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
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
