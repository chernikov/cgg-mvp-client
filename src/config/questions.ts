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
    { id: 'email', type: 'email' },
    { id: 'nickname', type: 'text' },
    { id: 'age', type: 'number' },
    { id: 'gender', type: 'select' },
    { id: 'country_of_birth', type: 'text' },
    { id: 'current_mood', type: 'textarea' },
    { id: 'hobby', type: 'textarea' },
    { id: 'habits', type: 'textarea' },
    { id: 'top_abilities', type: 'textarea' },
    { id: 'abilities_to_develop', type: 'textarea' },
    { id: 'chosen_profession', type: 'text' },
    { id: 'favorite_character', type: 'textarea' },
    { id: 'antihero', type: 'textarea' },
    { id: 'admired_relative', type: 'textarea' },
    { id: 'not_like_relative', type: 'textarea' },
    { id: 'bonus_characteristics', type: 'textarea' }
  ],
  quest2: [
    { id: 'learning_new_things_ease', type: 'number', min: 1, max: 10 },
    { id: 'preferred_learning_methods', type: 'multiselect' },
    { id: 'quick_school_task_situation', type: 'textarea' },
    { id: 'effort_for_results', type: 'number', min: 1, max: 10 },
    { id: 'overcoming_difficulties_methods', type: 'multiselect' },
    { id: 'difficult_situation_example', type: 'textarea' },
    { id: 'making_new_friends_ease', type: 'number', min: 1, max: 10 },
    { id: 'conflict_behavior', type: 'textarea' },
    { id: 'center_of_attention_situation', type: 'textarea' },
    { id: 'responsibility_level', type: 'number', min: 1, max: 10 },
    { id: 'life_goals', type: 'multiselect' },
    { id: 'important_for_achieving_goals', type: 'textarea' },
    { id: 'active_lifestyle_level', type: 'number', min: 1, max: 10 }
  ],
  quest3: [
    { id: 'physical_fitness_methods', type: 'multiselect' },
    { id: 'feeling_after_activity', type: 'textarea' },
    { id: 'creativity_level', type: 'number', min: 1, max: 10 },
    { id: 'creativity_situations', type: 'multiselect' },
    { id: 'nonstandard_solution_example', type: 'textarea' },
    { id: 'emotional_control_level', type: 'number', min: 1, max: 10 },
    { id: 'negative_emotions_handling_methods', type: 'multiselect' },
    { id: 'emotional_control_example', type: 'textarea' },
    { id: 'question_clarity_level', type: 'number', min: 1, max: 10 },
    { id: 'difficult_questions', type: 'textarea' },
    { id: 'interesting_questions', type: 'textarea' },
    { id: 'survey_improvement_suggestions', type: 'textarea' }
  ]
};

export const teacherSurveyQuestions = [
  {
    id: 'subject',
    type: 'text',
    question: {
      uk: 'Який предмет ви викладаєте?',
      en: 'What subject do you teach?',
      hi: 'आप किस विषय को पढ़ाते हैं?'
    },
    placeholder: {
      uk: 'Наприклад, математика',
      en: 'e.g., Mathematics',
      hi: 'उदाहरण के लिए, गणित'
    }
  },
  {
    id: 'age_groups',
    type: 'text',
    question: {
      uk: 'З якими віковими групами ви працюєте?',
      en: 'Which age groups do you work with?',
      hi: 'आप किस उम्र समूहों के साथ काम करते हैं?'
    },
    placeholder: {
      uk: 'Наприклад, 10-12 років',
      en: 'e.g., 10-12 years old',
      hi: 'उदाहरण के लिए, 10-12 वर्षों के साथ'
    }
  },
  {
    id: 'country',
    type: 'text',
    question: {
      uk: 'Ваша країна',
      en: 'Your country',
      hi: 'आपकी देश'
    },
    placeholder: {
      uk: 'Україна',
      en: 'Ukraine',
      hi: 'युक्रेन'
    }
  },
  {
    id: 'asked_about_careers',
    type: 'radio',
    question: {
      uk: 'Чи запитували вас учні про професії?',
      en: 'Have students asked you about careers?',
      hi: 'क्या छात्रों ने आपसे करियर के बारे में पूछा है?'
    },
    options: {
      uk: ['Так', 'Ні'],
      en: ['Yes', 'No'],
      hi: ['हाँ', 'नहीं']
    }
  },
  {
    id: 'topics_discussed',
    type: 'textarea',
    question: {
      uk: 'Які теми ви обговорювали з учнями щодо професій?',
      en: 'What topics have you discussed with students about careers?',
      hi: 'आपने छात्रों के साथ किस विषयों का चर्चा की है?'
    },
    placeholder: {
      uk: 'Напишіть коротко',
      en: 'Briefly describe',
      hi: 'छोटे वाक्य में वर्णन करें'
    }
  },
  {
    id: 'help_methods',
    type: 'checkbox',
    question: {
      uk: 'Які методи допомоги у виборі професії ви використовуєте?',
      en: 'What methods do you use to help students choose a profession?',
      hi: 'आप किस तरीकों का उपयोग करते हैं छात्रों को करियर चुनने में मदद करने के लिए?'
    },
    options: {
      uk: ['Індивідуальні бесіди', 'Групові заняття', 'Запрошення фахівців', 'Профорієнтаційні тести', 'Інше'],
      en: ['Individual talks', 'Group sessions', 'Inviting professionals', 'Career tests', 'Other'],
      hi: ['व्यक्तिगत बातचीत', 'समूह सत्र', 'पेशेवरों को आमंत्रण', 'करियर परीक्षण', 'अन्य']
    }
  },
  {
    id: 'confidence_level',
    type: 'number',
    question: {
      uk: 'Наскільки ви впевнені у своїх знаннях щодо сучасних професій? (1-10)',
      en: 'How confident are you in your knowledge of modern professions? (1-10)',
      hi: 'आप कितनी आत्मविश्वास हैं आजकल करियर के बारे में ज्ञान के बारे में?'
    },
    placeholder: {
      uk: 'Оцініть від 1 до 10',
      en: 'Rate from 1 to 10',
      hi: '1 से 10 की दर दें'
    },
    min: 1,
    max: 10
  },
  {
    id: 'main_challenges',
    type: 'textarea',
    question: {
      uk: 'Які основні труднощі ви відчуваєте у профорієнтації учнів?',
      en: 'What are the main challenges you face in career guidance for students?',
      hi: 'आप किस मुद्दों का सामना करते हैं छात्रों को करियर गाइडन में मदद करने के लिए?'
    },
    placeholder: {
      uk: 'Опишіть коротко',
      en: 'Briefly describe',
      hi: 'छोटे वाक्य में वर्णन करें'
    }
  },
  {
    id: 'useful_tool',
    type: 'textarea',
    question: {
      uk: 'Який інструмент був би для вас найкориснішим у профорієнтації?',
      en: 'What tool would be most useful for you in career guidance?',
      hi: 'आपके लिए कौन सा उपकरण करियर गाइडन में सबसे उपयोगी होगा?'
    },
    placeholder: {
      uk: 'Опишіть коротко',
      en: 'Briefly describe',
      hi: 'छोटे वाक्य में वर्णन करें'
    }
  },
  {
    id: 'would_use_ai_tool',
    type: 'radio',
    question: {
      uk: 'Чи хотіли б ви використовувати AI-інструмент для профорієнтації?',
      en: 'Would you like to use an AI tool for career guidance?',
      hi: 'क्या आप एआई उपकरण का उपयोग करना चाहते हैं?'
    },
    options: {
      uk: ['Так', 'Ні', 'Можливо'],
      en: ['Yes', 'No', 'Maybe'],
      hi: ['हाँ', 'नहीं', 'शायद']
    }
  },
  {
    id: 'want_results',
    type: 'radio',
    question: {
      uk: 'Чи хочете отримати результати після опитування?',
      en: 'Would you like to receive results after the survey?',
      hi: 'क्या आप सर्वेक्षण के बाद परिणाम प्राप्त करना चाहते हैं?'
    },
    options: {
      uk: ['Так', 'Ні'],
      en: ['Yes', 'No'],
      hi: ['हाँ', 'नहीं']
    }
  },
  {
    id: 'email',
    type: 'email',
    question: {
      uk: 'Вкажіть вашу електронну адресу для отримання результатів',
      en: 'Please provide your email to receive the results',
      hi: 'कृपया आपकी ईमेल पता दें परिणाम प्राप्त करने के लिए'
    },
    placeholder: {
      uk: 'your@email.com',
      en: 'your@email.com',
      hi: 'your@email.com'
    },
    conditional: {
      dependsOn: 'want_results',
      value: {
        uk: 'Так',
        en: 'Yes',
        hi: 'हाँ'
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
      en: "Child's country of birth",
      hi: 'बच्चे का जन्म देश'
    },
    placeholder: {
      uk: 'Україна',
      en: 'Ukraine',
      hi: 'युक्रेन'
    }
  },
  {
    id: 'country_of_residence',
    type: 'text',
    question: {
      uk: 'Країна проживання дитини',
      en: "Child's country of residence",
      hi: 'बच्चे का रहने वाला देश'
    },
    placeholder: {
      uk: 'Україна',
      en: 'Ukraine',
      hi: 'युक्रेन'
    }
  },
  {
    id: 'child_age',
    type: 'number',
    question: {
      uk: 'Вік дитини',
      en: "Child's age",
      hi: 'बच्चे की उम्र'
    },
    placeholder: {
      uk: '12',
      en: '12',
      hi: '12'
    },
    min: 1,
    max: 30
  },
  {
    id: 'want_to_help',
    type: 'radio',
    question: {
      uk: 'Чи хочете ви допомогти дитині з вибором професії?',
      en: 'Do you want to help your child choose a career?',
      hi: 'क्या आप बच्चे को करियर चुनने में मदद करना चाहते हैं?'
    },
    options: {
      uk: ['Так', 'Ні'],
      en: ['Yes', 'No'],
      hi: ['हाँ', 'नहीं']
    }
  },
  {
    id: 'felt_uncertain',
    type: 'radio',
    question: {
      uk: 'Чи відчували ви невпевненість у виборі професії для дитини?',
      en: 'Have you ever felt uncertain about your child\'s career choice?',
      hi: 'क्या आपने बच्चे के करियर चुनने के बारे में उत्सुक हैं?'
    },
    options: {
      uk: ['Так', 'Ні'],
      en: ['Yes', 'No'],
      hi: ['हाँ', 'नहीं']
    }
  },
  {
    id: 'current_help_methods',
    type: 'checkbox',
    question: {
      uk: 'Які методи допомоги ви вже використовували?',
      en: 'What methods have you already used to help?',
      hi: 'आपने पहले किस तरीकों का उपयोग करके मदद की है?'
    },
    options: {
      uk: ['Розмова з дитиною', 'Поради друзів', 'Профорієнтаційні тести', 'Зустрічі з фахівцями', 'Інше'],
      en: ['Talked to child', 'Advice from friends', 'Career tests', 'Meetings with professionals', 'Other'],
      hi: ['बच्चे के साथ बातचीत', 'दोस्तों के सलाह', 'करियर परीक्षण', 'पेशेवरों से मीटिंग', 'अन्य']
    }
  },
  {
    id: 'discuss_frequency',
    type: 'radio',
    question: {
      uk: 'Як часто ви обговорюєте з дитиною питання майбутньої професії?',
      en: 'How often do you discuss career choices with your child?',
      hi: 'आप बच्चे के साथ कितनी बार करियर चुनने के बारे में चर्चा करते हैं?'
    },
    options: {
      uk: ['Часто', 'Іноді', 'Рідко', 'Ніколи'],
      en: ['Often', 'Sometimes', 'Rarely', 'Never'],
      hi: ['बारात', 'कभी-कभी', 'कभी-कभी नहीं', 'कभी नहीं']
    }
  },
  {
    id: 'tried_tools',
    type: 'checkbox',
    question: {
      uk: 'Які інструменти ви пробували для профорієнтації?',
      en: 'What tools have you tried for career guidance?',
      hi: 'आपने किस उपकरणों का प्रयोग करके करियर गाइडन के लिए प्रयास किया है?'
    },
    options: {
      uk: ['Онлайн тести', 'Консультації', 'Книги', 'Вебінари', 'Інше'],
      en: ['Online tests', 'Consultations', 'Books', 'Webinars', 'Other'],
      hi: ['ऑनलाइन परीक्षण', 'सलाह', 'किताबें', 'वेबिनर्स', 'अन्य']
    }
  },
  {
    id: 'tools_satisfaction',
    type: 'radio',
    question: {
      uk: 'Наскільки ви задоволені цими інструментами?',
      en: 'How satisfied are you with these tools?',
      hi: 'आप इन उपकरणों के साथ कितना आनंद लेते हैं?'
    },
    options: {
      uk: ['Дуже задоволений', 'Задоволений', 'Скоріше ні', 'Незадоволений'],
      en: ['Very satisfied', 'Satisfied', 'Rather not', 'Dissatisfied'],
      hi: ['बहुत आनंद लेते हैं', 'आनंद लेते हैं', 'बहुत नहीं', 'अनंत नहीं']
    }
  },
  {
    id: 'ideal_tool',
    type: 'textarea',
    question: {
      uk: 'Яким був би для вас ідеальний інструмент для профорієнтації?',
      en: 'What would be your ideal career guidance tool?',
      hi: 'आपके लिए कौन सा उपकरण करियर गाइडन के लिए आदर्श होगा?'
    },
    placeholder: {
      uk: 'Опишіть коротко',
      en: 'Briefly describe',
      hi: 'छोटे वाक्य में वर्णन करें'
    }
  },
  {
    id: 'would_use_ai_tool',
    type: 'radio',
    question: {
      uk: 'Чи хотіли б ви використовувати AI-інструмент для профорієнтації?',
      en: 'Would you like to use an AI tool for career guidance?',
      hi: 'क्या आप एआई उपकरण का उपयोग करना चाहते हैं?'
    },
    options: {
      uk: ['Так', 'Ні', 'Можливо'],
      en: ['Yes', 'No', 'Maybe'],
      hi: ['हाँ', 'नहीं', 'शायद']
    }
  },
  {
    id: 'ai_tool_requirements',
    type: 'textarea',
    question: {
      uk: 'Які вимоги ви маєте до такого інструменту?',
      en: 'What requirements do you have for such a tool?',
      hi: 'आपके लिए उस उपकरण के लिए क्या आवश्यकताएं हैं?'
    },
    placeholder: {
      uk: 'Опишіть коротко',
      en: 'Briefly describe',
      hi: 'छोटे वाक्य में वर्णन करें'
    }
  },
  {
    id: 'other_comments',
    type: 'textarea',
    question: {
      uk: 'Інші коментарі або побажання',
      en: 'Other comments or wishes',
      hi: 'अन्य टिप्पणियाँ या इच्छाएं'
    },
    placeholder: {
      uk: 'Опишіть коротко',
      en: 'Briefly describe',
      hi: 'छोटे वाक्य में वर्णन करें'
    }
  },
  {
    id: 'want_results',
    type: 'radio',
    question: {
      uk: 'Чи хочете отримати результати після опитування?',
      en: 'Would you like to receive results after the survey?',
      hi: 'क्या आप सर्वेक्षण के बाद परिणाम प्राप्त करना चाहते हैं?'
    },
    options: {
      uk: ['Так', 'Ні'],
      en: ['Yes', 'No'],
      hi: ['हाँ', 'नहीं']
    }
  },
  {
    id: 'email',
    type: 'email',
    question: {
      uk: 'Вкажіть вашу електронну адресу для отримання результатів',
      en: 'Please provide your email to receive the results',
      hi: 'कृपया आपकी ईमेल पता दें परिणाम प्राप्त करने के लिए'
    },
    placeholder: {
      uk: 'your@email.com',
      en: 'your@email.com',
      hi: 'your@email.com'
    },
    conditional: {
      dependsOn: 'want_results',
      value: {
        uk: 'Так',
        en: 'Yes',
        hi: 'हाँ'
      }
    }
  }
]; 