// Simple “database” of recipes
export const RECIPES = [
  {
    id: "avocado-toast",
    title: "Avocado Toast",
    category: "breakfast",
    image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?q=80&w=1170&auto=format&fit=crop",
    alt: "Avocado Toast on wholegrain bread",
    description: "Wholegrain toast topped with smashed avocado, lemon and chili flakes.",
    ingredients: [
      "2 slices wholegrain bread",
      "1 ripe avocado",
      "1 tsp lemon juice",
      "Chili flakes",
      "Salt & pepper"
    ],
    steps: [
      "Toast the bread.",
      "Mash the avocado with lemon, salt and pepper.",
      "Spread on toast and sprinkle chili flakes."
    ],
    nutrition: { calories: 320, carbs: "30 g", protein: "8 g", fat: "18 g" }
  },
  {
    id: "quinoa-salad",
    title: "Quinoa Salad Bowl",
    category: "lunch",
    image: "https://plus.unsplash.com/premium_photo-1705003210245-41b4773b5bb5?q=80&w=1076&auto=format&fit=crop",
    alt: "Colorful quinoa salad bowl",
    description: "Colorful bowl with quinoa, chickpeas, cucumber, tomato and tahini.",
    ingredients: [
      "1 cup cooked quinoa",
      "1/2 cup chickpeas",
      "Cucumber",
      "Tomatoes",
      "2 tbsp tahini",
      "Lemon juice"
    ],
    steps: [
      "Combine quinoa and veggies.",
      "Whisk tahini with lemon and a little water.",
      "Drizzle dressing and toss."
    ],
    nutrition: { calories: 420, carbs: "55 g", protein: "18 g", fat: "12 g" }
  },
  {
    id: "berry-parfait",
    title: "Berry Yogurt Parfait",
    category: "snack",
    image: "https://images.unsplash.com/photo-1723491922263-190acbde53d9?q=80&w=1074&auto=format&fit=crop",
    alt: "Glass filled with yogurt, berries and granola",
    description: "Layers of Greek yogurt, berries and crunchy granola.",
    ingredients: [
      "1 cup Greek yogurt",
      "1/2 cup mixed berries",
      "1/4 cup granola",
      "Honey (optional)"
    ],
    steps: [
      "Layer yogurt, berries, and granola in a glass.",
      "Finish with a drizzle of honey."
    ],
    nutrition: { calories: 260, carbs: "36 g", protein: "16 g", fat: "6 g" }
  },
  {
    id: "veggie-stir-fry",
    title: "Veggie Stir Fry",
    category: "dinner",
    image: "https://mccormick.widen.net/content/d6oqd1m7en/jpeg/stir-fry-vegetables-recipe-1376x774.jpeg",
    alt: "Stir-fried mixed vegetables in a pan",
    description: "Mixed seasonal vegetables quickly sautéed with light soy sauce and garlic.",
    ingredients: [
      "2 cups mixed vegetables (broccoli, carrots, peppers)",
      "2 cloves garlic, minced",
      "1 tbsp olive oil",
      "2 tbsp light soy sauce"
    ],
    steps: [
      "Heat oil in a wok or pan.",
      "Add garlic and vegetables; stir-fry 4–5 minutes.",
      "Add soy sauce and toss to coat. Serve warm."
    ],
    nutrition: { calories: 180, carbs: "20 g", protein: "6 g", fat: "7 g" }
  },
  {
    id: "fruit-smoothie",
    title: "Fruit Smoothie",
    category: "drink", // will count as snacks via matching rule
    image: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?q=80&w=1171&auto=format&fit=crop",
    alt: "Berry and banana smoothie in a glass",
    description: "Refreshing smoothie with banana, berries and yogurt.",
    ingredients: [
      "1 banana",
      "1/2 cup mixed berries",
      "1/2 cup Greek yogurt",
      "1/2 cup milk or almond milk"
    ],
    steps: [
      "Place all ingredients in a blender.",
      "Blend until smooth and creamy.",
      "Pour into a glass and enjoy."
    ],
    nutrition: { calories: 220, carbs: "38 g", protein: "9 g", fat: "3 g" }
  },
  {
    id: "chickpea-curry",
    title: "Chickpea Curry",
    category: "dinner",
    image: "https://images.unsplash.com/photo-1582576163090-09d3b6f8a969?q=80&w=1171&auto=format&fit=crop",
    alt: "Chickpea curry in a bowl",
    description: "Hearty and protein-rich curry with chickpeas and tomatoes.",
    ingredients: [
      "1 can chickpeas, drained",
      "1 cup diced tomatoes",
      "1 onion, chopped",
      "2 cloves garlic, minced",
      "1 tsp curry powder"
    ],
    steps: [
      "Sauté onion and garlic in a little oil until soft.",
      "Add curry powder and cook 1 minute.",
      "Add chickpeas and tomatoes; simmer 15 minutes."
    ],
    nutrition: { calories: 300, carbs: "40 g", protein: "14 g", fat: "6 g" }
  }
];
