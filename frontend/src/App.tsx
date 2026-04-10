import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import MainPage from "./pages/main/MainPage.tsx";
import FeedbackPage from "./pages/feedback/FeedbackPage.tsx";
import DemoPage from "./pages/demo/DemoPage.tsx";
import StatsPage from "./pages/stats/StatsPage.tsx";
import DemoIndividualPage from "./pages/contract/individual/DemoIndividualPage.tsx";
import DemoLegalPage from "./pages/contract/legal/DemoLegalPage.tsx";
import ContractPage from "./pages/contract/ContractPage.tsx";
import BonusPage from "./pages/bonus/BonusPage.tsx";
import FeedbackTransferPage from "./pages/feedback/transfer/FeedbackTransferPage.tsx";
import FeedbackIdeaPage from "./pages/feedback/idea/FeedbackIdeaPage.tsx";
import SignUpPage from "./pages/auth/SignUpPage.tsx";
import SignInPage from "./pages/auth/SignInPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import home from "./assets/home.svg"

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <header className="header">
                    <img src={home} alt="home"/>
                    <Link to="/" className="goHome">Главная</Link>
                </header>

                <Routes>
                    {/* Публичные маршруты */}
                    <Route path="/" element={<MainPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/signin" element={<SignInPage />} />

                    {/* Защищенные маршруты */}
                    <Route path="/feedback" element={
                        <ProtectedRoute>
                            <FeedbackPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/feedback/transfer" element={
                        <ProtectedRoute>
                            <FeedbackTransferPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/feedback/idea" element={
                        <ProtectedRoute>
                            <FeedbackIdeaPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/stats" element={
                        <ProtectedRoute>
                            <StatsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/demo" element={
                        <ProtectedRoute>
                            <DemoPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/demo/contract" element={
                        <ProtectedRoute>
                            <ContractPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/demo/bonus" element={
                        <ProtectedRoute>
                            <BonusPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/demo/contract/individual" element={
                        <ProtectedRoute>
                            <DemoIndividualPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/demo/contract/legal" element={
                        <ProtectedRoute>
                            <DemoLegalPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;