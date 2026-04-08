import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classes from './SignUpPage.module.css';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        login: '',
        password: '',
        city: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Здесь будет логика регистрации
        console.log('Регистрация:', formData);
        navigate('/signin');
    };

    return (
        <div className={classes.page}>
            <div className={classes.container}>
                <h1 className={classes.title}>Регистрация</h1>

                <form className={classes.form} onSubmit={handleSubmit}>
                    <div className={classes.formGroup}>
                        <label htmlFor="name" className={classes.label}>Имя</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={classes.input}
                            placeholder="Введите ваше имя"
                            required
                        />
                    </div>

                    <div className={classes.formGroup}>
                        <label htmlFor="login" className={classes.label}>Логин</label>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            className={classes.input}
                            placeholder="Придумайте логин"
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
                            placeholder="Придумайте пароль"
                            required
                        />
                    </div>

                    <div className={classes.formGroup}>
                        <label htmlFor="city" className={classes.label}>Город</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={classes.input}
                            placeholder="Введите ваш город"
                            required
                        />
                    </div>

                    <button type="submit" className={classes.submitButton}>
                        Зарегистрироваться
                    </button>
                </form>

                <p className={classes.linkText}>
                    Уже есть аккаунт?{' '}
                    <Link to="/signin" className={classes.link}>
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;