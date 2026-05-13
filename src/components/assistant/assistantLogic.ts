import { Property } from '../../types';
import { properties } from '../../data/properties';

export interface AssistantMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  properties?: Property[];
  quickReplies?: string[];
  timestamp: number;
}

export interface ConversationState {
  intent?: 'buy' | 'rent' | 'invest' | 'sell';
  budget?: [number, number];
  city?: string;
  bedrooms?: number;
  type?: string;
  stage:
  'greeting' |
  'intent' |
  'budget' |
  'city' |
  'bedrooms' |
  'results' |
  'open';
}

function matchProperties(state: ConversationState): Property[] {
  let results = [...properties];

  if (state.intent === 'buy') {
    results = results.filter((p) => p.type === 'buy' || p.type === 'luxury');
  } else if (state.intent === 'rent') {
    results = results.filter((p) => p.type === 'rent');
  } else if (state.intent === 'invest') {
    results = results.filter(
      (p) => p.type === 'luxury' || p.type === 'commercial'
    );
  }

  if (state.budget) {
    results = results.filter(
      (p) => p.price >= state.budget![0] && p.price <= state.budget![1]
    );
  }

  if (state.city) {
    const c = state.city.toLowerCase();
    results = results.filter((p) => p.location.city.toLowerCase().includes(c));
  }

  if (state.bedrooms) {
    results = results.filter((p) => p.bedrooms >= state.bedrooms!);
  }

  return results.slice(0, 3);
}

function parseBudget(text: string): [number, number] | undefined {
  const lower = text.toLowerCase().replace(/,/g, '');
  const crore = lower.match(/(\d+(?:\.\d+)?)\s*(?:crore|cr)\b/);
  const lakh = lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)\b/);
  const millions = lower.match(/(\d+(?:\.\d+)?)\s*m\b/);
  const thousands = lower.match(/(\d+(?:\.\d+)?)\s*k\b/);
  const raw = lower.match(/(\d{5,})/);

  let value: number | null = null;
  if (crore) value = parseFloat(crore[1]) * 10_000_000;
  else if (lakh) value = parseFloat(lakh[1]) * 100_000;
  else if (millions) value = parseFloat(millions[1]) * 1_000_000;
  else if (thousands) value = parseFloat(thousands[1]) * 1_000;
  else if (raw) value = parseFloat(raw[1]);

  if (value === null) {
    if (lower.includes('budget') || lower.includes('flexible'))
      return [0, 500_000_000];
    if (lower.includes('1-5') && lower.includes('crore'))
      return [10_000_000, 50_000_000];
    if (lower.includes('5-10') && lower.includes('crore'))
      return [50_000_000, 100_000_000];
    if (lower.includes('10+') || lower.includes('luxury'))
      return [100_000_000, 500_000_000];
    return undefined;
  }

  return [Math.floor(value * 0.5), Math.ceil(value * 1.5)];
}

export function getInitialGreeting(): AssistantMessage[] {
  return [
  {
    id: '1',
    sender: 'bot',
    text: "Hey — welcome to Vertex Estate. I'm your assistant for premium homes across Karachi, Lahore, Islamabad, and beyond.",
    timestamp: Date.now()
  },
  {
    id: '2',
    sender: 'bot',
    text: 'Tell me if you are buying, renting, or investing — I can shortlist Bahria Town, DHA phases, or capital belt options in seconds.',
    quickReplies: ['Buying', 'Renting', 'Investing', 'Just browsing'],
    timestamp: Date.now() + 1
  }];

}

export function generateResponse(
userText: string,
state: ConversationState)
: {
  messages: Omit<AssistantMessage, 'id' | 'timestamp'>[];
  newState: ConversationState;
} {
  const text = userText.toLowerCase().trim();
  const newState = { ...state };
  const responses: Omit<AssistantMessage, 'id' | 'timestamp'>[] = [];

  // Intent detection
  if (!newState.intent || newState.stage === 'intent') {
    if (
    text.includes('buy') ||
    text.includes('buying') ||
    text.includes('purchase'))
    {
      newState.intent = 'buy';
    } else if (text.includes('rent') || text.includes('lease')) {
      newState.intent = 'rent';
    } else if (text.includes('invest')) {
      newState.intent = 'invest';
    } else if (text.includes('sell')) {
      newState.intent = 'sell';
    } else if (text.includes('brows') || text.includes('look')) {
      responses.push({
        sender: 'bot',
        text: "Perfect — feel free to explore! If you'd like personalized recommendations, just tell me what city you're interested in. ✨"
      });
      newState.stage = 'open';
      return { messages: responses, newState };
    }

    if (newState.intent === 'sell') {
      responses.push({
        sender: 'bot',
        text: 'Great choice to list with us! Our sales team will reach out to you. Meanwhile, what city is your property in?'
      });
      newState.stage = 'city';
      return { messages: responses, newState };
    }

    if (newState.intent) {
      const intentLabel =
      newState.intent === 'buy' ?
      'buy' :
      newState.intent === 'rent' ?
      'rent' :
      'invest in';
      responses.push({
        sender: 'bot',
        text: `Excellent — ${intentLabel}ing is a great move right now. 💎`
      });
      responses.push({
        sender: 'bot',
        text: "What's your approximate budget range?",
        quickReplies:
        newState.intent === 'rent' ?
        ['Under $3K/mo', '$3K-$5K', '$5K-$10K', 'Luxury rentals'] :
        ['Under $1M', '$1M - $5M', '$5M - $10M', '$10M+']
      });
      newState.stage = 'budget';
      return { messages: responses, newState };
    }
  }

  // Budget detection
  if (newState.stage === 'budget') {
    const budget = parseBudget(text);
    if (budget) {
      newState.budget = budget;
      responses.push({
        sender: 'bot',
        text: `Got it — noted your budget. 📝`
      });
      responses.push({
        sender: 'bot',
        text: 'Which city or area interests you most?',
        quickReplies: [
        'New York',
        'Malibu',
        'Beverly Hills',
        'Miami',
        'Any city']

      });
      newState.stage = 'city';
      return { messages: responses, newState };
    } else {
      responses.push({
        sender: 'bot',
        text: "Could you share a rough budget? You can say something like '$2M' or pick a range below.",
        quickReplies: ['Under $1M', '$1M - $5M', '$5M - $10M', '$10M+']
      });
      return { messages: responses, newState };
    }
  }

  // City detection
  if (newState.stage === 'city') {
    const cities = [
    'new york',
    'malibu',
    'beverly hills',
    'miami',
    'san francisco',
    'austin',
    'portland',
    'santa monica'];

    const found = cities.find((c) => text.includes(c));
    if (found) {
      newState.city = found;
    } else if (text.includes('any') || text.includes('open')) {
      newState.city = undefined;
    } else {
      newState.city = userText;
    }

    responses.push({
      sender: 'bot',
      text: newState.city ?
      `Beautiful choice — ${newState.city.replace(/\b\w/g, (c) => c.toUpperCase())} is one of our top markets. 🌆` :
      "Perfect, I'll show you our best across all locations."
    });
    responses.push({
      sender: 'bot',
      text: 'Last question — how many bedrooms ideally?',
      quickReplies: ['1-2 BR', '3-4 BR', '5+ BR', 'No preference']
    });
    newState.stage = 'bedrooms';
    return { messages: responses, newState };
  }

  // Bedrooms
  if (newState.stage === 'bedrooms') {
    if (text.includes('5')) newState.bedrooms = 5;else
    if (text.includes('3') || text.includes('4')) newState.bedrooms = 3;else
    if (text.includes('1') || text.includes('2')) newState.bedrooms = 1;else
    newState.bedrooms = undefined;

    const matched = matchProperties(newState);
    responses.push({
      sender: 'bot',
      text: matched.length ?
      `Excellent — based on your preferences, I've curated ${matched.length} handpicked ${matched.length === 1 ? 'property' : 'properties'} just for you: ✨` :
      "Hmm, I couldn't find an exact match — but here are some premium alternatives worth considering:",
      properties: matched.length ?
      matched :
      properties.filter((p) => p.featured).slice(0, 3)
    });
    responses.push({
      sender: 'bot',
      text: 'Want me to schedule a private viewing or refine the search?',
      quickReplies: ['Book a viewing', 'Refine search', 'Talk to an agent']
    });
    newState.stage = 'results';
    return { messages: responses, newState };
  }

  // Results / open stage
  if (
  text.includes('book') ||
  text.includes('viewing') ||
  text.includes('visit'))
  {
    responses.push({
      sender: 'bot',
      text: "Wonderful! Click 'Book a Visit' on any property card and I'll reserve a slot with our concierge. 🗓️"
    });
  } else if (text.includes('refine') || text.includes('search')) {
    responses.push({
      sender: 'bot',
      text: 'Of course — let me reset. What would you like to adjust: budget, city, or property type?',
      quickReplies: ['Change budget', 'Change city', 'Change type']
    });
    newState.stage = 'budget';
  } else if (
  text.includes('agent') ||
  text.includes('human') ||
  text.includes('person'))
  {
    responses.push({
      sender: 'bot',
      text: "I'll have one of our senior advisors reach out within the hour. Mind sharing your email or preferred contact? 📞"
    });
  } else if (text.includes('thank') || text.includes('thanks')) {
    responses.push({
      sender: 'bot',
      text: "Anytime! I'm always here if you need anything. 🌟"
    });
  } else if (
  text.includes('hello') ||
  text.includes('hi ') ||
  text === 'hi' ||
  text === 'hey')
  {
    responses.push({
      sender: 'bot',
      text: 'Hey there! How can I help you today?',
      quickReplies: ['Find a property', 'Talk to an agent', 'Schedule a tour']
    });
  } else {
    responses.push({
      sender: 'bot',
      text: 'Great question — let me help you with that. Would you like me to find properties matching your needs?',
      quickReplies: [
      'Yes, find properties',
      'Talk to agent',
      'Tell me about Vertex']

    });
  }

  return { messages: responses, newState };
}