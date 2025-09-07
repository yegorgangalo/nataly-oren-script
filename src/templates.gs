const getTrainingTemplate = (name) => ({
  object: "block",
  type: "paragraph",
  paragraph: {
    rich_text: [{
      type: "text",
      text: {
        content: `👋 Привіт, ${name} !\n\nЦе твій перший персональний план . Працюй у комфортному темпі. В тебе по плану три тренування на тиждень. Тренуєшся через день (пн,ср,пт або вт,чт,сб).Пиши свої відповіді нижче, я все бачу і слідкую ❤️`
      }
    }]
  }
});

const getTrainingBlocks = () => [
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "Тренування 1" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "Розминка\nВипади на кожну ногу по 20/4\nПрисідання 30/4\nБолгарські випади з лавки 16/4 на кожну ногу\nПідйом на стілець, бажано щоб був високий 16/4 на кожну ногу" }
      }]
    }
  },
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "Тренування 2" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "Розминка\nЖим гантель 16/4\nЖим гантель почергово 20/4\nРозведення рук 16/4\nОпускання на лікті 20/4\nВиведення рук перед собою 30/4\nПрес 40/3" }
      }]
    }
  },
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "Тренування 3" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "Розминка\nЗведення лопаток рівними руками 20/3\nТяга гантель до поясу 20-30/4\nПідйом рук та ніг почергово 30/3\nЗворотні віджимання 16/4\nРозгинання рук на каріматі 16/4\nБіцепс гантелями 20/4" }
      }]
    }
  }
];

const getInstructionsBlocks = () => [
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "🧾 ІНСТРУКЦІЯ ДО ВИКОНАННЯ" }
      }]
    }
  },
  {
    object: "block",
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [{
        type: "text",
        text: { content: "Спочатку робимо розминку." }
      }]
    }
  },
  {
    object: "block",
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [{
        type: "text",
        text: { content: "Потім кожну вправу по черзі (робиш першу вправу 4 підходи і тоді переходиш до іншої)" }
      }]
    }
  },
  {
    object: "block",
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [{
        type: "text",
        text: { content: "Між підходами — відпочинок 1–2 хвилини." }
      }]
    }
  },
  {
    object: "block",
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [{
        type: "text",
        text: { content: "Якщо відчуваєш дискомфорт — зменш темп або вагу." }
      }]
    }
  },
  {
    object: "block",
    type: "quote",
    quote: {
      rich_text: [{
        type: "text",
        text: { content: "💡 Обов'язково знімай відео кожної вправи в 1 підході — щоб я могла перевірити техніку!" }
      }]
    }
  }
];

const getVideoBlocks = () => [
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "📹 ПЕРШЕ ВІДЕО-ТРЕНУВАННЯ" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🎥 1. Розминка" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "➡️ https://youtube.com/shorts/GKwlZeztX3o?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🎥 2. Основне тренування" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "➡️ https://youtube.com/shorts/N1fwLrDmRJM?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/e_TiQAaxiZI?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/r2Vy6kfrSNA?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/C95xTA1Q2fs?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🎥 3. Заминка / Стретчинг" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://drive.google.com/file/d/13t10njg26ITdqEb3rlN1vgEkjZyO_gIM/view?usp=drivesdk" }
      }]
    }
  },
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "📹 ДРУГЕ ВІДЕО-ТРЕНУВАННЯ" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🎥 1. Розминка" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "➡️ https://youtube.com/shorts/GKwlZeztX3o?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🎥 2. Основне тренування" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "➡️ https://youtube.com/shorts/x5AMKjG_xEU?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/sW5FET0jJmo?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/5aG1tdF_0p4?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/gficTJkcbYw?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/eLkKcFfczbU?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/-zWbajXoGPI?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🎥 3. Заминка / Стретчинг" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://drive.google.com/file/d/13t10njg26ITdqEb3rlN1vgEkjZyO_gIM/view?usp=drivesdk" }
      }]
    }
  },
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "📹 ТРЕТЄ ВІДЕО-ТРЕНУВАННЯ" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🎥 1. Розминка" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "➡️ https://youtube.com/shorts/GKwlZeztX3o?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🎥 2. Основне тренування" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "➡️ https://youtube.com/shorts/IY1K1SMr8ZQ?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/-5inocBrtBQ?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/0vJIqjSazlU?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/0k-FSsrxRUY?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/G9pS_eq_T68?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://youtube.com/shorts/qh4e_fu-iXQ?feature=share" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🎥 3. Заминка / Стретчинг" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "https://drive.google.com/file/d/13t10njg26ITdqEb3rlN1vgEkjZyO_gIM/view?usp=drivesdk" }
      }]
    }
  }
];

const getFeedbackBlocks = () => [
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "🎯 ЗАВДАННЯ НА ТИЖДЕНЬ" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🔸 Виконати 3 тренування на тиждень" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🔸 Надіслати відео виконання 1 підходу кожної вправи" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "🔸 Заповнити блок \"Зворотний зв'язок\" нижче" }
      }]
    }
  },
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "✍️ ЗВОРОТНИЙ ЗВ'ЯЗОК (заповни після кожного тренування)" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "❓ Як ти почувалась після тренування?" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "✍️ ..." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "❓ Що було найважче?" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "✍️ ..." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "❓ Яка вправа сподобалась найбільше?" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "✍️ ..." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "❓ Щось боліло/тягнуло після тренування?" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "✍️ ..." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "❓ Загальна оцінка самопочуття (від 1 до 10):" }
      }]
    }
  }
];


const getNutritionBlocks = () => [
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "🌺 ОСНОВНІ ПРАВИЛА" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "1. Сніданок не пізніше 10 години ранку." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "2. Обов'язковий сон 7-8 годин (лягаєш спати не пізніше 00:00)." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "3. Овочі свіжі або печені чи тушені споживаємо без обмежень, крім картоплі, буряка, кукурудзи та моркви." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "4. Овочі та зелень додаєш до кожного прийому, окрім солодких варіантів." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "5. Обов'язкове споживання оливкової або іншої рослиної олії, окрім соняшникової та кукурудзяної. 2 ст. ложки додаєш кожного дня до раціону, а саме до каші та до салатів." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "6. Норма споживання питної води на день 1,5-2л." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "7. Кашу важити у сухому вигляді, а м'ясо, рибу, морепродукти у сирому вигляді." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "8. Їжу можна запікати, варити, на грилі і смажити, але лише на антипригарній сковорідці або на невеликій кількості олії (лише змастити сковорідку)" }
      }]
    }
  },
  {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [{
        type: "text",
        text: { content: "�� РАЦІОН" }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "❤️ Сніданок: омлет із молоком\nДва яйця, трішки молока, помідори.\nШматок цільнозернового хліба з авокадо та скибочкою твердого сиру.\n\nОбід: гречаники\nЗварити гречку, додати курячий або телячий фарш, потерти цибулю й часник, додати спеції за смаком.\nЯ завжди варю 100 г гречки й додаю приблизно 300–400 г фаршу — готую одразу на кілька порцій.\nНа одну порцію — 3–4 гречаники, склянка грецького йогурту, овочі + фрукт на вибір.\n\nВечеря: запечена риба (150–200 г) з печеними овочами." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "❤️ Сніданок: вівсяні оладки\n60 г вівсяних пластівців, половина банана, одне ціле яйце та один білок.\nБанан розім'яти виделкою, додати всі інгредієнти, перемішати.\nСмажити на кокосовій олії або на антипригарній сковороді.\nЗверху можна додати ягоди на свій смак.\nСоус: 50 мл йогурту без цукру + ягоди.\nАбо просто кава з молоком (50 мл молока).\n\nОбід: пісний борщ із квасолею, шматок чорного хліба.\nЯкщо їси сало — можеш додати кілька скибочок. Від нього не поправляються, якщо не переїдати.\n\nВечеря: салат із творогу\n150–200 г творогу (2–5%), 1 ст. л. йогурту, огірок, редис, зелень.\n• один хлібець, можна з авокадо." }
      }]
    }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{
        type: "text",
        text: { content: "❤️ Сніданок: шакшука\nОбсмажити цибулю, додати перець за смаком, трішки томатної пасти, водички.\nТушкувати, потім додати 2 яйця. Готувати, як любиш (з рідким чи твердим жовтком).\nГоловне — небагато олії ��\nДо шакшуки: шматок чорного хліба, 2 скибочки лосося, половина авокадо.\n\nОбід: каша 40 г + стейк із курки або телятини 100–150 г + овочі.\n\nВечеря: 2 запечені гомілки, 2 печені картоплини + салат." }
      }]
    }
  }
];

// Update the main getTemplate function to include nutrition blocks

const getTemplate = (name) => {
  const children = [
    getTrainingTemplate(name),
    ...getTrainingBlocks(),
    ...getInstructionsBlocks(),
    ...getVideoBlocks(),
    ...getFeedbackBlocks(),
    ...getNutritionBlocks()
  ];

  return {
    children,
  }
};
