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
        text: { content: "Розминка\nВипади на кожну ногу по 20/4\nПрисідання 30/4\nБолгарські випади з лавки 16/4 на кожну ногу\nПідйом на стілець ,бажано щоб був високий 16/4 на кожну ногу" }
      }]
    }
  },
  // ... add all your training blocks here
];

const getTemplate = (name) => {
  // Return a copy with personalized name
  const children = [
      getTrainingTemplate(name),
      ...getTrainingBlocks()
    ]

  return {
    children,
  }
};