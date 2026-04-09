import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classes from './AuthPage.module.css';

const SignInPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                console.log('Вход выполнен:', data);
                navigate('/demo');
            } else {
                setError(data.message || 'Ошибка при входе');
            }
        } catch (err) {
            setError('Не удалось подключиться к серверу');
            console.error('Ошибка:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={classes.page}>
            <div className={classes.container}>
                <h1 className={classes.title}>Вход</h1>

                {error && <div className={classes.error}>{error}</div>}

                <form className={classes.form} onSubmit={handleSubmit}>
                    <div className={classes.formGroup}>
                        <label htmlFor="login" className={classes.label}>Логин</label>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            className={classes.input}
                            placeholder="Введите логин"
                            required
                        />
                    </div>

                    <div className={classes.formGroup}>
                        <label htmlFor="password" className={classes.label}>Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={classes.input}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={classes.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <p className={classes.linkText}>
                    Нет аккаунта?{' '}
                    <Link to="/signup" className={classes.link}>
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignInPage;