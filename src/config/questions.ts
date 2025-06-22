import { SurveyQuestion } from '@/types/survey'

export const questions: SurveyQuestion[] = [
  {
    id: 'q1',
    text: 'Що вас найбільше цікавить?',
    options: [
      { id: 'a1', text: 'Створення нових речей' },
      { id: 'a2', text: 'Допомога іншим людям' },
      { id: 'a3', text: 'Аналіз та вирішення проблем' },
      { id: 'a4', text: 'Комунікація та презентація' }
    ]
  },
  {
    id: 'q2',
    text: 'Як ви вважаєте, які ваші найсильніші сторони?',
    options: [
      { id: 'a1', text: 'Креативність та уява' },
      { id: 'a2', text: 'Логічне мислення' },
      { id: 'a3', text: 'Емоційний інтелект' },
      { id: 'a4', text: 'Організаційні навички' }
    ]
  },
  {
    id: 'q3',
    text: 'Як ви вважаєте за краще працювати?',
    options: [
      { id: 'a1', text: 'Самостійно' },
      { id: 'a2', text: 'В команді' },
      { id: 'a3', text: 'Гібридний формат' },
      { id: 'a4', text: 'Не маю переваги' }
    ]
  },
  {
    id: 'q4',
    text: 'Який рівень відповідальності вас приваблює?',
    options: [
      { id: 'a1', text: 'Відповідати за власні завдання' },
      { id: 'a2', text: 'Керувати невеликою командою' },
      { id: 'a3', text: 'Керувати великими проектами' },
      { id: 'a4', text: 'Стратегічне планування' }
    ]
  },
  {
    id: 'q5',
    text: 'Як ви ставитесь до змін?',
    options: [
      { id: 'a1', text: 'Люблю експериментувати' },
      { id: 'a2', text: 'Адаптуюсь за потреби' },
      { id: 'a3', text: 'Віддаю перевагу стабільності' },
      { id: 'a4', text: 'Прагну до балансу' }
    ]
  },
  {
    id: 'q6',
    text: 'Що вас мотивує найбільше?',
    options: [
      { id: 'a1', text: 'Творча самореалізація' },
      { id: 'a2', text: 'Фінансова стабільність' },
      { id: 'a3', text: 'Допомога іншим' },
      { id: 'a4', text: 'Професійний розвиток' }
    ]
  },
  {
    id: 'q7',
    text: 'Як ви вважаєте за краще навчатись?',
    options: [
      { id: 'a1', text: 'Практичні завдання' },
      { id: 'a2', text: 'Теоретичні знання' },
      { id: 'a3', text: 'Менторство' },
      { id: 'a4', text: 'Самостійне навчання' }
    ]
  },
  {
    id: 'q8',
    text: 'Який робочий графік вам більше підходить?',
    options: [
      { id: 'a1', text: 'Стандартний 9-5' },
      { id: 'a2', text: 'Гнучкий графік' },
      { id: 'a3', text: 'Проектна робота' },
      { id: 'a4', text: 'Віддалена робота' }
    ]
  },
  {
    id: 'q9',
    text: 'Як ви ставитесь до публічних виступів?',
    options: [
      { id: 'a1', text: 'Люблю виступати' },
      { id: 'a2', text: 'Готовий виступати за потреби' },
      { id: 'a3', text: 'Віддаю перевагу письмовій комунікації' },
      { id: 'a4', text: 'Уникаю публічних виступів' }
    ]
  },
  {
    id: 'q10',
    text: 'Який рівень стресу ви готові приймати?',
    options: [
      { id: 'a1', text: 'Високий (динамічне середовище)' },
      { id: 'a2', text: 'Середній (збалансований)' },
      { id: 'a3', text: 'Низький (стабільне середовище)' },
      { id: 'a4', text: 'Мінімальний (спокійна атмосфера)' }
    ]
  }
]

export const magicalQuestQuestions = {
  quest1: [
    {
      id: 'email',
      question: 'Твоя електронна пошта',
      type: 'email',
      placeholder: 'example@gmail.com'
    },
    {
      id: 'nickname',
      question: 'Твоє ім\'я',
      type: 'text',
      placeholder: 'Олександр'
    },
    {
      id: 'age',
      question: 'Твій вік',
      type: 'number',
      placeholder: '15'
    },
    {
      id: 'gender',
      question: 'Твій стать',
      type: 'select',
      options: ['Хлопець', 'Дівчина', 'Інше']
    },
    {
      id: 'country_of_birth',
      question: 'Країна народження',
      type: 'text',
      placeholder: 'Україна'
    },
    {
      id: 'current_mood',
      question: 'Який у тебе настрій?',
      type: 'textarea',
      placeholder: 'Гарний, бо сьогодні сонячно і я отримав гарну оцінку.'
    },
    {
      id: 'hobby',
      question: 'Твої хобі та інтереси',
      type: 'textarea',
      placeholder: 'Граю на гітарі, люблю футбол.'
    },
    {
      id: 'habits',
      question: 'Твої звички та щоденні ритуали',
      type: 'textarea',
      placeholder: 'Прокидаюсь о 7 ранку, читаю перед сном.'
    },
    {
      id: 'top_abilities',
      question: 'Твої найсильніші сторони',
      type: 'textarea',
      placeholder: 'Командна робота, креативність, вирішення задач'
    },
    {
      id: 'abilities_to_develop',
      question: 'Навички, які хочеш розвинути',
      type: 'textarea',
      placeholder: 'Публічні виступи, тайм-менеджмент, англійська мова'
    },
    {
      id: 'chosen_profession',
      question: 'Професія, яку ти обрав/ла',
      type: 'text',
      placeholder: 'Програміст'
    },
    {
      id: 'favorite_character',
      question: 'Твій улюблений персонаж і чому',
      type: 'textarea',
      placeholder: 'Гаррі Поттер, бо він сміливий і завжди допомагає друзям.'
    },
    {
      id: 'antihero',
      question: 'Персонаж, який тобі не подобається і чому',
      type: 'textarea',
      placeholder: 'Волдеморт, бо він злий і егоїстичний.'
    },
    {
      id: 'admired_relative',
      question: 'Родич, яким ти захоплюєшся і чому',
      type: 'textarea',
      placeholder: 'Мама, бо вона завжди підтримує мене.'
    },
    {
      id: 'not_like_relative',
      question: 'Родич, який тобі не подобається і чому',
      type: 'textarea',
      placeholder: 'Дядько, бо він часто сердиться.'
    },
    {
      id: 'bonus_characteristics',
      question: 'Додаткові характеристики про себе',
      type: 'textarea',
      placeholder: 'Люблю допомагати іншим, цікавлюсь наукою.'
    }
  ],
  quest2: [
    {
      id: 'learning_new_things_ease',
      question: 'Наскільки легко ти вчишся новому? (1-10)',
      type: 'number',
      min: 1,
      max: 10
    },
    {
      id: 'preferred_learning_methods',
      question: 'Які методи навчання тобі подобаються?',
      type: 'multiselect',
      options: ['Візуальний', 'Аудіальний', 'Кінестетичний', 'Читання/Письмо']
    },
    {
      id: 'quick_school_task_situation',
      question: 'Опиши ситуацію, коли ти швидко виконав/ла шкільне завдання',
      type: 'textarea',
      placeholder: 'Я зробив домашнє завдання за 30 хвилин, бо сконцентрувався і вимкнув телефон.'
    },
    {
      id: 'effort_for_results',
      question: 'Наскільки ти готовий/а докладати зусиль для результатів? (1-10)',
      type: 'number',
      min: 1,
      max: 10
    },
    {
      id: 'overcoming_difficulties_methods',
      question: 'Що допомагає тобі подолати труднощі?',
      type: 'multiselect',
      options: ['Родина', 'Друзі', 'Музика', 'Спорт', 'Хобі', 'Інше']
    },
    {
      id: 'difficult_situation_example',
      question: 'Опиши ситуацію, коли ти подолав/ла складність',
      type: 'textarea',
      placeholder: 'Я підготувався до контрольної за одну ніч і отримав гарну оцінку.'
    },
    {
      id: 'making_new_friends_ease',
      question: 'Наскільки легко ти заводиш нових друзів? (1-10)',
      type: 'number',
      min: 1,
      max: 10
    },
    {
      id: 'conflict_behavior',
      question: 'Як ти поводишся в конфліктних ситуаціях?',
      type: 'textarea',
      placeholder: 'Стараюсь говорити спокійно або відійти.'
    },
    {
      id: 'center_of_attention_situation',
      question: 'Опиши ситуацію, коли ти був/ла в центрі уваги',
      type: 'textarea',
      placeholder: 'Виступав на шкільному концерті, було хвилююче, але цікаво.'
    },
    {
      id: 'responsibility_level',
      question: 'Наскільки ти відповідальний/а? (1-10)',
      type: 'number',
      min: 1,
      max: 10
    },
    {
      id: 'life_goals',
      question: 'Твої життєві цілі',
      type: 'multiselect',
      options: ['Успіх', 'Щастя', 'Пригоди', 'Розвиток', 'Сім\'я', 'Кар\'єра']
    },
    {
      id: 'important_for_achieving_goals',
      question: 'Що для тебе важливо для досягнення цілей?',
      type: 'textarea',
      placeholder: 'Підтримка друзів і родини, віра в себе.'
    },
    {
      id: 'active_lifestyle_level',
      question: 'Наскільки активний спосіб життя ти ведеш? (1-10)',
      type: 'number',
      min: 1,
      max: 10
    }
  ],
  quest3: [
    {
      id: 'physical_fitness_methods',
      question: 'Які методи підтримки фізичної форми ти використовуєш?',
      type: 'multiselect',
      options: ['Спорт', 'Сон', 'Дієта', 'Медитація', 'Інше']
    },
    {
      id: 'feeling_after_activity',
      question: 'Як ти себе відчуваєш після активної діяльності?',
      type: 'textarea',
      placeholder: 'Відчуваю енергію і гарний настрій.'
    },
    {
      id: 'creativity_level',
      question: 'Наскільки ти креативний/а? (1-10)',
      type: 'number',
      min: 1,
      max: 10
    },
    {
      id: 'creativity_situations',
      question: 'В яких ситуаціях ти найбільш креативний/а?',
      type: 'multiselect',
      options: ['Наодинці', 'У школі', 'З друзями', 'Під час хобі']
    },
    {
      id: 'nonstandard_solution_example',
      question: 'Опиши ситуацію, коли ти знайшов/ла нестандартне рішення',
      type: 'textarea',
      placeholder: 'Вирішив задачу з математики іншим способом.'
    },
    {
      id: 'emotional_control_level',
      question: 'Наскільки добре ти контролюєш емоції? (1-10)',
      type: 'number',
      min: 1,
      max: 10
    },
    {
      id: 'negative_emotions_handling_methods',
      question: 'Як ти справляєшся з негативними емоціями?',
      type: 'multiselect',
      options: ['Поговорити з кимось', 'Послухати музику', 'Спорт', 'Медитація', 'Інше']
    },
    {
      id: 'emotional_control_example',
      question: 'Опиши ситуацію, коли ти вдало контролював/ла емоції',
      type: 'textarea',
      placeholder: 'Перед виступом на сцені заспокоївся, глибоко дихав.'
    },
    {
      id: 'question_clarity_level',
      question: 'Наскільки зрозумілі для тебе були питання? (1-10)',
      type: 'number',
      min: 1,
      max: 10
    },
    {
      id: 'difficult_questions',
      question: 'Які питання були для тебе складними?',
      type: 'textarea',
      placeholder: 'Питання про конфлікти.'
    },
    {
      id: 'interesting_questions',
      question: 'Які питання були для тебе цікавими?',
      type: 'textarea',
      placeholder: 'Питання про хобі та креативність.'
    },
    {
      id: 'survey_improvement_suggestions',
      question: 'Що б ти додав/ла до опитування?',
      type: 'textarea',
      placeholder: 'Додати більше питань про сучасні професії.'
    }
  ]
};

export const teacherSurveyQuestions = [
  {
    id: 'subject',
    type: 'text',
    question: {
      uk: 'Який предмет ви викладаєте?',
      en: 'What subject do you teach?'
    },
    placeholder: {
      uk: 'Наприклад, математика',
      en: 'e.g., Mathematics'
    }
  },
  {
    id: 'age_groups',
    type: 'text',
    question: {
      uk: 'З якими віковими групами ви працюєте?',
      en: 'Which age groups do you work with?'
    },
    placeholder: {
      uk: 'Наприклад, 10-12 років',
      en: 'e.g., 10-12 years old'
    }
  },
  {
    id: 'country',
    type: 'text',
    question: {
      uk: 'Ваша країна',
      en: 'Your country'
    },
    placeholder: {
      uk: 'Україна',
      en: 'Ukraine'
    }
  },
  {
    id: 'asked_about_careers',
    type: 'radio',
    question: {
      uk: 'Чи запитували вас учні про професії?',
      en: 'Have students asked you about careers?'
    },
    options: {
      uk: ['Так', 'Ні'],
      en: ['Yes', 'No']
    }
  },
  {
    id: 'topics_discussed',
    type: 'textarea',
    question: {
      uk: 'Які теми ви обговорювали з учнями щодо професій?',
      en: 'What topics have you discussed with students about careers?'
    },
    placeholder: {
      uk: 'Напишіть коротко',
      en: 'Briefly describe'
    }
  },
  {
    id: 'help_methods',
    type: 'checkbox',
    question: {
      uk: 'Які методи допомоги у виборі професії ви використовуєте?',
      en: 'What methods do you use to help students choose a profession?'
    },
    options: {
      uk: ['Індивідуальні бесіди', 'Групові заняття', 'Запрошення фахівців', 'Профорієнтаційні тести', 'Інше'],
      en: ['Individual talks', 'Group sessions', 'Inviting professionals', 'Career tests', 'Other']
    }
  },
  {
    id: 'confidence_level',
    type: 'number',
    question: {
      uk: 'Наскільки ви впевнені у своїх знаннях щодо сучасних професій? (1-10)',
      en: 'How confident are you in your knowledge of modern professions? (1-10)'
    },
    placeholder: {
      uk: 'Оцініть від 1 до 10',
      en: 'Rate from 1 to 10'
    },
    min: 1,
    max: 10
  },
  {
    id: 'main_challenges',
    type: 'textarea',
    question: {
      uk: 'Які основні труднощі ви відчуваєте у профорієнтації учнів?',
      en: 'What are the main challenges you face in career guidance for students?'
    },
    placeholder: {
      uk: 'Опишіть коротко',
      en: 'Briefly describe'
    }
  },
  {
    id: 'useful_tool',
    type: 'textarea',
    question: {
      uk: 'Який інструмент був би для вас найкориснішим у профорієнтації?',
      en: 'What tool would be most useful for you in career guidance?'
    },
    placeholder: {
      uk: 'Опишіть коротко',
      en: 'Briefly describe'
    }
  },
  {
    id: 'would_use_ai_tool',
    type: 'radio',
    question: {
      uk: 'Чи хотіли б ви використовувати AI-інструмент для профорієнтації?',
      en: 'Would you like to use an AI tool for career guidance?'
    },
    options: {
      uk: ['Так', 'Ні', 'Можливо'],
      en: ['Yes', 'No', 'Maybe']
    }
  },
  {
    id: 'want_results',
    type: 'radio',
    question: {
      uk: 'Чи хочете отримати результати після опитування?',
      en: 'Would you like to receive results after the survey?'
    },
    options: {
      uk: ['Так', 'Ні'],
      en: ['Yes', 'No']
    }
  },
  {
    id: 'email',
    type: 'email',
    question: {
      uk: 'Вкажіть вашу електронну адресу для отримання результатів',
      en: 'Please provide your email to receive the results'
    },
    placeholder: {
      uk: 'your@email.com',
      en: 'your@email.com'
    },
    conditional: {
      dependsOn: 'want_results',
      value: {
        uk: 'Так',
        en: 'Yes'
      }
    }
  }
];

export const parentSurveyQuestions = [
  {
    id: 'country_of_birth',
    type: 'text',
    question: {
      uk: 'Країна народження дитини',
      en: "Child's country of birth"
    },
    placeholder: {
      uk: 'Україна',
      en: 'Ukraine'
    }
  },
  {
    id: 'country_of_residence',
    type: 'text',
    question: {
      uk: 'Країна проживання дитини',
      en: "Child's country of residence"
    },
    placeholder: {
      uk: 'Україна',
      en: 'Ukraine'
    }
  },
  {
    id: 'child_age',
    type: 'number',
    question: {
      uk: 'Вік дитини',
      en: "Child's age"
    },
    placeholder: {
      uk: '12',
      en: '12'
    },
    min: 1,
    max: 30
  },
  {
    id: 'want_to_help',
    type: 'radio',
    question: {
      uk: 'Чи хочете ви допомогти дитині з вибором професії?',
      en: 'Do you want to help your child choose a career?'
    },
    options: {
      uk: ['Так', 'Ні'],
      en: ['Yes', 'No']
    }
  },
  {
    id: 'felt_uncertain',
    type: 'radio',
    question: {
      uk: 'Чи відчували ви невпевненість у виборі професії для дитини?',
      en: 'Have you ever felt uncertain about your child\'s career choice?'
    },
    options: {
      uk: ['Так', 'Ні'],
      en: ['Yes', 'No']
    }
  },
  {
    id: 'current_help_methods',
    type: 'checkbox',
    question: {
      uk: 'Які методи допомоги ви вже використовували?',
      en: 'What methods have you already used to help?'
    },
    options: {
      uk: ['Розмова з дитиною', 'Поради друзів', 'Профорієнтаційні тести', 'Зустрічі з фахівцями', 'Інше'],
      en: ['Talked to child', 'Advice from friends', 'Career tests', 'Meetings with professionals', 'Other']
    }
  },
  {
    id: 'discuss_frequency',
    type: 'radio',
    question: {
      uk: 'Як часто ви обговорюєте з дитиною питання майбутньої професії?',
      en: 'How often do you discuss career choices with your child?'
    },
    options: {
      uk: ['Часто', 'Іноді', 'Рідко', 'Ніколи'],
      en: ['Often', 'Sometimes', 'Rarely', 'Never']
    }
  },
  {
    id: 'tried_tools',
    type: 'checkbox',
    question: {
      uk: 'Які інструменти ви пробували для профорієнтації?',
      en: 'What tools have you tried for career guidance?'
    },
    options: {
      uk: ['Онлайн тести', 'Консультації', 'Книги', 'Вебінари', 'Інше'],
      en: ['Online tests', 'Consultations', 'Books', 'Webinars', 'Other']
    }
  },
  {
    id: 'tools_satisfaction',
    type: 'radio',
    question: {
      uk: 'Наскільки ви задоволені цими інструментами?',
      en: 'How satisfied are you with these tools?'
    },
    options: {
      uk: ['Дуже задоволений', 'Задоволений', 'Скоріше ні', 'Незадоволений'],
      en: ['Very satisfied', 'Satisfied', 'Rather not', 'Dissatisfied']
    }
  },
  {
    id: 'ideal_tool',
    type: 'textarea',
    question: {
      uk: 'Яким був би для вас ідеальний інструмент для профорієнтації?',
      en: 'What would be your ideal career guidance tool?'
    },
    placeholder: {
      uk: 'Опишіть коротко',
      en: 'Briefly describe'
    }
  },
  {
    id: 'would_use_ai_tool',
    type: 'radio',
    question: {
      uk: 'Чи хотіли б ви використовувати AI-інструмент для профорієнтації?',
      en: 'Would you like to use an AI tool for career guidance?'
    },
    options: {
      uk: ['Так', 'Ні', 'Можливо'],
      en: ['Yes', 'No', 'Maybe']
    }
  },
  {
    id: 'ai_tool_requirements',
    type: 'textarea',
    question: {
      uk: 'Які вимоги ви маєте до такого інструменту?',
      en: 'What requirements do you have for such a tool?'
    },
    placeholder: {
      uk: 'Опишіть коротко',
      en: 'Briefly describe'
    }
  },
  {
    id: 'other_comments',
    type: 'textarea',
    question: {
      uk: 'Інші коментарі або побажання',
      en: 'Other comments or wishes'
    },
    placeholder: {
      uk: 'Опишіть коротко',
      en: 'Briefly describe'
    }
  },
  {
    id: 'want_results',
    type: 'radio',
    question: {
      uk: 'Чи хочете отримати результати після опитування?',
      en: 'Would you like to receive results after the survey?'
    },
    options: {
      uk: ['Так', 'Ні'],
      en: ['Yes', 'No']
    }
  },
  {
    id: 'email',
    type: 'email',
    question: {
      uk: 'Вкажіть вашу електронну адресу для отримання результатів',
      en: 'Please provide your email to receive the results'
    },
    placeholder: {
      uk: 'your@email.com',
      en: 'your@email.com'
    },
    conditional: {
      dependsOn: 'want_results',
      value: {
        uk: 'Так',
        en: 'Yes'
      }
    }
  }
]; 