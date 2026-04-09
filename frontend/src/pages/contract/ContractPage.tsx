import { useNavigate } from 'react-router-dom';
import classes from './ContractPage.module.css';

const ContractPage = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.page}>
            <div className={classes.content}>
                <h1 className={classes.title}>Зарплатный договор</h1>
                <p className={classes.subtitle}>Оформить как:</p>

                <div className={classes.buttons}>
                    <button
                        className={classes.button}
                        onClick={() => navigate('/demo/contract/legal')}
                    >
                        Юридическое лицо
                    </button>
                    <button
                        className={classes.button}
                        onClick={() => navigate('/demo/contract/individual')}
                    >
                        Физическое лицо
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContractPage;