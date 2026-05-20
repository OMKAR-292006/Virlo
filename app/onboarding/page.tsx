"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Building2, Users, Target, Palette, CheckCircle2 } from 'lucide-react';

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

const inputClass = "w-full bg-black border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-white/[0.2] focus:border-white/[0.2] transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]";

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { goals: [], brandTone: '' },
    mode: 'onTouched'
  });

  const selectedGoals = watch('goals');
  const selectedTone = watch('brandTone');

  const processData = async (data: FormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("ONBOARDING DATA SUBMITTED:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const nextStep = async () => {
    const fieldsByStep: any[][] = [
      ['businessName', 'industry', 'website', 'location'],
      ['targetAudience', 'ageGroup', 'gender', 'interests'],
      ['goals'], ['brandTone'],
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
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none bg-black">
          <div className="absolute top-0 left-0 right-0 h-[400px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.07),transparent)]" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-3xl bg-[#0a0a0a] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] text-center relative z-10"
        >
          <div className="w-20 h-20 mx-auto bg-[#111] border border-white/[0.08] rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">You're All Set!</h2>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            Your Brand Matic workspace has been configured. Our AI is now generating your first customized marketing plan.
          </p>
          <button onClick={() => window.location.href = '/dashboard'} className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-black font-semibold transition-colors">
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none bg-black">
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.07),transparent)]" />
      </div>

      {/* Header */}
      <div className="w-full max-w-3xl mb-6 flex items-center gap-2 text-white z-10">
        <div className="p-2 rounded-xl bg-white/10">
          <Sparkles size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight">Brand Matic</span>
      </div>

      <div className="w-full max-w-3xl flex-1 z-10">
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-px bg-white/[0.08] -z-10" />
            <motion.div
              className="absolute top-5 left-0 h-px bg-white -z-10"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive ? 'bg-white border-white text-black' : isCompleted ? 'bg-[#111] border-white/[0.3] text-neutral-300' : 'bg-black border-white/[0.08] text-neutral-600'}`}>
                    <step.icon size={18} />
                  </div>
                  <span className={`mt-3 text-xs font-medium hidden sm:block ${isActive ? 'text-white' : isCompleted ? 'text-neutral-400' : 'text-neutral-700'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-3xl p-5 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              
              {/* Step 1: Business Info */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Tell us about your business</h2>
                    <p className="text-neutral-500 text-sm">This helps our AI understand your market positioning.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-neutral-300">Business Name</label>
                      <input {...register('businessName')} placeholder="e.g. Acme Corp" className={inputClass} />
                      {errors.businessName && <p className="text-red-400 text-xs">{errors.businessName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-neutral-300">Industry</label>
                      <input {...register('industry')} placeholder="e.g. E-commerce" className={inputClass} />
                      {errors.industry && <p className="text-red-400 text-xs">{errors.industry.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-neutral-300">Website <span className="text-neutral-600 font-normal">(Optional)</span></label>
                      <input {...register('website')} placeholder="https://example.com" className={inputClass} />
                      {errors.website && <p className="text-red-400 text-xs">{errors.website.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-neutral-300">Location</label>
                      <input {...register('location')} placeholder="e.g. New York, USA" className={inputClass} />
                      {errors.location && <p className="text-red-400 text-xs">{errors.location.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Audience */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Define your audience</h2>
                    <p className="text-neutral-500 text-sm">Who are you trying to reach with your marketing?</p>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-neutral-300">Target Audience Description</label>
                      <textarea {...register('targetAudience')} placeholder="Describe your ideal customer..." rows={3} className={`${inputClass} resize-none`} />
                      {errors.targetAudience && <p className="text-red-400 text-xs">{errors.targetAudience.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-neutral-300">Age Group</label>
                        <select {...register('ageGroup')} className={`${inputClass} appearance-none`}>
                          <option value="">Select range...</option>
                          <option value="18-24">18-24</option><option value="25-34">25-34</option>
                          <option value="35-44">35-44</option><option value="45+">45+</option>
                        </select>
                        {errors.ageGroup && <p className="text-red-400 text-xs">{errors.ageGroup.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-neutral-300">Gender Focus</label>
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
                      <label className="text-sm font-medium text-neutral-300">Interests (comma separated)</label>
                      <input {...register('interests')} placeholder="e.g. Technology, Fitness, Travel" className={inputClass} />
                      {errors.interests && <p className="text-red-400 text-xs">{errors.interests.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Goals */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">What are your goals?</h2>
                    <p className="text-neutral-500 text-sm">Select all that apply. AI will optimize campaigns for these.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GOALS_LIST.map((goal) => {
                      const isSelected = selectedGoals.includes(goal.id);
                      return (
                        <div key={goal.id} onClick={() => toggleGoal(goal.id)}
                          className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] ${isSelected ? 'bg-[#111] border-white/[0.3]' : 'bg-black border-white/[0.08] hover:border-white/[0.18]'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">{goal.label}</h3>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-white bg-white' : 'border-neutral-700'}`}>
                              {isSelected && <CheckCircle2 size={12} className="text-black" />}
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

              {/* Step 4: Brand Style */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Choose your brand tone</h2>
                    <p className="text-neutral-500 text-sm">This dictates how the AI writes your copy.</p>
                  </div>
                  <div className="space-y-3">
                    {TONE_LIST.map((tone) => {
                      const isSelected = selectedTone === tone.id;
                      return (
                        <div key={tone.id} onClick={() => setValue('brandTone', tone.id, { shouldValidate: true })}
                          className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] ${isSelected ? 'bg-[#111] border-white/[0.3]' : 'bg-black border-white/[0.08] hover:border-white/[0.18]'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-white bg-white' : 'border-neutral-700'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
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

          {/* Form Controls */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <button onClick={() => setCurrentStep(p => p - 1)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
            >
              <ChevronLeft size={18} /> Back
            </button>
            <button onClick={nextStep} disabled={isSubmitting}
              className="px-6 py-2.5 bg-white hover:bg-neutral-100 text-black rounded-xl text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
              ) : (
                <>{currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Continue'}{currentStep !== STEPS.length - 1 && <ChevronRight size={18} />}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
