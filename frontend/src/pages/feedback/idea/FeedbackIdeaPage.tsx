import { useState } from 'react';
import classes from '../Survay.module.css';

interface Question {
    id: number;
    question: string;
    options: string[];
}

const questions: Question[] = [
    {
        id: 1,
        question: 'Насколько вы удовлетворены текущими идеями команды?',
        options: ['Очень доволен', 'Скорее доволен', 'Нейтрально', 'Скорее недоволен', 'Совершенно недоволен']
    },
    {
        id: 2,
        question: 'Как часто вы предлагаете идеи по улучшению продукта?',
        options: ['Регулярно', 'Иногда', 'Редко', 'Никогда', 'Хотел бы, но не знаю как']
    },
    {
        id: 3,
        question: 'Что мотивирует вас делиться идеями с командой?',
        options: ['Признание коллег', 'Бонусы и премии', 'Желание улучшить продукт', 'Возможность роста', 'Не мотивирует ничего']
    },
    {
        id: 4,
        question: 'Насколько легко внедрять новые идеи в текущие процессы?',
        options: ['Очень легко', 'Достаточно легко', 'Есть сложности', 'Очень сложно', 'Практически невозможно']
    },
    {
        id: 5,
        question: 'Хотели бы вы участвовать в специальных сессиях по генерации идей?',
        options: ['Определенно да', 'Скорее да', 'Не уверен', 'Скорее нет', 'Точно нет']
    }
];

const FeedbackIdeaPage = () => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleAnswerSelect = (questionId: number, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        console.log('Ответы по идее команды:', answers);
    };

    const currentQuestion = questions[currentQuestionIndex];
    const isCurrentQuestionAnswered = answers[currentQuestion.id] !== undefined;
    const allQuestionsAnswered = questions.every(q => answers[q.id] !== undefined);
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    if (isSubmitted) {
        return (
            <div className={classes.page}>
                <div className={classes.content}>
                    <div className={classes.successCard}>
                        <div className={classes.successIcon}>💡</div>
                        <h1 className={classes.successTitle}>Спасибо за ваши идеи!</h1>
                        <p className={classes.successMessage}>
                            Ваше мнение поможет нам развиваться
                        </p>
                        <button
                            className={classes.backButton}
                            onClick={() => window.history.back()}
                        >
                            Вернуться назад
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.page}>
            <div className={classes.content}>
                <h1 className={classes.title}>Обратная связь по идее команды</h1>

                {/* Прогресс бар */}
                <div className={classes.progressContainer}>
                    <div className={classes.progressBar}>
                        <div
                            className={classes.progressFill}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className={classes.progressText}>
                        Вопрос {currentQuestionIndex + 1} из {questions.length}
                    </div>
                </div>

                {/* Карточка с вопросом */}
                <div className={classes.questionCard}>
                    <h2 className={classes.question}>{currentQuestion.question}</h2>

                    <div className={classes.options}>
                        {currentQuestion.options.map((option, index) => (
                            <label key={index} className={classes.option}>
                                <input
                                    type="radio"
                                    name={`question-${currentQuestion.id}`}
                                    value={option}
                                    checked={answers[currentQuestion.id] === option}
                                    onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                                    className={classes.radio}
                                />
                                <span className={classes.optionText}>{option}</span>
                            </label>
                        ))}
                    </div>

                    {/* Навигация */}
                    <div className={classes.navigation}>
                        {currentQuestionIndex > 0 && (
                            <button
                                className={classes.navButton}
                                onClick={handlePrevious}
                            >
                                ← Назад
                            </button>
                        )}

                        {currentQuestionIndex < questions.length - 1 ? (
                            <button
                                className={`${classes.navButton} ${classes.nextButton}`}
                                onClick={handleNext}
                                disabled={!isCurrentQuestionAnswered}
                            >
                                Далее →
                            </button>
                        ) : (
                            <button
                                className={`${classes.submitButton}`}
                                onClick={handleSubmit}
                                disabled={!allQuestionsAnswered}
                            >
                                Отправить
                            </button>
                        )}
                    </div>
                </div>

                {/* Индикатор отвеченных вопросов */}
                <div className={classes.questionsIndicator}>
                    {questions.map((q, index) => (
                        <div
                            key={q.id}
                            className={`${classes.indicatorDot} ${
                                answers[q.id] ? classes.answered : ''
                            } ${index === currentQuestionIndex ? classes.active : ''}`}
                            onClick={() => setCurrentQuestionIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeedbackIdeaPage;