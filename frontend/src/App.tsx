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
                    <Route path="/" element={<MainPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="/feedback/transfer" element={<FeedbackTransferPage />} />
                    <Route path="/feedback/idea" element={<FeedbackIdeaPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="/demo/contract" element={<ContractPage />} />
                    <Route path="/demo/bonus" element={<BonusPage />} />
                    <Route path="/demo/contract/individual" element={<DemoIndividualPage />} />
                    <Route path="/demo/contract/legal" element={<DemoLegalPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;