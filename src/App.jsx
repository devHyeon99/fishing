import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Main, SignIn } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SignIn />} path="/" />
        <Route element={<Main />} path="/main" />
        <Route element={<SignIn />} path="/sign-in" />
        <Route element={<SignIn />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
