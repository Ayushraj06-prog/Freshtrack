/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DietType, Recipe } from '../types/inventory';

export interface RecipeProvider {
  name: string;
  findRecipesByIngredients(ingredients: string[], diet?: DietType): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe | null>;
}

/**
 * Curated Database of Everyday Indian Household Recipes
 * specifically designed to rescue perishables (dahi, paneer, palak, bread, overripe tomatoes, coriander).
 */
export const INDIAN_RECIPES_DATABASE: Recipe[] = [
  {
    id: 'ind-kadhi-pakora',
    title: 'Punjabi Kadhi Pakora',
    description: 'Tangy yogurt curry tempered with mustard and fenugreek seeds, with crisp gram flour fritters.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 30,
    servings: 4,
    difficulty: 'Medium',
    diet: 'veg',
    cuisine: 'North Indian',
    usedExpiringItems: ['Curd', 'Dahi', 'Yogurt'],
    allIngredients: [
      { name: 'Curd / Dahi', amount: '1 cup (sour is best!)' },
      { name: 'Besan (Gram Flour)', amount: '1/2 cup' },
      { name: 'Onion', amount: '1 medium' },
      { name: 'Mustard Seeds & Methi Seeds', amount: '1 tsp' },
      { name: 'Turmeric & Chilli Powder', amount: '1/2 tsp each' },
      { name: 'Curry Leaves', amount: '1 sprig' },
      { name: 'Oil for frying', amount: '2 tbsp' },
    ],
    instructions: [
      'Whisk sour curd and besan together with 3 cups water and turmeric until lump-free.',
      'Make a quick onion pakora batter with 4 tbsp besan, sliced onions, salt and water; fry spoonfuls until golden.',
      'In a deep pan, temper mustard seeds, methi seeds, curry leaves, and dry red chillies.',
      'Pour in the curd-besan mixture and simmer on low for 15-20 minutes, stirring occasionally.',
      'Add fried pakoras, simmer for 2 minutes, and serve piping hot with steamed rice.',
    ],
    source: 'local',
  },
  {
    id: 'ind-palak-paneer',
    title: 'Dhaba-Style Palak Paneer',
    description: 'Tender cottage cheese cubes simmered in a mildly spiced, vibrant spinach puree.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 25,
    servings: 3,
    difficulty: 'Easy',
    diet: 'veg',
    cuisine: 'North Indian',
    usedExpiringItems: ['Palak', 'Spinach', 'Paneer'],
    allIngredients: [
      { name: 'Palak / Spinach', amount: '1 bunch (250g)' },
      { name: 'Paneer', amount: '200g cubed' },
      { name: 'Tomato', amount: '1 medium' },
      { name: 'Ginger & Garlic Paste', amount: '1 tbsp' },
      { name: 'Green Chillies', amount: '2 slit' },
      { name: 'Garam Masala & Cumin', amount: '1 tsp' },
      { name: 'Butter / Ghee', amount: '1 tbsp' },
    ],
    instructions: [
      'Blanch washed palak leaves in boiling water for 2 minutes, then transfer to cold water to preserve bright green color.',
      'Puree blanched spinach with green chillies into a smooth gravy.',
      'Heat ghee in a pan, add cumin seeds, ginger-garlic paste, and finely chopped tomatoes; cook until soft.',
      'Pour in the spinach puree, add salt and garam masala, and cook on low for 4-5 minutes.',
      'Gently stir in paneer cubes, cook for 2 more minutes, and top with a dab of fresh cream or butter.',
    ],
    source: 'local',
  },
  {
    id: 'ind-aloo-tamatar',
    title: 'Aloo Tamatar Rasedar',
    description: 'Quick homestyle spiced potato and juicy tomato curry. Perfect with hot pooris or rotis.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 20,
    servings: 4,
    difficulty: 'Quick',
    diet: 'veg',
    cuisine: 'North Indian',
    usedExpiringItems: ['Tomato', 'Potato', 'Coriander'],
    allIngredients: [
      { name: 'Potatoes (Aloo)', amount: '3 medium boiled' },
      { name: 'Tomatoes', amount: '3 ripe pureed or chopped' },
      { name: 'Coriander Leaves', amount: '2 tbsp finely chopped' },
      { name: 'Cumin Seeds (Jeera)', amount: '1 tsp' },
      { name: 'Turmeric & Coriander Powder', amount: '1 tsp each' },
      { name: 'Green Chillies', amount: '2 slit' },
      { name: 'Oil / Ghee', amount: '1.5 tbsp' },
    ],
    instructions: [
      'Heat oil or ghee, add cumin seeds and slit green chillies until they sizzle.',
      'Add chopped tomatoes, turmeric, coriander powder, and salt. Cook until tomatoes turn mushy.',
      'Roughly crumble boiled potatoes by hand and add them to the tomato masala.',
      'Add 1.5 cups of water, bring to a boil, and simmer for 6-8 minutes until the gravy thickens slightly.',
      'Garnish generously with fresh green coriander leaves and serve warm.',
    ],
    source: 'local',
  },
  {
    id: 'ind-paneer-bhurji',
    title: 'Amritsari Paneer Bhurji',
    description: 'Scrambled paneer tossed with onions, ripe tomatoes, green chillies, and fragrant spices.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 15,
    servings: 2,
    difficulty: 'Quick',
    diet: 'veg',
    cuisine: 'North Indian',
    usedExpiringItems: ['Paneer', 'Tomato', 'Coriander'],
    allIngredients: [
      { name: 'Paneer', amount: '200g crumbled' },
      { name: 'Onion', amount: '1 large finely chopped' },
      { name: 'Tomato', amount: '2 medium chopped' },
      { name: 'Green Chillies', amount: '2 finely chopped' },
      { name: 'Pav Bhaji Masala or Garam Masala', amount: '1 tsp' },
      { name: 'Butter or Oil', amount: '1.5 tbsp' },
    ],
    instructions: [
      'Melt butter in a pan, saute chopped onions until translucent and light golden.',
      'Add ginger, green chillies, and chopped tomatoes; cook until oil releases.',
      'Mix in salt, turmeric, red chilli powder, and pav bhaji masala.',
      'Toss in the crumbled paneer and mix on medium heat for 2-3 minutes (avoid overcooking).',
      'Finish with fresh dhaniya and lemon juice. Serve with toasted pav or roti.',
    ],
    source: 'local',
  },
  {
    id: 'ind-bread-upma',
    title: 'Spiced Indian Bread Upma',
    description: 'Crisp bread cubes tossed in a fragrant South Indian tempering of mustard seeds, peanuts, and curry leaves.',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 12,
    servings: 2,
    difficulty: 'Quick',
    diet: 'veg',
    cuisine: 'South Indian / Fusion',
    usedExpiringItems: ['Bread', 'Tomato', 'Curry Leaves'],
    allIngredients: [
      { name: 'Bread Slices', amount: '5-6 slices cut into cubes' },
      { name: 'Onion & Tomato', amount: '1 each, finely diced' },
      { name: 'Mustard Seeds & Urad Dal', amount: '1 tsp' },
      { name: 'Peanuts', amount: '2 tbsp roasted' },
      { name: 'Curry Leaves & Green Chillies', amount: '1 sprig & 2 chillies' },
      { name: 'Lemon Juice', amount: '1 tsp' },
    ],
    instructions: [
      'Toast bread cubes in a dry pan or with a drop of ghee for 3 minutes until slightly crisp.',
      'Heat oil in a wok; add mustard seeds, urad dal, peanuts, and curry leaves.',
      'Add onions and green chillies; sauté until soft, then add chopped tomatoes and spices.',
      'Sprinkle 2 tbsp water into the tomato base, then gently fold in the toasted bread cubes.',
      'Cook for 1-2 minutes so bread absorbs the seasoning. Drizzle lemon juice and serve.',
    ],
    source: 'local',
  },
  {
    id: 'ind-egg-bhurji',
    title: 'Mumbai Street-Style Anda Bhurji',
    description: 'Classic roadside scrambled eggs loaded with onions, tomatoes, green chillies, and butter.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 10,
    servings: 2,
    difficulty: 'Quick',
    diet: 'egg',
    cuisine: 'Street Food',
    usedExpiringItems: ['Eggs', 'Tomato', 'Coriander'],
    allIngredients: [
      { name: 'Eggs', amount: '3-4 farm fresh' },
      { name: 'Onion', amount: '1 large finely chopped' },
      { name: 'Tomato', amount: '1 medium chopped' },
      { name: 'Green Chillies & Coriander', amount: 'To taste' },
      { name: 'Turmeric & Pav Bhaji Masala', amount: '1/2 tsp each' },
      { name: 'Butter', amount: '2 tbsp' },
    ],
    instructions: [
      'Melt butter in a pan, sauté onions and green chillies until lightly golden.',
      'Add tomatoes, turmeric, chilli powder, and a dash of pav bhaji masala. Cook for 2 minutes.',
      'Whisk eggs lightly in a bowl and pour directly into the pan.',
      'Stir vigorously on medium flame until eggs are softly scrambled and cooked through.',
      'Garnish with lots of fresh coriander and serve hot with buttered pav.',
    ],
    source: 'local',
  },
  {
    id: 'ind-dal-tadka',
    title: 'Restaurant-Style Dal Tadka',
    description: 'Golden yellow lentils topped with a sizzling aromatic tadka of ghee, garlic, cumin, and hing.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 25,
    servings: 4,
    difficulty: 'Easy',
    diet: 'veg',
    cuisine: 'North Indian',
    usedExpiringItems: ['Tomato', 'Coriander', 'Garlic'],
    allIngredients: [
      { name: 'Toor Dal / Moong Dal', amount: '1 cup boiled' },
      { name: 'Tomato', amount: '2 ripe chopped' },
      { name: 'Garlic', amount: '6 cloves crushed' },
      { name: 'Cumin & Mustard Seeds', amount: '1 tsp' },
      { name: 'Ghee', amount: '2 tbsp' },
      { name: 'Kashmiri Red Chilli & Hing', amount: 'A pinch' },
    ],
    instructions: [
      'Pressure cook dal with turmeric, salt, and water until soft and mashable.',
      'In a pan, cook chopped tomatoes in 1 tbsp ghee with spices until soft; mix cooked dal in.',
      'Prepare the tadka: heat 1 tbsp pure desi ghee in a small ladle.',
      'Add cumin seeds, whole red chillies, crushed garlic, and hing; let garlic turn aromatic golden brown.',
      'Immediately pour the sizzling tadka over the dal, cover for 2 minutes, and top with coriander.',
    ],
    source: 'local',
  },
  {
    id: 'ind-moong-khichdi',
    title: 'Comfort Moong Dal Khichdi',
    description: 'Soothing one-pot wholesome meal of rice and yellow moong lentils tempered with cumin and ghee.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 20,
    servings: 3,
    difficulty: 'Quick',
    diet: 'veg',
    cuisine: 'Homestyle',
    usedExpiringItems: ['Rice', 'Moong Dal', 'Tomato'],
    allIngredients: [
      { name: 'Rice & Yellow Moong Dal', amount: '1/2 cup each' },
      { name: 'Ginger & Green Chilli', amount: '1 inch minced' },
      { name: 'Cumin Seeds & Hing', amount: '1 tsp & pinch' },
      { name: 'Desi Ghee', amount: '2 tbsp' },
      { name: 'Turmeric & Salt', amount: '1/2 tsp & to taste' },
    ],
    instructions: [
      'Wash rice and moong dal together and drain.',
      'In a cooker or instant pot, heat ghee and crackle cumin seeds with hing and ginger.',
      'Add rice, dal, turmeric, salt, and 4 cups of water.',
      'Pressure cook for 3 whistles on medium flame until creamy and well blended.',
      'Serve steaming hot with a spoonful of ghee, curd, and papad.',
    ],
    source: 'local',
  },
  {
    id: 'ind-curd-rice',
    title: 'South Indian Thayir Sadam (Curd Rice)',
    description: 'Cooling tempered curd rice with mustard seeds, curry leaves, and green chillies.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 10,
    servings: 2,
    difficulty: 'Quick',
    diet: 'veg',
    cuisine: 'South Indian',
    usedExpiringItems: ['Curd', 'Dahi', 'Rice'],
    allIngredients: [
      { name: 'Cooked Rice (slightly overcooked)', amount: '1.5 cups' },
      { name: 'Fresh Curd / Dahi', amount: '1 cup' },
      { name: 'Milk', amount: '1/4 cup' },
      { name: 'Mustard Seeds & Urad Dal', amount: '1 tsp' },
      { name: 'Curry Leaves & Ginger', amount: '1 sprig & 1/2 tsp' },
      { name: 'Oil', amount: '1 tsp' },
    ],
    instructions: [
      'Mash soft cooked rice while warm with a fork or back of spoon.',
      'Fold in curd, milk (keeps it creamy without souring), and salt.',
      'In a small tadka pan, heat oil; add mustard seeds, urad dal, ginger, green chilli, and curry leaves.',
      'Pour tempering over the curd rice and mix gently.',
      'Enjoy chilled or room temperature with lemon pickle.',
    ],
    source: 'local',
  },
  {
    id: 'ind-tomato-rasam',
    title: 'Tangy Mysore Tomato Rasam',
    description: 'Clear, peppery and tangy soup made from overripe tomatoes, tamarind, and fresh coriander.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 15,
    servings: 3,
    difficulty: 'Quick',
    diet: 'veg',
    cuisine: 'South Indian',
    usedExpiringItems: ['Tomato', 'Coriander', 'Garlic'],
    allIngredients: [
      { name: 'Overripe Tomatoes', amount: '3 large crushed' },
      { name: 'Crushed Black Pepper & Cumin', amount: '1 tsp each' },
      { name: 'Garlic', amount: '4 cloves crushed' },
      { name: 'Rasam Powder', amount: '1 tsp' },
      { name: 'Coriander Stems & Leaves', amount: 'A generous handful' },
      { name: 'Ghee & Mustard Seeds', amount: '1 tsp' },
    ],
    instructions: [
      'Crush tomatoes by hand with 2 cups water, turmeric, salt, and coriander stems.',
      'Bring to a boil until the raw tomato aroma disappears (about 6 minutes).',
      'Add rasam powder, crushed pepper, cumin, and garlic; simmer for 3 minutes.',
      'Temper with mustard seeds and curry leaves in ghee, pour into rasam, and turn off heat immediately.',
    ],
    source: 'local',
  },
  {
    id: 'ind-jeera-aloo',
    title: 'Chatpata Jeera Aloo',
    description: 'Crisp pan-fried potatoes infused with roasted cumin seeds, amchur, and green chillies.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 12,
    servings: 2,
    difficulty: 'Quick',
    diet: 'veg',
    cuisine: 'North Indian',
    usedExpiringItems: ['Potato', 'Coriander'],
    allIngredients: [
      { name: 'Boiled Potatoes', amount: '3 cubed' },
      { name: 'Jeera (Cumin Seeds)', amount: '1.5 tbsp' },
      { name: 'Green Chillies', amount: '2 slit' },
      { name: 'Amchur (Dry Mango Powder)', amount: '1/2 tsp' },
      { name: 'Fresh Coriander', amount: '2 tbsp' },
      { name: 'Mustard Oil / Ghee', amount: '1.5 tbsp' },
    ],
    instructions: [
      'Heat oil in a pan; add cumin seeds and let them sizzle until deeply aromatic.',
      'Add slit green chillies and potato cubes; toss gently.',
      'Sprinkle turmeric, salt, and amchur. Cook uncovered on medium-high until potato edges turn golden and crisp.',
      'Garnish with coriander and serve as a quick side dish.',
    ],
    source: 'local',
  },
  {
    id: 'ind-besan-chilla',
    title: 'Veggie Besan Chilla (Savory Crepes)',
    description: 'Protein-packed gram flour pancakes loaded with finely chopped tomatoes, onions, and greens.',
    image: 'https://images.unsplash.com/photo-1505253758473-96b46422d3b4?w=600&auto=format&fit=crop&q=80',
    timeMinutes: 15,
    servings: 2,
    difficulty: 'Easy',
    diet: 'veg',
    cuisine: 'North Indian',
    usedExpiringItems: ['Tomato', 'Coriander', 'Spinach'],
    allIngredients: [
      { name: 'Besan (Gram flour)', amount: '1 cup' },
      { name: 'Tomato', amount: '1 finely chopped' },
      { name: 'Onion & Green Chillies', amount: '1 each' },
      { name: 'Palak / Coriander', amount: '1/4 cup chopped' },
      { name: 'Ajwain (Carom seeds)', amount: '1/2 tsp' },
    ],
    instructions: [
      'In a bowl, mix besan, ajwain, salt, turmeric, and 3/4 cup water to make a smooth pouring batter.',
      'Fold in chopped tomatoes, onions, green chillies, and greens.',
      'Pour a ladle of batter onto a hot greased tawa and spread gently in circular motions.',
      'Drizzle a few drops of oil around the edges; flip when golden brown and crisp on both sides.',
    ],
    source: 'local',
  },
];

/**
 * Local Indian Recipe Provider that searches and matches recipes based on expiring items.
 */
export class IndianLocalRecipeProvider implements RecipeProvider {
  name = 'Indian Kitchen Fallback';

  async findRecipesByIngredients(ingredients: string[], dietPreference?: DietType): Promise<Recipe[]> {
    const normalizedInput = ingredients.map((i) => i.toLowerCase().trim());

    const scored = INDIAN_RECIPES_DATABASE.filter((recipe) => {
      // Filter by diet if specified
      if (dietPreference && dietPreference !== 'veg') {
        // non-veg or egg
        if (dietPreference === 'egg' && recipe.diet === 'non-veg') return false;
      } else if (dietPreference === 'veg') {
        if (recipe.diet !== 'veg') return false;
      }
      return true;
    }).map((recipe) => {
      // Check which ingredients match
      const matched: string[] = [];

      for (const input of normalizedInput) {
        // Check usedExpiringItems
        const isExpiringMatch = recipe.usedExpiringItems.some((exp) =>
          input.includes(exp.toLowerCase()) || exp.toLowerCase().includes(input)
        );

        // Check all ingredients
        const isIngMatch = recipe.allIngredients.some((ing) =>
          ing.name.toLowerCase().includes(input) || input.includes(ing.name.toLowerCase())
        );

        if (isExpiringMatch || isIngMatch) {
          matched.push(input);
        }
      }

      return {
        recipe,
        matchCount: matched.length,
        matchedItems: Array.from(new Set(matched)),
      };
    });

    // Sort by number of matched expiring items descending
    scored.sort((a, b) => b.matchCount - a.matchCount);

    return scored.map((s) => ({
      ...s.recipe,
      usedExpiringItems: s.matchedItems.length > 0 ? s.matchedItems : s.recipe.usedExpiringItems,
      allIngredients: s.recipe.allIngredients.map((ing) => ({
        ...ing,
        isExpiringMatch: s.matchedItems.some((m) => ing.name.toLowerCase().includes(m)),
      })),
    }));
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    return INDIAN_RECIPES_DATABASE.find((r) => r.id === id) || null;
  }
}

/**
 * Spoonacular API Recipe Provider
 * Swappable behind the RecipeProvider interface, with local cache to save quota.
 */
export class SpoonacularRecipeProvider implements RecipeProvider {
  name = 'Spoonacular API';
  private apiKey: string;
  private cache: Map<string, Recipe[]> = new Map();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async findRecipesByIngredients(ingredients: string[], dietPreference?: DietType): Promise<Recipe[]> {
    if (!this.apiKey || ingredients.length === 0) {
      return [];
    }

    const cacheKey = `${ingredients.sort().join(',')}_${dietPreference || 'all'}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const ingredientList = encodeURIComponent(ingredients.join(','));
      const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${this.apiKey}&ingredients=${ingredientList}&number=6&ranking=1&ignorePantry=true`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Spoonacular API error: ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) return [];

      const recipes: Recipe[] = data.map((item: any) => ({
        id: `sp-${item.id}`,
        title: item.title,
        description: `Uses ${item.usedIngredientCount} of your kitchen items with ${item.missedIngredientCount} other ingredients.`,
        image: item.image,
        timeMinutes: 25,
        servings: 2,
        difficulty: 'Easy',
        diet: dietPreference || 'veg',
        cuisine: 'International',
        usedExpiringItems: (item.usedIngredients || []).map((ui: any) => ui.name),
        allIngredients: [
          ...(item.usedIngredients || []).map((ui: any) => ({
            name: ui.original || ui.name,
            isExpiringMatch: true,
          })),
          ...(item.missedIngredients || []).map((mi: any) => ({
            name: mi.original || mi.name,
            isExpiringMatch: false,
          })),
        ],
        instructions: ['Follow standard cooking directions for this recipe on Spoonacular.'],
        source: 'spoonacular',
      }));

      this.cache.set(cacheKey, recipes);
      return recipes;
    } catch (e) {
      console.warn('Spoonacular lookup failed or quota hit, returning empty for fallback.', e);
      return [];
    }
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    return null;
  }
}

/**
 * Unified Recipe Service combining Indian Kitchen database + Spoonacular API
 */
export class RecipeService {
  private localProvider = new IndianLocalRecipeProvider();
  private spoonacularProvider: SpoonacularRecipeProvider | null = null;

  constructor(spoonacularApiKey?: string) {
    if (spoonacularApiKey) {
      this.spoonacularProvider = new SpoonacularRecipeProvider(spoonacularApiKey);
    }
  }

  setApiKey(key: string) {
    this.spoonacularProvider = key ? new SpoonacularRecipeProvider(key) : null;
  }

  async getRecipesForExpiringItems(expiringItemNames: string[], dietPreference?: DietType): Promise<Recipe[]> {
    // 1. Fetch Indian local recipes
    const localMatches = await this.localProvider.findRecipesByIngredients(expiringItemNames, dietPreference);

    // 2. If Spoonacular is configured, query it too
    let spoonacularMatches: Recipe[] = [];
    if (this.spoonacularProvider && expiringItemNames.length > 0) {
      spoonacularMatches = await this.spoonacularProvider.findRecipesByIngredients(expiringItemNames, dietPreference);
    }

    // Combine with Indian favorites first
    return [...localMatches, ...spoonacularMatches];
  }
}
