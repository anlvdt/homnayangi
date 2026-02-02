/**
 * Property-Based Tests for Food Card Picker
 * Using fast-check for property testing
 */

const fc = require('fast-check');
const { FoodDatabase, HistoryManager, CardPicker } = require('./app.js');

// Valid values for generators
const VALID_SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALID_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const VALID_SYMBOLS = ['♥', '♦', '♣', '♠'];

// Custom generators
const suitArb = fc.constantFrom(...VALID_SUITS);
const valueArb = fc.constantFrom(...VALID_VALUES);
const cardArb = fc.record({ suit: suitArb, value: valueArb });

/**
 * Property 5: Food Database Completeness
 * For all 4 suits and 13 values, getFoodByCard(suit, value) SHALL return a valid FoodItem
 * with a unique food name. The total count SHALL be exactly 52.
 * 
 * **Validates: Requirements 2.4, 6.1, 6.2, 6.3, 6.4**
 */
describe('Property 5: Food Database Completeness', () => {
  test('getAllFoods() returns exactly 52 items', () => {
    const allFoods = FoodDatabase.getAllFoods();
    expect(allFoods.length).toBe(52);
  });

  test('all 52 food names are unique', () => {
    const allFoods = FoodDatabase.getAllFoods();
    const foodNames = allFoods.map(f => f.foodName);
    const uniqueNames = new Set(foodNames);
    expect(uniqueNames.size).toBe(52);
  });

  test('each suit has exactly 13 foods', () => {
    for (const suit of VALID_SUITS) {
      expect(FoodDatabase.FOOD_DATA[suit].length).toBe(13);
    }
  });

  // Property test: For any valid suit/value combination, getFoodByCard returns valid FoodItem
  test('for any valid suit and value, getFoodByCard returns complete FoodItem', () => {
    fc.assert(
      fc.property(cardArb, ({ suit, value }) => {
        const food = FoodDatabase.getFoodByCard(suit, value);
        
        // Must have all required fields
        expect(food.cardValue).toBe(value);
        expect(food.suit).toBe(suit);
        expect(VALID_SYMBOLS).toContain(food.suitSymbol);
        expect(['red', 'black']).toContain(food.suitColor);
        expect(typeof food.foodName).toBe('string');
        expect(food.foodName.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  // Verify specific foods per requirements 6.1-6.4
  test('Hearts suit contains correct foods (Req 6.1)', () => {
    const expectedFoods = [
      'Phở', 'Bún bò Huế', 'Bún riêu', 'Hủ tiếu', 'Miến gà',
      'Cháo sườn', 'Bánh canh', 'Bún mọc', 'Bún thang',
      'Mì Quảng', 'Bún cá', 'Bún chả cá', 'Bún mắm'
    ];
    expect(FoodDatabase.FOOD_DATA.hearts).toEqual(expectedFoods);
  });

  test('Diamonds suit contains correct foods (Req 6.2)', () => {
    const expectedFoods = [
      'Cơm tấm', 'Cơm gà', 'Cơm sườn', 'Cơm chiên', 'Cơm bò lúc lắc',
      'Cơm niêu', 'Cơm cá kho', 'Cơm gà xối mỡ', 'Cơm trộn',
      'Cơm chay', 'Cơm cà ri', 'Cơm vịt', 'Cơm thịt kho'
    ];
    expect(FoodDatabase.FOOD_DATA.diamonds).toEqual(expectedFoods);
  });

  test('Clubs suit contains correct foods (Req 6.3)', () => {
    const expectedFoods = [
      'Bánh mì', 'Bánh xèo', 'Bánh cuốn', 'Bánh khọt', 'Bánh căn',
      'Bánh ướt', 'Bánh bèo', 'Bánh đúc', 'Bánh hỏi',
      'Bánh tráng nướng', 'Bánh tráng trộn', 'Bánh bột lọc', 'Bánh bao'
    ];
    expect(FoodDatabase.FOOD_DATA.clubs).toEqual(expectedFoods);
  });

  test('Spades suit contains correct foods (Req 6.4)', () => {
    const expectedFoods = [
      'Bún đậu mắm tôm', 'Bún chả', 'Nem nướng', 'Gỏi cuốn', 'Chả giò',
      'Ốc các loại', 'Lẩu Thái', 'Lẩu bò', 'Lẩu hải sản',
      'BBQ nướng', 'Gà nướng', 'Vịt quay', 'Hải sản'
    ];
    expect(FoodDatabase.FOOD_DATA.spades).toEqual(expectedFoods);
  });
});


/**
 * Property 3: History Save-Retrieve Round Trip
 * For any valid HistoryEntry, after calling saveToHistory(entry), 
 * the entry SHALL appear in getHistory() results.
 * 
 * **Validates: Requirements 5.1**
 */
describe('Property 3: History Save-Retrieve Round Trip', () => {
  beforeEach(() => {
    // Clear history before each test
    HistoryManager.clearHistory();
  });

  // Generator for valid history entries
  const historyEntryArb = fc.record({
    card: fc.record({
      cardValue: fc.constantFrom(...VALID_VALUES),
      suit: fc.constantFrom(...VALID_SUITS),
      suitSymbol: fc.constantFrom(...VALID_SYMBOLS),
      suitColor: fc.constantFrom('red', 'black'),
      foodName: fc.string({ minLength: 1, maxLength: 50 })
    }),
    timestamp: fc.integer({ min: 0, max: Date.now() + 1000000 })
  });

  test('for any valid entry, saveToHistory then getHistory contains that entry', () => {
    fc.assert(
      fc.property(historyEntryArb, (entry) => {
        HistoryManager.clearHistory();
        HistoryManager.saveToHistory(entry);
        const history = HistoryManager.getHistory();
        
        // Entry should be in history
        expect(history.length).toBeGreaterThan(0);
        expect(history[0].card.cardValue).toBe(entry.card.cardValue);
        expect(history[0].card.suit).toBe(entry.card.suit);
        expect(history[0].card.foodName).toBe(entry.card.foodName);
        expect(history[0].timestamp).toBe(entry.timestamp);
      }),
      { numRuns: 100 }
    );
  });

  test('multiple entries are saved in correct order (most recent first)', () => {
    fc.assert(
      fc.property(fc.array(historyEntryArb, { minLength: 2, maxLength: 5 }), (entries) => {
        HistoryManager.clearHistory();
        
        for (const entry of entries) {
          HistoryManager.saveToHistory(entry);
        }
        
        const history = HistoryManager.getHistory();
        expect(history.length).toBe(entries.length);
        
        // Most recent should be first (reverse order of insertion)
        for (let i = 0; i < entries.length; i++) {
          expect(history[i].card.foodName).toBe(entries[entries.length - 1 - i].card.foodName);
        }
      }),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 4: History Limit Enforcement
 * For any number of saved history entries N, getRecentHistory(10) SHALL return 
 * at most 10 entries, and they SHALL be the most recent ones.
 * 
 * **Validates: Requirements 5.2**
 */
describe('Property 4: History Limit Enforcement', () => {
  beforeEach(() => {
    HistoryManager.clearHistory();
  });

  const historyEntryArb = fc.record({
    card: fc.record({
      cardValue: fc.constantFrom(...VALID_VALUES),
      suit: fc.constantFrom(...VALID_SUITS),
      suitSymbol: fc.constantFrom(...VALID_SYMBOLS),
      suitColor: fc.constantFrom('red', 'black'),
      foodName: fc.string({ minLength: 1, maxLength: 50 })
    }),
    timestamp: fc.integer({ min: 0, max: Date.now() + 1000000 })
  });

  test('getRecentHistory(10) returns at most 10 entries regardless of total count', () => {
    fc.assert(
      fc.property(
        fc.array(historyEntryArb, { minLength: 0, maxLength: 25 }),
        (entries) => {
          HistoryManager.clearHistory();
          
          for (const entry of entries) {
            HistoryManager.saveToHistory(entry);
          }
          
          const recent = HistoryManager.getRecentHistory(10);
          
          // Should never exceed 10
          expect(recent.length).toBeLessThanOrEqual(10);
          
          // Should be min(entries.length, 10)
          expect(recent.length).toBe(Math.min(entries.length, 10));
        }
      ),
      { numRuns: 100 }
    );
  });

  test('getRecentHistory returns the most recent entries', () => {
    fc.assert(
      fc.property(
        fc.array(historyEntryArb, { minLength: 11, maxLength: 20 }),
        (entries) => {
          HistoryManager.clearHistory();
          
          for (const entry of entries) {
            HistoryManager.saveToHistory(entry);
          }
          
          const recent = HistoryManager.getRecentHistory(10);
          const allHistory = HistoryManager.getHistory();
          
          // Recent should be first 10 of all history
          expect(recent.length).toBe(10);
          for (let i = 0; i < 10; i++) {
            expect(recent[i].card.foodName).toBe(allHistory[i].card.foodName);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  test('clearHistory removes all entries', () => {
    // Add some entries
    for (let i = 0; i < 5; i++) {
      HistoryManager.saveToHistory({
        card: FoodDatabase.getRandomCard(),
        timestamp: Date.now()
      });
    }
    
    expect(HistoryManager.getHistory().length).toBe(5);
    
    HistoryManager.clearHistory();
    
    expect(HistoryManager.getHistory().length).toBe(0);
    expect(HistoryManager.getRecentHistory(10).length).toBe(0);
  });
});


/**
 * Property 1: Card Data Completeness
 * For any card returned by getRandomCard() or getFoodByCard(), the card SHALL have:
 * - A valid cardValue (one of: "A", "2"-"10", "J", "Q", "K")
 * - A valid suit (one of: "hearts", "diamonds", "clubs", "spades")
 * - A non-empty suitSymbol (one of: "♥", "♦", "♣", "♠")
 * - A non-empty foodName string
 * 
 * **Validates: Requirements 1.1, 1.3, 2.1, 2.2, 2.3**
 */
describe('Property 1: Card Data Completeness', () => {
  test('getRandomCard always returns a complete valid card', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), () => {
        const card = FoodDatabase.getRandomCard();
        
        // Valid cardValue
        expect(VALID_VALUES).toContain(card.cardValue);
        
        // Valid suit
        expect(VALID_SUITS).toContain(card.suit);
        
        // Valid suitSymbol
        expect(VALID_SYMBOLS).toContain(card.suitSymbol);
        
        // Valid suitColor
        expect(['red', 'black']).toContain(card.suitColor);
        
        // Non-empty foodName
        expect(typeof card.foodName).toBe('string');
        expect(card.foodName.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  test('CardPicker.drawCard returns complete card with timestamp', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), () => {
        // Ensure not in drawing state
        CardPicker.setDrawingState(false);
        
        const result = CardPicker.drawCard();
        
        expect(result).not.toBeNull();
        expect(result.card).toBeDefined();
        expect(result.timestamp).toBeDefined();
        expect(typeof result.timestamp).toBe('number');
        
        // Validate card completeness
        expect(VALID_VALUES).toContain(result.card.cardValue);
        expect(VALID_SUITS).toContain(result.card.suit);
        expect(VALID_SYMBOLS).toContain(result.card.suitSymbol);
        expect(result.card.foodName.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 2: Drawing State Prevents Concurrent Draws
 * For any sequence of draw attempts, WHILE isDrawing() returns true, 
 * calling drawCard() SHALL return null.
 * 
 * **Validates: Requirements 4.3**
 */
describe('Property 2: Drawing State Prevents Concurrent Draws', () => {
  afterEach(() => {
    // Reset state after each test
    CardPicker.setDrawingState(false);
  });

  test('when isDrawing is true, drawCard returns null', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 50 }), () => {
        // Set drawing state to true
        CardPicker.setDrawingState(true);
        expect(CardPicker.isDrawing()).toBe(true);
        
        // Attempt to draw should return null
        const result = CardPicker.drawCard();
        expect(result).toBeNull();
        
        // Reset for next iteration
        CardPicker.setDrawingState(false);
      }),
      { numRuns: 100 }
    );
  });

  test('when isDrawing is false, drawCard returns valid result', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 50 }), () => {
        CardPicker.setDrawingState(false);
        expect(CardPicker.isDrawing()).toBe(false);
        
        const result = CardPicker.drawCard();
        expect(result).not.toBeNull();
        expect(result.card).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });

  test('setDrawingState correctly toggles state', () => {
    fc.assert(
      fc.property(fc.boolean(), (state) => {
        CardPicker.setDrawingState(state);
        expect(CardPicker.isDrawing()).toBe(state);
      }),
      { numRuns: 100 }
    );
  });

  test('multiple rapid draw attempts while drawing returns null', () => {
    CardPicker.setDrawingState(true);
    
    // Simulate multiple rapid attempts
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(CardPicker.drawCard());
    }
    
    // All should be null
    expect(results.every(r => r === null)).toBe(true);
    
    CardPicker.setDrawingState(false);
  });
});
