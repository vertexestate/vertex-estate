import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  MailIcon,
  MessageCircleIcon,
  LockIcon,
  UserIcon,
  PhoneIcon,
  ArrowLeftIcon,
  SparklesIcon,
  CheckCircleIcon } from
'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OTPInput } from './OTPInput';
import { useAuth } from '../../context/AuthContext';
import { siteConfig } from '../../config/siteConfig';
type AuthMode = 'login' | 'signup' | 'forgot-password';
type AuthMethod = 'email' | 'whatsapp';
export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    initialAuthMode,
    pendingVerification,
    startSignup,
    startEmailLogin,
    startWhatsAppLogin,
    verifyCode,
    resendCode,
    cancelVerification,
    pendingPasswordReset,
    startPasswordReset,
    verifyPasswordResetCode,
    completePasswordReset,
    resendPasswordResetCode,
    cancelPasswordReset
  } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialAuthMode);
  const [method, setMethod] = useState<AuthMethod>('email');
  const [demoCode, setDemoCode] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isResetSending, setIsResetSending] = useState(false);
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(initialAuthMode);
      setError('');
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      setResetSuccess('');
      setIsResetSending(false);
    }
  }, [isAuthModalOpen, initialAuthMode]);
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);
  // Lock body scroll
  useEffect(() => {
    if (isAuthModalOpen) document.body.style.overflow = 'hidden';else
    document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen]);
  const handleClose = () => {
    closeAuthModal();
    setForm({
      name: '',
      email: '',
      phone: '',
      password: ''
    });
    setCode('');
    setError('');
    setDemoCode('');
    setNewPassword('');
    setConfirmPassword('');
    setResetSuccess('');
    setIsResetSending(false);
  };
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    if (!form.email || !form.password) {
      setError('Please fill in both fields.');
      return;
    }
    const result = startEmailLogin(form.email, form.password);
    if (!result.ok) {
      setError(result.error || 'Login failed.');
      return;
    }
    setDemoCode(result.code || '');
    setResendTimer(30);
  };
  const handlePasswordResetStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setIsResetSending(true);
    const result = await startPasswordReset(form.email);
    setIsResetSending(false);
    if (!result.ok) {
      setError(result.error || 'Password reset failed.');
      return;
    }
    setDemoCode(siteConfig.authDemoMode ? result.code || '' : '');
    setResendTimer(siteConfig.authDemoMode ? 30 : 0);
  };
  const handlePasswordResetVerify = (codeValue?: string) => {
    setError('');
    const result = verifyPasswordResetCode(codeValue ?? code);
    if (!result.ok) {
      setError(result.error || 'Password reset verification failed.');
      setCode('');
      return;
    }
    setCode('');
    setDemoCode('');
    setResendTimer(0);
  };
  const handlePasswordResetComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const resetEmail = pendingPasswordReset?.email || form.email;
    const result = completePasswordReset(newPassword);
    if (!result.ok) {
      setError(result.error || 'Password reset failed.');
      return;
    }
    setForm({
      ...form,
      email: resetEmail,
      password: ''
    });
    setNewPassword('');
    setConfirmPassword('');
    setResetSuccess('Password updated. Sign in with your new password.');
    setMode('login');
  };
  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please complete all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email.');
      return;
    }
    const generated = startSignup(form);
    if (generated === 'DUPLICATE') {
      setError('An account with this email already exists. Try signing in.');
      return;
    }
    if (!siteConfig.authDemoMode) return;
    setDemoCode(generated);
    setResendTimer(30);
  };
  const handleWhatsAppStart = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.phone || form.phone.length < 8) {
      setError('Please enter a valid WhatsApp number.');
      return;
    }
    const generated = startWhatsAppLogin(form.phone);
    if (!siteConfig.authDemoMode) {
      setError(
        'WhatsApp sign-in is not enabled yet. Use email and password, or message us on WhatsApp from the Contact page.'
      );
      return;
    }
    setDemoCode(generated);
    setResendTimer(30);
  };
  const handleVerify = (codeValue?: string) => {
    setError('');
    const result = verifyCode(codeValue ?? code);
    if (!result.ok) {
      setError(result.error || 'Verification failed.');
      setCode('');
    }
  };
  const handleResend = () => {
    const fresh = resendCode();
    setDemoCode(fresh);
    setCode('');
    setError('');
    setResendTimer(30);
  };
  const handlePasswordResetResend = async () => {
    setIsResetSending(true);
    const result = await resendPasswordResetCode();
    setIsResetSending(false);
    if (!result.ok) {
      setError(result.error || 'Could not resend reset code.');
      return;
    }
    setDemoCode(siteConfig.authDemoMode ? result.code || '' : '');
    setCode('');
    setError('');
    setResendTimer(siteConfig.authDemoMode ? 30 : 0);
  };
  const handleBack = () => {
    cancelVerification();
    setCode('');
    setError('');
    setDemoCode('');
  };
  const handlePasswordResetBack = () => {
    cancelPasswordReset();
    setMode('login');
    setCode('');
    setError('');
    setDemoCode('');
    setNewPassword('');
    setConfirmPassword('');
  };
  return (
    <AnimatePresence>
      {isAuthModalOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={handleClose}
          className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-[70]" />
        
          <div className="fixed inset-0 z-[70] flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pointer-events-none sm:items-center sm:p-4">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className="relative pointer-events-auto max-h-[min(92dvh,640px)] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-gold-500/20 bg-white shadow-2xl dark:bg-navy-800 sm:max-h-[90vh] sm:rounded-3xl">
            
              <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors z-10"
              aria-label="Close">
              
                <XIcon className="w-5 h-5 text-navy-700 dark:text-cream" />
              </button>

              <div className="p-8">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                    <span className="text-navy-900 font-display font-bold text-xl">
                      V
                    </span>
                  </div>
                  <span className="font-display font-bold text-navy-900 dark:text-cream">
                    Vertex Estate
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {/* OTP VERIFICATION STEP */}
                  {pendingVerification ?
                <motion.div
                  key="otp"
                  initial={{
                    opacity: 0,
                    x: 30
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  exit={{
                    opacity: 0,
                    x: -30
                  }}>
                  
                      <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-navy-600 dark:text-navy-400 hover:text-gold-500 mb-4">
                    
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back
                      </button>

                      <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold-500/10 flex items-center justify-center">
                          {pendingVerification.type === 'email' ?
                      <MailIcon className="w-8 h-8 text-gold-500" /> :

                      <MessageCircleIcon className="w-8 h-8 text-gold-500" />
                      }
                        </div>
                        <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-2">
                          Verify Your{' '}
                          {pendingVerification.type === 'email' ?
                      'Email' :
                      'WhatsApp'}
                        </h2>
                        <p className="text-sm text-navy-600 dark:text-navy-400">
                          We sent a 6-digit code to{' '}
                          <span className="font-semibold text-navy-900 dark:text-cream">
                            {pendingVerification.destination}
                          </span>
                        </p>
                      </div>

                      {!siteConfig.authDemoMode && (
                        <p className="mb-5 rounded-xl border border-navy-200/80 bg-navy-50/80 px-4 py-3 text-center text-sm text-navy-600 dark:border-navy-600 dark:bg-navy-800/50 dark:text-navy-300">
                          Enter the verification code we sent to your{' '}
                          {pendingVerification.type === 'email' ? 'email' : 'WhatsApp'}.
                        </p>
                      )}

                      {/* Demo code helper — dev only */}
                      {siteConfig.authDemoMode && demoCode && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    className="mb-5 p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-center">
                    
                          <div className="flex items-center justify-center gap-2 text-xs text-gold-600 dark:text-gold-400 mb-1">
                            <SparklesIcon className="w-3.5 h-3.5" />
                            <span className="uppercase tracking-wider font-semibold">
                              Demo Mode
                            </span>
                          </div>
                          <p className="text-xs text-navy-600 dark:text-navy-400 mb-1">
                            Your verification code:
                          </p>
                          <p className="text-2xl font-display font-bold text-gold-500 tracking-[0.3em]">
                            {demoCode}
                          </p>
                        </motion.div>
                      )}

                      <OTPInput
                    value={code}
                    onChange={setCode}
                    onComplete={handleVerify} />
                  

                      {error &&
                  <motion.p
                    initial={{
                      opacity: 0
                    }}
                    animate={{
                      opacity: 1
                    }}
                    className="text-sm text-red-500 text-center mt-4">
                    
                          {error}
                        </motion.p>
                  }

                      <Button
                    variant="primary"
                    className="w-full mt-6"
                    onClick={() => handleVerify()}
                    disabled={code.length !== 6}>
                    
                        Verify & Continue
                      </Button>

                      <div className="text-center mt-4">
                        <button
                      onClick={handleResend}
                      disabled={resendTimer > 0}
                      className="text-sm text-navy-600 dark:text-navy-400 hover:text-gold-500 disabled:opacity-50 disabled:cursor-not-allowed">
                      
                          {resendTimer > 0 ?
                      `Resend code in ${resendTimer}s` :
                      "Didn't receive code? Resend"}
                        </button>
                      </div>
                    </motion.div> /* LOGIN / SIGNUP STEP */ :

                <motion.div
                  key="auth"
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  exit={{
                    opacity: 0
                  }}>
                  
                      <h2 className="text-3xl font-display font-bold text-navy-900 dark:text-cream mb-1">
                        {mode === 'login' ?
                    'Welcome back' :
                    mode === 'signup' ?
                    'Create your account' :
                    'Reset password'}
                      </h2>
                      <p className="text-sm text-navy-600 dark:text-navy-400 mb-6">
                        {mode === 'login' ?
                    'Access your saved properties and personalized recommendations' :
                    mode === 'signup' ?
                    'Join thousands finding their dream property' :
                    'Enter your email, confirm the reset code, and choose a new password.'}
                      </p>

                      {resetSuccess &&
                  <p className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                          {resetSuccess}
                        </p>
                  }

                      {/* Method tabs */}
                      {mode !== 'forgot-password' &&
                  <div className="flex gap-2 p-1 bg-navy-100 dark:bg-navy-900 rounded-xl mb-6">
                        <button
                      onClick={() => setMethod('email')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${method === 'email' ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-cream shadow-sm' : 'text-navy-600 dark:text-navy-400 hover:text-navy-900 dark:hover:text-cream'}`}>
                      
                          <MailIcon className="w-4 h-4" />
                          Email
                        </button>
                        <button
                      onClick={() => setMethod('whatsapp')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${method === 'whatsapp' ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-cream shadow-sm' : 'text-navy-600 dark:text-navy-400 hover:text-navy-900 dark:hover:text-cream'}`}>
                      
                          <MessageCircleIcon className="w-4 h-4" />
                          WhatsApp
                        </button>
                      </div>
                  }

                      {/* WhatsApp method */}
                      {method === 'whatsapp' && mode !== 'forgot-password' &&
                  <form
                    onSubmit={handleWhatsAppStart}
                    className="space-y-4">
                    
                          <div>
                            <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                              WhatsApp Number
                            </label>
                            <div className="relative">
                              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                              <input
                          type="tel"
                          placeholder="+1 555 000 0000"
                          value={form.phone}
                          onChange={(e) =>
                          setForm({
                            ...form,
                            phone: e.target.value
                          })
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none" />
                        
                            </div>
                            <p className="text-xs text-navy-500 dark:text-navy-400 mt-2 flex items-center gap-1">
                              <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
                              We'll send a verification code via WhatsApp
                            </p>
                          </div>

                          {error &&
                    <p className="text-sm text-red-500">{error}</p>
                    }

                          <Button
                      variant="primary"
                      className="w-full"
                      type="submit">
                      
                            <MessageCircleIcon className="w-4 h-4 mr-2" />
                            Continue with WhatsApp
                          </Button>
                        </form>
                  }

                      {/* Email method - login */}
                      {method === 'email' && mode === 'login' &&
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                              Email
                            </label>
                            <div className="relative">
                              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                              <input
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) =>
                          setForm({
                            ...form,
                            email: e.target.value
                          })
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none" />
                        
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                              <input
                          type="password"
                          placeholder="••••••••"
                          value={form.password}
                          onChange={(e) =>
                          setForm({
                            ...form,
                            password: e.target.value
                          })
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none" />
                        
                            </div>
                          </div>

                          <div className="text-right">
                            <button
                        type="button"
                        onClick={() => {
                          cancelPasswordReset();
                          setMode('forgot-password');
                          setMethod('email');
                          setError('');
                          setResetSuccess('');
                          setCode('');
                          setDemoCode('');
                        }}
                        className="text-sm font-semibold text-gold-500 hover:underline">
                              Forgot password?
                            </button>
                          </div>

                          {error &&
                    <p className="text-sm text-red-500">{error}</p>
                    }

                          <Button
                      variant="primary"
                      className="w-full"
                      type="submit">
                      
                            Sign In
                          </Button>
                        </form>
                  }

                      {/* Forgot password */}
                      {mode === 'forgot-password' &&
                  <div className="space-y-5">
                          <button
                      type="button"
                      onClick={handlePasswordResetBack}
                      className="flex items-center gap-1 text-sm text-navy-600 dark:text-navy-400 hover:text-gold-500">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to sign in
                          </button>

                          {!pendingPasswordReset &&
                    <form
                      onSubmit={handlePasswordResetStart}
                      className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                                Account Email
                              </label>
                              <div className="relative">
                                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                                <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) =>
                            setForm({
                              ...form,
                              email: e.target.value
                            })
                            }
                            className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none" />
                          
                              </div>
                            </div>

                            {error &&
                      <p className="text-sm text-red-500">{error}</p>
                      }

                            <Button
                        variant="primary"
                        className="w-full"
                        type="submit"
                        disabled={isResetSending}>
                              {isResetSending ? 'Sending Code...' : 'Send Reset Code'}
                            </Button>
                          </form>
                    }

                          {pendingPasswordReset && !pendingPasswordReset.verified &&
                    <div className="space-y-5">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold-500/10 flex items-center justify-center">
                                <MailIcon className="w-8 h-8 text-gold-500" />
                              </div>
                              <h3 className="text-xl font-display font-bold text-navy-900 dark:text-cream mb-2">
                                Check Your Email
                              </h3>
                              <p className="text-sm text-navy-600 dark:text-navy-400">
                                Enter the 6-digit reset code for{' '}
                                <span className="font-semibold text-navy-900 dark:text-cream">
                                  {pendingPasswordReset.email}
                                </span>
                              </p>
                            </div>

                            {siteConfig.authDemoMode && demoCode && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: -10
                          }}
                          animate={{
                            opacity: 1,
                            y: 0
                          }}
                          className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-center">
                                  <div className="flex items-center justify-center gap-2 text-xs text-gold-600 dark:text-gold-400 mb-1">
                                    <SparklesIcon className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider font-semibold">
                                      Demo Mode
                                    </span>
                                  </div>
                                  <p className="text-xs text-navy-600 dark:text-navy-400 mb-1">
                                    Your reset code:
                                  </p>
                                  <p className="text-2xl font-display font-bold text-gold-500 tracking-[0.3em]">
                                    {demoCode}
                                  </p>
                                </motion.div>
                      )}

                            <OTPInput
                        value={code}
                        onChange={setCode}
                        onComplete={handlePasswordResetVerify} />

                            {error &&
                      <p className="text-sm text-red-500 text-center">{error}</p>
                      }

                            <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handlePasswordResetVerify()}
                        disabled={code.length !== 6}>
                              Verify Reset Code
                            </Button>

                            <div className="text-center">
                              <button
                          onClick={handlePasswordResetResend}
                          disabled={resendTimer > 0 || isResetSending}
                          className="text-sm text-navy-600 dark:text-navy-400 hover:text-gold-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isResetSending ?
                          'Sending code...' :
                          resendTimer > 0 ?
                          `Resend code in ${resendTimer}s` :
                          "Didn't receive code? Resend"}
                              </button>
                            </div>
                          </div>
                    }

                          {pendingPasswordReset && pendingPasswordReset.verified &&
                    <form
                      onSubmit={handlePasswordResetComplete}
                      className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                                New Password
                              </label>
                              <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                                <input
                            type="password"
                            placeholder="At least 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                                Confirm Password
                              </label>
                              <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                                <input
                            type="password"
                            placeholder="Repeat your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none" />
                              </div>
                            </div>

                            {error &&
                      <p className="text-sm text-red-500">{error}</p>
                      }

                            <Button
                        variant="primary"
                        className="w-full"
                        type="submit">
                              Update Password
                            </Button>
                          </form>
                    }
                        </div>
                  }

                      {/* Email method - signup */}
                      {method === 'email' && mode === 'signup' &&
                  <form
                    onSubmit={handleEmailSignup}
                    className="space-y-4">
                    
                          <div>
                            <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                              Full Name
                            </label>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                              <input
                          type="text"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={(e) =>
                          setForm({
                            ...form,
                            name: e.target.value
                          })
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none" />
                        
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                              Email
                            </label>
                            <div className="relative">
                              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                              <input
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) =>
                          setForm({
                            ...form,
                            email: e.target.value
                          })
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none" />
                        
                            </div>
                          </div>
                          <Input
                      label="Phone"
                      type="tel"
                      placeholder="+1 555 000 0000"
                      value={form.phone}
                      onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value
                      })
                      } />
                    
                          <div>
                            <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                              <input
                          type="password"
                          placeholder="At least 6 characters"
                          value={form.password}
                          onChange={(e) =>
                          setForm({
                            ...form,
                            password: e.target.value
                          })
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none" />
                        
                            </div>
                          </div>

                          {error &&
                    <p className="text-sm text-red-500">{error}</p>
                    }

                          <Button
                      variant="primary"
                      className="w-full"
                      type="submit">
                      
                            Create Account
                          </Button>
                          <p className="text-xs text-navy-500 dark:text-navy-400 text-center">
                            We'll send a verification code to your email
                          </p>
                        </form>
                  }

                      {/* Mode toggle */}
                      {mode !== 'forgot-password' &&
                      <div className="mt-6 pt-6 border-t border-navy-100 dark:border-navy-700 text-center">
                        <p className="text-sm text-navy-600 dark:text-navy-400">
                          {mode === 'login' ?
                      "Don't have an account?" :
                      'Already have an account?'}{' '}
                          <button
                        onClick={() => {
                          setMode(mode === 'login' ? 'signup' : 'login');
                          setError('');
                          setResetSuccess('');
                        }}
                        className="font-semibold text-gold-500 hover:underline">
                        
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                          </button>
                        </p>
                      </div>
                  }
                    </motion.div>
                }
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}