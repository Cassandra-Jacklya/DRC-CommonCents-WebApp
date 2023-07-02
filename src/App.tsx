import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Alert from './components/authentication/Alert';
import Footer from './components/homepage/Footer';
import Navbar from './components/navbar/Navbar';

const LazyHomePage = lazy(() => import("./pages/HomePage"));
const LazyTradePage = lazy(() => import("./pages/TradePage"));
const LazyNewsPage = lazy(() => import("./pages/NewsPage"));
const LazyForumPage = lazy(() => import("./pages/ForumPage"));
const LazyAboutPage = lazy(() => import("./pages/AboutPage"));
const LazyLeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));


function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Suspense fallback={<div>Loading..</div>}><LazyHomePage /></Suspense>}></Route>
        <Route path="/trade/:id" element={<Suspense fallback={<div>Loading..</div>}><LazyTradePage /></Suspense>}></Route>
        <Route path="/news" element={<Suspense fallback={<div>Loading..</div>}><LazyNewsPage /></Suspense>}></Route>
        <Route path="/forum" element={<Suspense fallback={<div>Loading..</div>}><LazyForumPage /></Suspense>}></Route>
        <Route path="/about" element={<Suspense fallback={<div>Loading..</div>}><LazyAboutPage /></Suspense>}></Route>
        <Route path="/leaderboard" element={<Suspense fallback={<div>Loading..</div>}><LazyLeaderboardPage /></Suspense>}></Route>
      </Routes>
      <Footer/>
      <Alert/>
    </BrowserRouter>
  );
}

export default App;
