import { Property } from '../../types';
import { properties } from '../../data/properties';
import { MARGALLA_PROJECT_PATH } from '../../data/margallaOrchardsContent';
import { siteConfig } from '../../config/siteConfig';
import {
  ASSISTANT_PLOT_SIZES,
  assistantSiteFacts,
  assistantTopicAnswers,
  findFaqAnswer,
  getProjectGuideAction,
  getProjectSectionAction,
  getWhatsAppAction,
} from './assistantKnowledge';
import {
  buildWhatsAppUrl,
  whatsAppMessageForPlot,
  whatsAppMessageForProperty,
} from '../../lib/whatsapp';

export type AssistantAction =
  | { type: 'whatsapp'; label: string; href: string }
  | { type: 'link'; label: string; href: string };

export interface AssistantMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  properties?: Property[];
  quickReplies?: string[];
  actions?: AssistantAction[];
  timestamp: number;
}

export type ConversationStage =
  | 'greeting'
  | 'intent'
  | 'plot_size'
  | 'city'
  | 'bedrooms'
  | 'results'
  | 'open';

export interface ConversationState {
  intent?: 'plot' | 'buy' | 'rent' | 'invest' | 'sell' | 'info';
  plotSize?: string;
  budget?: [number, number];
  city?: string;
  bedrooms?: number;
  stage: ConversationStage;
}

type BotReply = Omit<AssistantMessage, 'id' | 'timestamp'>;

function matchProperties(state: ConversationState): Property[] {
  let results = [...properties];

  if (state.intent === 'buy' || state.intent === 'plot') {
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
  const raw = lower.match(/(\d{7,})/);

  let value: number | null = null;
  if (crore) value = parseFloat(crore[1]) * 10_000_000;
  else if (lakh) value = parseFloat(lakh[1]) * 100_000;
  else if (raw) value = parseFloat(raw[1]);

  if (value === null) {
    if (lower.includes('flexible') || lower.includes('open'))
      return [0, 500_000_000];
    if (lower.includes('1') && lower.includes('3') && lower.includes('crore'))
      return [10_000_000, 35_000_000];
    if (lower.includes('3') && lower.includes('5') && lower.includes('crore'))
      return [30_000_000, 55_000_000];
    if (lower.includes('5') && lower.includes('crore'))
      return [50_000_000, 500_000_000];
    return undefined;
  }

  return [Math.floor(value * 0.7), Math.ceil(value * 1.3)];
}

function wantsWhatsApp(text: string) {
  return (
    text.includes('whatsapp') ||
    text.includes('whats app') ||
    text.includes('wa.me') ||
    text.includes('message you') ||
    text.includes('text you') ||
    text.includes('call you') ||
    text.includes('contact team') ||
    text.includes('human') ||
    text.includes('agent') ||
    text.includes('advisor')
  );
}

function wantsPricing(text: string) {
  return (
    text.includes('price') ||
    text.includes('pricing') ||
    text.includes('rate') ||
    text.includes('rates') ||
    text.includes('cost') ||
    text.includes('how much') ||
    text.includes('pkr') ||
    text.includes('crore') ||
    text.includes('lakh') ||
    text.includes('budget') ||
    text.includes('payment plan') ||
    text.includes('installment')
  );
}

function wantsMargalla(text: string) {
  return (
    text.includes('margalla') ||
    text.includes('orchard') ||
    text.includes('dha') ||
    text.includes('park road') ||
    text.includes('comsats') ||
    text.includes('chak shehzad') ||
    text.includes('chak shahzad')
  );
}

function detectPlotSize(text: string): string | undefined {
  if (text.includes('10 marla') || text.includes('10marla')) return '10 Marla';
  if (text.includes('14 marla') || text.includes('14marla')) return '14 Marla';
  if (text.includes('1 kanal') || text.includes('one kanal')) return '1 Kanal';
  if (text.includes('kanal') && !text.includes('10') && !text.includes('14'))
    return '1 Kanal';
  return undefined;
}

function detectTopic(text: string): string | undefined {
  if (wantsPricing(text)) return 'pricing';
  if (text.includes('noc') || text.includes('legal') || text.includes('cda'))
    return 'noc';
  if (
    text.includes('location') ||
    text.includes('where') ||
    text.includes('map') ||
    text.includes('near')
  )
    return 'location';
  if (text.includes('amenit') || text.includes('security') || text.includes('park'))
    return 'amenities';
  if (text.includes('commercial') || text.includes('walk'))
    return 'commercial';
  if (text.includes('invest')) return 'investment';
  if (
    text.includes('master plan') ||
    text.includes('masterplan') ||
    text.includes('layout') ||
    text.includes('block')
  )
    return 'plots';
  if (
    text.includes('visit') ||
    text.includes('site tour') ||
    text.includes('booking') ||
    text.includes('book')
  )
    return 'visit';
  if (text.includes('contact') || text.includes('office') || text.includes('f-7'))
    return 'contact';
  if (
    text.includes('plot') ||
    text.includes('marla') ||
    text.includes('size')
  )
    return 'plots';
  if (wantsMargalla(text)) return 'overview';
  return undefined;
}

function whatsAppReply(
  text: string,
  message?: string,
  extraActions?: AssistantAction[]
): BotReply[] {
  return [
    {
      sender: 'bot',
      text,
      actions: [
        getWhatsAppAction('Open WhatsApp chat', message),
        ...(extraActions ?? []),
      ],
    },
  ];
}

function topicReply(topic: string, userText: string): BotReply[] | null {
  const faq = findFaqAnswer(userText);
  const body = faq ?? assistantTopicAnswers[topic];
  if (!body) return null;

  const sectionMap: Record<string, string> = {
    overview: 'overview',
    location: 'location',
    noc: 'noc',
    plots: 'plots',
    amenities: 'amenities',
    commercial: 'commercial',
    investment: 'investment',
    pricing: 'pricing',
    visit: 'plots',
    contact: 'overview',
  };

  const section = sectionMap[topic];
  const actions: AssistantAction[] = [
    getWhatsAppAction(
      'Get rates on WhatsApp',
      topic === 'plots' && detectPlotSize(userText.toLowerCase())
        ? whatsAppMessageForPlot(detectPlotSize(userText.toLowerCase()))
        : undefined
    ),
  ];
  if (section) {
    actions.push(getProjectSectionAction(section, 'Read more on website'));
  }

  if (topic === 'pricing') {
    return whatsAppReply(body, undefined, [
      getProjectGuideAction(),
    ]);
  }

  return [
    {
      sender: 'bot',
      text: body,
      actions,
      quickReplies:
        topic === 'plots'
          ? [...ASSISTANT_PLOT_SIZES, 'Chat on WhatsApp']
          : ['Chat on WhatsApp', 'Project guide', 'Site visit'],
    },
  ];
}

export function getInitialGreeting(): AssistantMessage[] {
  return [
    {
      id: '1',
      sender: 'bot',
      text: `Hello! I am the ${siteConfig.siteName} assistant. I can help with DHA Margalla Orchards on Park Road, Islamabad, and our wider listings.`,
      timestamp: Date.now(),
    },
    {
      id: '2',
      sender: 'bot',
      text: `${assistantSiteFacts.whatsappNote} What would you like to know?`,
      quickReplies: [
        'About Margalla Orchards',
        'Plot sizes',
        'Location & NOC',
        'Chat on WhatsApp',
      ],
      actions: [
        getWhatsAppAction(),
        getProjectGuideAction(),
      ],
      timestamp: Date.now() + 1,
    },
  ];
}

export function generateResponse(
  userText: string,
  state: ConversationState
): {
  messages: BotReply[];
  newState: ConversationState;
} {
  const text = userText.toLowerCase().trim();
  const newState = { ...state };
  const responses: BotReply[] = [];

  // Quick-action labels from UI
  if (userText === 'Chat on WhatsApp' || userText === 'Open WhatsApp chat') {
    return {
      messages: whatsAppReply(
        'Tap below to open WhatsApp. Tell us your plot size and budget, and we will reply with availability and a quote.',
        undefined,
        [getProjectGuideAction()]
      ),
      newState: { ...newState, stage: 'open' },
    };
  }

  if (userText === 'Project guide' || userText === 'Open project guide') {
    return {
      messages: [
        {
          sender: 'bot',
          text: 'The full project guide covers NOC, master plan, amenities, plot sizes, and FAQs.',
          actions: [getProjectGuideAction(), getWhatsAppAction()],
        },
      ],
      newState: { ...newState, stage: 'open' },
    };
  }

  if (userText === 'Site visit' || userText === 'Book a site visit') {
    return {
      messages: whatsAppReply(
        'We would love to show you around. Message us on WhatsApp with your preferred day and plot size, and we will confirm a visit.',
        `Hi ${siteConfig.siteName}! I would like to book a site visit at DHA Margalla Orchards. Please share available times.`
      ),
      newState: { ...newState, stage: 'open' },
    };
  }

  if (
    userText === 'About Margalla Orchards' ||
    userText === 'Location & NOC' ||
    userText === 'Plot sizes'
  ) {
    const topic =
      userText === 'Plot sizes'
        ? 'plots'
        : userText === 'Location & NOC'
          ? 'location'
          : 'overview';
    const topicResponses = topicReply(topic, text);
    if (topicResponses) {
      return { messages: topicResponses, newState: { ...newState, stage: 'open' } };
    }
  }

  // Plot size quick picks
  const plotPick = detectPlotSize(text);
  if (plotPick || ASSISTANT_PLOT_SIZES.includes(userText as (typeof ASSISTANT_PLOT_SIZES)[number])) {
    const size = plotPick ?? userText;
    newState.plotSize = size;
    newState.intent = 'plot';
    return {
      messages: whatsAppReply(
        `Great choice: ${size} at Margalla Orchards. Our team will share block-wise availability and today’s quote on WhatsApp.`,
        whatsAppMessageForPlot(size),
        [getProjectSectionAction('plots', 'See sample plots')]
      ),
      newState: { ...newState, stage: 'open' },
    };
  }

  // Global handlers
  if (wantsWhatsApp(text)) {
    return {
      messages: whatsAppReply(
        `You can reach ${siteConfig.siteName} on WhatsApp anytime. We usually reply within a few hours during Islamabad office hours.`,
        undefined,
        [{ type: 'link', label: 'Contact page', href: '/contact' }]
      ),
      newState: { ...newState, stage: 'open' },
    };
  }

  if (wantsPricing(text)) {
    return {
      messages: whatsAppReply(
        assistantSiteFacts.whatsappNote,
        `Hi ${siteConfig.siteName}! Please share current rates and available blocks at DHA Margalla Orchards for my budget.`
      ),
      newState: { ...newState, stage: 'open' },
    };
  }

  const topic = detectTopic(text);
  if (topic) {
    const topicResponses = topicReply(topic, text);
    if (topicResponses) {
      return { messages: topicResponses, newState: { ...newState, stage: 'open' } };
    }
  }

  if (text.includes('vertex') || text.includes('who are you') || text.includes('about you')) {
    return {
      messages: [
        {
          sender: 'bot',
          text: `${siteConfig.siteName} is a real estate team in Islamabad (F-7 Markaz). Our main focus is DHA Margalla Orchards, and we also curate premium listings in other cities.`,
          actions: [getProjectGuideAction(), getWhatsAppAction()],
          quickReplies: ['Plot sizes', 'Chat on WhatsApp', 'Browse listings'],
        },
      ],
      newState: { ...newState, stage: 'open' },
    };
  }

  if (
    text.includes('listing') ||
    text.includes('browse') ||
    text.includes('property') ||
    text.includes('villa') ||
    text.includes('apartment')
  ) {
    return {
      messages: [
        {
          sender: 'bot',
          text: 'You can browse listings on our website. For Margalla Orchards plots, WhatsApp is the fastest way to get rates and availability.',
          actions: [
            { type: 'link', label: 'View listings', href: '/listings' },
            getWhatsAppAction(),
          ],
        },
      ],
      newState: { ...newState, stage: 'open' },
    };
  }

  // Guided flow (legacy, localized)
  if (!newState.intent || newState.stage === 'intent') {
    if (
      text.includes('plot') ||
      text.includes('margalla') ||
      text.includes('orchard') ||
      text.includes('dha') ||
      text.includes('land')
    ) {
      newState.intent = 'plot';
      responses.push({
        sender: 'bot',
        text: 'Happy to help with Margalla Orchards plots. Which size are you interested in?',
        quickReplies: [...ASSISTANT_PLOT_SIZES, 'Not sure yet'],
      });
      newState.stage = 'plot_size';
      return { messages: responses, newState };
    }

    if (
      text.includes('buy') ||
      text.includes('buying') ||
      text.includes('purchase')
    ) {
      newState.intent = 'buy';
    } else if (text.includes('rent') || text.includes('lease')) {
      newState.intent = 'rent';
    } else if (text.includes('invest')) {
      newState.intent = 'invest';
    } else if (text.includes('sell') || text.includes('list my')) {
      newState.intent = 'sell';
    } else if (text.includes('brows') || text.includes('look') || text.includes('just')) {
      responses.push({
        sender: 'bot',
        text: 'Take your time exploring. Ask me about Margalla Orchards, or tap WhatsApp when you are ready for rates.',
        actions: [getProjectGuideAction(), getWhatsAppAction()],
        quickReplies: ['About Margalla Orchards', 'Chat on WhatsApp'],
      });
      newState.stage = 'open';
      return { messages: responses, newState };
    }

    if (newState.intent === 'sell') {
      return {
        messages: whatsAppReply(
          'To list a property with us, message on WhatsApp with location, size, and photos. Our team will guide you through the process.',
          `Hi ${siteConfig.siteName}! I would like to discuss listing my property with you.`
        ),
        newState: { ...newState, stage: 'open' },
      };
    }

    if (newState.intent) {
      const label =
        newState.intent === 'buy'
          ? 'buying'
          : newState.intent === 'rent'
            ? 'renting'
            : 'investing';
      responses.push({
        sender: 'bot',
        text: `Got it, you are ${label}. Which city should we focus on?`,
        quickReplies: ['Islamabad', 'Lahore', 'Karachi', 'Margalla Orchards'],
      });
      newState.stage = 'city';
      return { messages: responses, newState };
    }
  }

  if (newState.stage === 'plot_size') {
    const size = detectPlotSize(text);
    if (size) {
      return generateResponse(size, { ...newState, stage: 'open' });
    }
    return {
      messages: whatsAppReply(
        'No problem. Message us on WhatsApp with your budget and we will suggest the best plot size and block.',
      ),
      newState: { ...newState, stage: 'open' },
    };
  }

  if (newState.stage === 'city') {
    if (text.includes('margalla') || text.includes('orchard') || text.includes('dha')) {
      return generateResponse('margalla orchards', {
        ...newState,
        intent: 'plot',
        stage: 'open',
      });
    }

    const pkCities = ['islamabad', 'lahore', 'karachi', 'rawalpindi'];
    const found = pkCities.find((c) => text.includes(c));
    newState.city = found ? found.replace(/\b\w/g, (c) => c.toUpperCase()) : userText;

    if (newState.intent === 'rent' || newState.intent === 'buy') {
      responses.push({
        sender: 'bot',
        text: `Thanks. For ${newState.city ?? 'your chosen city'}, how many bedrooms do you need?`,
        quickReplies: ['1-2 BR', '3-4 BR', '5+ BR', 'Plot / land only'],
      });
      newState.stage = 'bedrooms';
      return { messages: responses, newState };
    }

    newState.stage = 'bedrooms';
  }

  if (newState.stage === 'bedrooms') {
    if (text.includes('plot') || text.includes('land')) {
      return generateResponse('margalla plot', { ...newState, stage: 'open' });
    }
    if (text.includes('5')) newState.bedrooms = 5;
    else if (text.includes('3') || text.includes('4')) newState.bedrooms = 3;
    else if (text.includes('1') || text.includes('2')) newState.bedrooms = 1;

    const matched = matchProperties(newState);
    responses.push({
      sender: 'bot',
      text: matched.length
        ? `Here are ${matched.length} options that may fit. Open a card for details. For exact rates, use WhatsApp.`
        : 'I could not find a perfect match in our showcase listings, but our team can search wider on WhatsApp.',
      properties: matched.length
        ? matched
        : properties.filter((p) => p.featured).slice(0, 3),
      actions: [getWhatsAppAction('Ask about these on WhatsApp')],
      quickReplies: ['Chat on WhatsApp', 'Refine search', 'Margalla Orchards'],
    });
    newState.stage = 'results';
    return { messages: responses, newState };
  }

  if (newState.stage === 'results' || newState.stage === 'open') {
    if (text.includes('refine') || text.includes('reset') || text.includes('start over')) {
      return {
        messages: [
          {
            sender: 'bot',
            text: 'Sure, let us start fresh. What would you like help with?',
            quickReplies: [
              'About Margalla Orchards',
              'Plot sizes',
              'Chat on WhatsApp',
              'Browse listings',
            ],
            actions: [getWhatsAppAction(), getProjectGuideAction()],
          },
        ],
        newState: { stage: 'intent' },
      };
    }

    if (
      text.includes('book') ||
      text.includes('viewing') ||
      text.includes('visit')
    ) {
      return generateResponse('site visit', { ...newState, stage: 'open' });
    }

    if (text.includes('thank')) {
      responses.push({
        sender: 'bot',
        text: 'You are welcome. Message us on WhatsApp anytime if you need rates or a site visit.',
        actions: [getWhatsAppAction()],
      });
      return { messages: responses, newState };
    }

    if (
      text.includes('hello') ||
      text.includes('hi ') ||
      text === 'hi' ||
      text === 'hey'
    ) {
      return {
        messages: getInitialGreeting().map((m) => ({
          sender: m.sender,
          text: m.text,
          quickReplies: m.quickReplies,
          actions: m.actions,
        })),
        newState: { stage: 'intent' },
      };
    }
  }

  // Default fallback
  return {
    messages: [
      {
        sender: 'bot',
        text: `I can help with Margalla Orchards (plot sizes, location, NOC, amenities) or connect you to our team on WhatsApp for rates. You can also open the project guide at ${MARGALLA_PROJECT_PATH}.`,
        quickReplies: [
          'Plot sizes',
          'Location & NOC',
          'Chat on WhatsApp',
          'Project guide',
        ],
        actions: [getWhatsAppAction(), getProjectGuideAction()],
      },
    ],
    newState: { ...newState, stage: 'open' },
  };
}

/** Exposed for tests / UI that opens WhatsApp directly from assistant context. */
export { buildWhatsAppUrl, whatsAppMessageForPlot, whatsAppMessageForProperty };
