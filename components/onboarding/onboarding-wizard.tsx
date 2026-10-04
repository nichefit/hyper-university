"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  onboardingSchema,
  type OnboardingInput,
} from "@/lib/validations/auth";
import { completeOnboardingAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SKILL_OPTIONS = [
  "Video editing",
  "Graphic design",
  "Social media",
  "Coding",
  "Content writing",
  "Marketing",
  "Photography",
];

const INTEREST_OPTIONS = [
  "Dropcourse",
  "Freelancing",
  "Startups",
  "Design",
  "Tech",
  "Finance",
];

const STEPS = ["About you", "Skills", "Your path"] as const;

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      username: "",
      college: "",
      city: "",
      skills: [],
      interests: [],
      path: "learn_and_earn",
    },
  });

  function toggleInArray(
    field: "skills" | "interests",
    value: string,
  ) {
    const current = form.getValues(field);
    if (current.includes(value)) {
      form.setValue(field, current.filter((v) => v !== value));
    } else {
      form.setValue(field, [...current, value]);
    }
  }

  async function finish() {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please complete all required fields");
      return;
    }
    setLoading(true);
    try {
      const result = await completeOnboardingAction(form.getValues());
      if (result?.error) toast.error(result.error);
    } catch {
      // redirect
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-heading text-3xl font-bold">Welcome to Infly</h1>
        <p className="mt-2 text-muted-foreground">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
        <div className="mt-4 flex gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                i <= step ? "bg-infly-electric" : "bg-white/10",
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          className="space-y-4 rounded-2xl border border-white/10 bg-glass-panel p-6 backdrop-blur-xl"
        >
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" {...form.register("fullName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...form.register("username")} />
                <p className="text-xs text-muted-foreground">
                  Your public profile: infly.com/u/{form.watch("username") || "you"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College / school</Label>
                <Input id="college" {...form.register("college")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register("city")} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <Label>Skills</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => (
                    <Badge
                      key={skill}
                      variant={
                        form.watch("skills").includes(skill)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleInArray("skills", skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Interests</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={
                        form.watch("interests").includes(interest)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleInArray("interests", interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  {
                    id: "direct_selling" as const,
                    title: "Direct Selling",
                    desc: "Create and sell your own Dropcourse.",
                  },
                  {
                    id: "learn_and_earn" as const,
                    title: "Learn & Earn",
                    desc: "Build skills, earn gigs, then create courses.",
                  },
                ] as const
              ).map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => form.setValue("path", option.id)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all hover:border-infly-electric/50",
                    form.watch("path") === option.id
                      ? "border-infly-electric bg-infly-electric/10 shadow-glow"
                      : "border-white/10",
                  )}
                >
                  <p className="font-heading font-semibold">{option.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {option.desc}
                  </p>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="ghost"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            className="bg-infly-electric hover:bg-infly-electric/90"
            onClick={() => setStep((s) => s + 1)}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            className="bg-infly-electric hover:bg-infly-electric/90"
            onClick={finish}
            disabled={loading}
          >
            Finish setup
          </Button>
        )}
      </div>
    </div>
  );
}
