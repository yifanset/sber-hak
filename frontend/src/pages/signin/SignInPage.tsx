import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classes from './SignInPage.module.css';

const SignInPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Здесь будет логика входа
        console.log('Вход:', formData);
        navigate('/demo');
    };

    return (
        <div className={classes.page}>
            <div className={classes.container}>
                <h1 className={classes.title}>Вход</h1>

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

                    <button type="submit" className={classes.submitButton}>
                        Войти
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