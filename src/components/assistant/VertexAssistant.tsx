import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircleIcon,
  XIcon,
  SendIcon,
  Volume2Icon,
  VolumeXIcon,
  SparklesIcon } from
'lucide-react';
import { TypingIndicator } from './TypingIndicator';
import {
  AssistantMessage,
  ConversationState,
  generateResponse,
  getInitialGreeting } from
'./assistantLogic';
import { useAssistant } from '../../context/AssistantContext';
import { playNotificationSound } from '../../utils/sound';
import { Property } from '../../types';
import { siteConfig } from '../../config/siteConfig';
import { formatPropertyPrice } from '../../lib/formatPropertyPrice';
export function VertexAssistant() {
  const navigate = useNavigate();
  const {
    soundEnabled,
    toggleSound,
    isOpen,
    setIsOpen,
    hasGreeted,
    setHasGreeted
  } = useAssistant();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversationState, setConversationState] = useState<ConversationState>(
    {
      stage: 'greeting'
    }
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isTyping]);
  // Auto greeting on first load
  useEffect(() => {
    if (hasGreeted) return;
    const greetings = getInitialGreeting();
    const timer1 = setTimeout(() => {
      setIsTyping(true);
    }, 1500);
    const timer2 = setTimeout(() => {
      setIsTyping(false);
      setMessages([greetings[0]]);
      if (soundEnabled) playNotificationSound();
      if (!isOpen) setUnreadCount(1);
    }, 2800);
    const timer3 = setTimeout(() => {
      setIsTyping(true);
    }, 3400);
    const timer4 = setTimeout(() => {
      setIsTyping(false);
      setMessages([greetings[0], greetings[1]]);
      if (soundEnabled) playNotificationSound();
      if (!isOpen) setUnreadCount(2);
      setConversationState({
        stage: 'intent'
      });
      setHasGreeted(true);
    }, 4800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);
  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    // Simulate typing and reply
    setTimeout(() => setIsTyping(true), 300);
    const { messages: replies, newState } = generateResponse(
      text,
      conversationState
    );
    setConversationState(newState);
    replies.forEach((reply, idx) => {
      setTimeout(
        () => {
          if (idx === replies.length - 1) setIsTyping(false);else
          setIsTyping(true);
          const msg: AssistantMessage = {
            ...reply,
            id: `b-${Date.now()}-${idx}`,
            timestamp: Date.now() + idx
          };
          setMessages((prev) => [...prev, msg]);
          if (soundEnabled) playNotificationSound();
          if (!isOpen) setUnreadCount((c) => c + 1);
        },
        800 + idx * 1200
      );
    });
    if (replies.length === 0) setIsTyping(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(input);
  };
  const formatPrice = (p: Property) =>
    siteConfig.showPublicPrices
      ? formatPropertyPrice(p)
      : 'Ask on WhatsApp for rates';
  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen &&
        <motion.button
          initial={{
            scale: 0,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          exit={{
            scale: 0,
            opacity: 0
          }}
          whileHover={{
            scale: 1.05
          }}
          whileTap={{
            scale: 0.95
          }}
          onClick={() => setIsOpen(true)}
          className="inset-fab fixed z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 shadow-gold-glow-lg group sm:h-16 sm:w-16"
          aria-label="Open Vertex Assistant">
          
            <motion.div
            animate={{
              rotate: [0, -10, 10, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}>
            
              <MessageCircleIcon className="w-7 h-7 text-navy-900" />
            </motion.div>

            {/* Pulsing ring */}
            <motion.span
            animate={{
              scale: [1, 1.4, 1.4],
              opacity: [0.5, 0, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut'
            }}
            className="absolute inset-0 rounded-full bg-gold-500" />
          

            {unreadCount > 0 &&
          <motion.span
            initial={{
              scale: 0
            }}
            animate={{
              scale: 1
            }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-cream dark:border-navy-900">
            
                {unreadCount}
              </motion.span>
          }
          </motion.button>
        }
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            opacity: 0,
            x: 50,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            x: 50,
            scale: 0.95
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] z-[60] flex max-h-[min(85dvh,600px)] w-auto flex-col overflow-hidden rounded-2xl border border-gold-500/20 bg-white shadow-2xl dark:bg-navy-800 sm:inset-x-auto sm:bottom-6 sm:right-[max(1rem,env(safe-area-inset-right,0px))] sm:h-[600px] sm:max-h-[calc(100dvh-3rem)] sm:w-[min(100vw-1.5rem,400px)] sm:rounded-3xl">
          
            {/* Header */}
            <div className="relative bg-gradient-to-br from-navy-700 to-navy-900 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 text-navy-900" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-navy-800" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base">
                      {siteConfig.siteName} Assistant
                    </h3>
                    <p className="text-xs text-navy-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                      Margalla Orchards, WhatsApp help
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                  onClick={toggleSound}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Toggle sound"
                  title={
                  soundEnabled ?
                  'Mute notifications' :
                  'Unmute notifications'
                  }>
                  
                    {soundEnabled ?
                  <Volume2Icon className="w-4 h-4" /> :

                  <VolumeXIcon className="w-4 h-4 opacity-60" />
                  }
                  </button>
                  <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close chat">
                  
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-3 sm:p-4 bg-cream dark:bg-navy-900">
            
              {messages.map((msg) =>
            <motion.div
              key={msg.id}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              
                  <div className="max-w-[85%] space-y-2">
                    <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-navy-900 rounded-br-sm font-medium' : 'bg-white dark:bg-navy-800 text-navy-900 dark:text-cream rounded-bl-sm shadow-sm border border-navy-100 dark:border-navy-700'}`}>
                  
                      {msg.text}
                    </div>

                    {msg.actions && msg.actions.length > 0 && msg.sender === 'bot' && (
                      <div className="flex flex-wrap gap-2">
                        {msg.actions.map((action) =>
                          action.type === 'whatsapp' ? (
                            <a
                              key={action.label}
                              href={action.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#1ebe5d]"
                            >
                              {action.label}
                            </a>
                          ) : (
                            <button
                              key={action.label}
                              type="button"
                              onClick={() => {
                                navigate(action.href);
                                setIsOpen(false);
                              }}
                              className="inline-flex items-center rounded-full border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-800 transition hover:border-gold-500/50 dark:border-navy-600 dark:bg-navy-900 dark:text-cream"
                            >
                              {action.label}
                            </button>
                          )
                        )}
                      </div>
                    )}

                    {/* Property cards */}
                    {msg.properties && msg.properties.length > 0 &&
                <div className="space-y-2">
                        {msg.properties.map((p) =>
                  <motion.button
                    key={p.id}
                    whileHover={{
                      scale: 1.02
                    }}
                    onClick={() => {
                      navigate(`/property/${p.id}`);
                      setIsOpen(false);
                    }}
                    className="w-full text-left bg-white dark:bg-navy-800 rounded-xl border border-navy-100 dark:border-navy-700 overflow-hidden shadow-sm hover:shadow-gold-glow transition-all">
                    
                            <div className="flex gap-3">
                              <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-20 h-20 object-cover flex-shrink-0" />
                      
                              <div className="flex-1 py-2 pr-3 min-w-0">
                                <p className="font-semibold text-navy-900 dark:text-cream text-xs truncate">
                                  {p.title}
                                </p>
                                <p className="text-[11px] text-navy-500 dark:text-navy-400 truncate">
                                  {p.location.city}, {p.location.state}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-[#128C7E] dark:text-[#5dde8a]">
                                  {formatPrice(p)}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                  )}
                      </div>
                }

                    {/* Quick replies */}
                    {msg.quickReplies && msg.sender === 'bot' &&
                <div className="flex flex-wrap gap-2 mt-2">
                        {msg.quickReplies.map((reply) =>
                  <motion.button
                    key={reply}
                    whileHover={{
                      scale: 1.05
                    }}
                    whileTap={{
                      scale: 0.95
                    }}
                    onClick={() => sendUserMessage(reply)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gold-500 text-gold-600 dark:text-gold-400 hover:bg-gold-500 hover:text-navy-900 transition-colors">
                    
                            {reply}
                          </motion.button>
                  )}
                      </div>
                }
                  </div>
                </motion.div>
            )}

              {isTyping &&
            <motion.div
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="flex justify-start">
              
                  <TypingIndicator />
                </motion.div>
            }
            </div>

            {/* Input */}
            <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-navy-100 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] dark:border-navy-700 dark:bg-navy-800 sm:pb-3">
            
              <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Margalla Orchards or plots…"
              className="flex-1 px-4 py-2.5 bg-cream dark:bg-navy-900 text-navy-900 dark:text-cream rounded-full text-sm border border-transparent focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all" />
            
              <motion.button
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-navy-900 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              
                <SendIcon className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}