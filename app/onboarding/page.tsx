"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Building2, Users, Target, Palette, CheckCircle2, TrendingUp, Zap, Clock } from 'lucide-react';

const formSchema = z.object({
  businessName: z.string().min(2, 'Business Name is required'),
  industry: z.string().min(2, 'Industry is required'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().min(2, 'Location is required'),
  targetAudience: z.string().min(5, 'Please describe your audience'),
  ageGroup: z.string().min(1, 'Select an age group'),
  gender: z.string().min(1, 'Select a gender'),
  interests: z.string().min(2, 'Enter at least one interest'),
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
  brandTone: z.string().min(1, 'Select a brand tone'),
});
type FormValues = z.infer<typeof formSchema>;

const STEPS = [
  { id: 'business', title: 'Business Info', icon: Building2 },
  { id: 'audience', title: 'Audience Info', icon: Users },
  { id: 'goals', title: 'Goals', icon: Target },
  { id: 'style', title: 'Brand Style', icon: Palette },
];

const GOALS_LIST = [
  { id: 'sales', label: 'Increase sales', description: 'Drive more revenue and conversions' },
  { id: 'followers', label: 'More followers', description: 'Grow your social media community' },
  { id: 'awareness', label: 'Brand awareness', description: 'Reach a wider audience' },
  { id: 'leads', label: 'Lead generation', description: 'Capture potential customer data' },
];

const TONE_LIST = [
  { id: 'modern', label: 'Modern & Bold', description: 'Innovative, forward-thinking, and striking' },
  { id: 'luxury', label: 'Premium & Luxury', description: 'Sophisticated, exclusive, and high-end' },
  { id: 'fun', label: 'Fun & Playful', description: 'Lighthearted, energetic, and relatable' },
  { id: 'professional', label: 'Professional', description: 'Trustworthy, corporate, and authoritative' },
];

const SLIDES = [
  {
    headline: 'Set up your brand identity in minutes.',
    sub: 'Tell us who you are so our AI can craft campaigns that feel authentically yours.',
    stats: [
      { label: 'Setup time', value: '< 3', unit: 'minutes', color: 'text-emerald-400', icon: Clock },
      { label: 'Campaigns ready', value: '10x', unit: 'faster', color: 'text-blue-400', icon: Zap },
    ],
  },
  {
    headline: 'Hyper-targeted content for your exact audience.',
    sub: 'The more we know about your customers, the sharper your targeting becomes.',
    stats: [
      { label: 'Engagement lift', value: '+42%', unit: 'avg.', color: 'text-purple-400', icon: TrendingUp },
      { label: 'Audience match', value: '98%', unit: 'accuracy', color: 'text-emerald-400', icon: Target },
    ],
  },
  {
    headline: 'AI that optimizes for the goals that matter to you.',
    sub: 'Your goals shape every campaign, caption, and content plan we generate.',
    stats: [
      { label: 'ROAS boost', value: '3.2x', unit: 'avg.', color: 'text-blue-400', icon: TrendingUp },
      { label: 'Cost reduction', value: '70%', unit: 'lower', color: 'text-emerald-400', icon: Zap },
    ],
  },
  {
    headline: 'Your brand voice, amplified by AI.',
    sub: 'Your brand tone is the personality behind every word our AI writes for you.',
    stats: [
      { label: 'Time saved', value: '8h', unit: '/ week', color: 'text-amber-400', icon: Clock },
      { label: 'Content pieces', value: '500+', unit: '/ month', color: 'text-blue-400', icon: Zap },
    ],
  },
];

const inputClass = "w-full bg-[#111] border border-white/[0.1] rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition-colors";

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { goals: [], brandTone: '' },
    mode: 'onTouched',
  });

  const selectedGoals = watch('goals');
  const selectedTone = watch('brandTone');

  const processData = async (data: FormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('ONBOARDING DATA SUBMITTED:', data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const nextStep = async () => {
    const fieldsByStep: any[][] = [
      ['businessName', 'industry', 'website', 'location'],
      ['targetAudience', 'ageGroup', 'gender', 'interests'],
      ['goals'],
      ['brandTone'],
    ];
    const isStepValid = await trigger(fieldsByStep[currentStep]);
    if (isStepValid) {
      if (currentStep === STEPS.length - 1) handleSubmit(processData)();
      else setCurrentStep(prev => prev + 1);
    }
  };

  const toggleGoal = (goalId: string) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId];
    setValue('goals', newGoals, { shouldValidate: true });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-2xl bg-[#0d0d0d] border border-white/[0.08] text-center">
          <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={30} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">You're All Set!</h2>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            Your Brand Matic workspace is configured. Our AI is generating your first marketing plan.
          </p>
          <button onClick={() => window.location.href = '/home'}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors">
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex font-sans">
      {/* Left panel */}
      <div className="w-full lg:w-[520px] xl:w-[580px] flex flex-col px-8 sm:px-12 py-10 shrink-0 relative z-10 overflow-y-auto">
        <Link href="/" className="flex items-center gap-2 group w-fit mb-8">
          <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">Brand Matic</span>
        </Link>

        {/* Step progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-px bg-white/[0.08]" />
            <motion.div className="absolute top-5 left-0 h-px bg-white"
              animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isActive ? 'bg-white border-white text-black' : isCompleted ? 'bg-[#1a1a1a] border-white/40 text-neutral-300' : 'bg-black border-white/[0.1] text-neutral-600'}`}>
                    <step.icon size={16} />
                  </div>
                  <span className={`mt-2 text-[10px] font-semibold hidden sm:block uppercase tracking-wider
                    ${isActive ? 'text-white' : isCompleted ? 'text-neutral-500' : 'text-neutral-700'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form card */}
        <div className="flex-1 bg-[#0d0d0d] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}>

              {currentStep === 0 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Tell us about your business</h2>
                    <p className="text-neutral-500 text-sm">This helps our AI understand your market positioning.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Business Name</label>
                      <input {...register('businessName')} placeholder="e.g. Acme Corp" className={inputClass} />
                      {errors.businessName && <p className="text-red-400 text-xs">{errors.businessName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Industry</label>
                      <input {...register('industry')} placeholder="e.g. E-commerce" className={inputClass} />
                      {errors.industry && <p className="text-red-400 text-xs">{errors.industry.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Website <span className="text-neutral-600 normal-case font-normal">(Optional)</span></label>
                      <input {...register('website')} placeholder="https://example.com" className={inputClass} />
                      {errors.website && <p className="text-red-400 text-xs">{errors.website.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Location</label>
                      <input {...register('location')} placeholder="e.g. New York, USA" className={inputClass} />
                      {errors.location && <p className="text-red-400 text-xs">{errors.location.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Define your audience</h2>
                    <p className="text-neutral-500 text-sm">Who are you trying to reach with your marketing?</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Target Audience Description</label>
                      <textarea {...register('targetAudience')} placeholder="Describe your ideal customer..." rows={3} className={`${inputClass} resize-none`} />
                      {errors.targetAudience && <p className="text-red-400 text-xs">{errors.targetAudience.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Age Group</label>
                        <select {...register('ageGroup')} className={`${inputClass} appearance-none`}>
                          <option value="">Select range...</option>
                          <option value="18-24">18-24</option>
                          <option value="25-34">25-34</option>
                          <option value="35-44">35-44</option>
                          <option value="45+">45+</option>
                        </select>
                        {errors.ageGroup && <p className="text-red-400 text-xs">{errors.ageGroup.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Gender Focus</label>
                        <select {...register('gender')} className={`${inputClass} appearance-none`}>
                          <option value="">Select gender...</option>
                          <option value="all">All Genders</option>
                          <option value="female">Predominantly Female</option>
                          <option value="male">Predominantly Male</option>
                        </select>
                        {errors.gender && <p className="text-red-400 text-xs">{errors.gender.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Interests <span className="text-neutral-600 normal-case font-normal">(comma separated)</span></label>
                      <input {...register('interests')} placeholder="e.g. Technology, Fitness, Travel" className={inputClass} />
                      {errors.interests && <p className="text-red-400 text-xs">{errors.interests.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">What are your goals?</h2>
                    <p className="text-neutral-500 text-sm">Select all that apply. AI will optimize campaigns for these.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GOALS_LIST.map((goal) => {
                      const isSelected = selectedGoals.includes(goal.id);
                      return (
                        <div key={goal.id} onClick={() => toggleGoal(goal.id)}
                          className={`cursor-pointer p-4 rounded-xl border transition-all duration-200
                            ${isSelected ? 'bg-[#1a1a1a] border-white/30' : 'bg-black border-white/[0.08] hover:border-white/20'}`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className="font-semibold text-sm text-white">{goal.label}</h3>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                              ${isSelected ? 'border-white bg-white' : 'border-neutral-700'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                            </div>
                          </div>
                          <p className="text-xs text-neutral-500">{goal.description}</p>
                        </div>
                      );
                    })}
                  </div>
                  {errors.goals && <p className="text-red-400 text-xs">{errors.goals.message}</p>}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Choose your brand tone</h2>
                    <p className="text-neutral-500 text-sm">This dictates how the AI writes your copy.</p>
                  </div>
                  <div className="space-y-2.5">
                    {TONE_LIST.map((tone) => {
                      const isSelected = selectedTone === tone.id;
                      return (
                        <div key={tone.id} onClick={() => setValue('brandTone', tone.id, { shouldValidate: true })}
                          className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-4
                            ${isSelected ? 'bg-[#1a1a1a] border-white/30' : 'bg-black border-white/[0.08] hover:border-white/20'}`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                            ${isSelected ? 'border-white bg-white' : 'border-neutral-700'}`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-white">{tone.label}</h3>
                            <p className="text-xs text-neutral-500 mt-0.5">{tone.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.brandTone && <p className="text-red-400 text-xs">{errors.brandTone.message}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
            <button onClick={() => setCurrentStep(p => p - 1)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors
                ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-neutral-400 hover:text-white'}`}>
              <ChevronLeft size={16} /> Back
            </button>
            <motion.button onClick={nextStep} disabled={isSubmitting}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-neutral-100 text-black rounded-lg text-sm font-bold transition-colors disabled:opacity-60">
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Continue'}
                  {currentStep !== STEPS.length - 1 && <ChevronRight size={16} />}
                </>
              )}
            </motion.button>
          </div>
        </div>

        <p className="text-xs text-neutral-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:text-neutral-300 font-semibold transition-colors">Sign in</Link>
        </p>
      </div>

      {/* Right panel — auto-rotating slideshow */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          <AnimatePresence>
            <motion.div key={slide}
              className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_60%_40%,rgba(59,130,246,0.07),transparent)]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} x1={`${i * 10}%`} y1="0" x2={`${i * 10 + 50}%`} y2="100%" stroke="white" strokeWidth="0.5" />
            ))}
          </svg>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={`card-a-${slide}`}
            className="absolute top-[22%] right-12 bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 w-52"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}>
            <div className="flex items-center gap-2 mb-2">
              {React.createElement(SLIDES[slide].stats[0].icon, { size: 14, className: SLIDES[slide].stats[0].color })}
              <p className="text-xs text-neutral-500">{SLIDES[slide].stats[0].label}</p>
            </div>
            <p className="text-2xl font-black text-white">
              {SLIDES[slide].stats[0].value}{' '}
              <span className="text-sm font-semibold text-neutral-400">{SLIDES[slide].stats[0].unit}</span>
            </p>
            <p className={`text-[10px] font-semibold mt-1 ${SLIDES[slide].stats[0].color}`}>verified metric</p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div key={`card-b-${slide}`}
            className="absolute top-[48%] right-20 bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 w-48"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2">
              {React.createElement(SLIDES[slide].stats[1].icon, { size: 14, className: SLIDES[slide].stats[1].color })}
              <p className="text-xs text-neutral-500">{SLIDES[slide].stats[1].label}</p>
            </div>
            <p className="text-2xl font-black text-white">{SLIDES[slide].stats[1].value}</p>
            <p className={`text-[10px] font-semibold mt-1 ${SLIDES[slide].stats[1].color}`}>{SLIDES[slide].stats[1].unit}</p>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex flex-col justify-end p-12 pb-14">
          <AnimatePresence mode="wait">
            <motion.div key={slide}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}>
              <p className="text-2xl xl:text-3xl font-bold text-white leading-snug max-w-md mb-4">
                {SLIDES[slide].headline}
              </p>
              <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
                {SLIDES[slide].sub}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-3 mt-8">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`h-px rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-white' : 'w-4 bg-white/25 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
