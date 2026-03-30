"use client";
import { useState, useEffect } from "react";
import { Profile, AssessmentItemWithBoost } from "@/types";
import { getFilteredItems, applyBoost } from "@/lib/scoring";
import Landing from "@/components/Landing";
import StepProfile from "@/components/StepProfile";
import StepAssessment from "@/components/StepAssessment";
import StepResult from "@/components/StepResult";

export default function Home() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>({
    industry: "",
    vendors: [],
    policy: "",
    useCases: "",
  });
  const [items, setItems] = useState<AssessmentItemWithBoost[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!profile.industry) return;
    const filtered = getFilteredItems(profile.industry);
    const boosted = applyBoost(filtered, profile.useCases);
    setItems(boosted);
  }, [profile.industry, profile.useCases]);

  const handleReset = () => {
    setStep(0);
    setProfile({ industry: "", vendors: [], policy: "", useCases: "" });
    setAnswers({});
    setNotes({});
  };

  if (step === 0) return <Landing onStart={() => setStep(1)} />;
  if (step === 1)
    return (
      <StepProfile
        profile={profile}
        setProfile={setProfile}
        onNext={() => setStep(2)}
      />
    );
  if (step === 2)
    return (
      <StepAssessment
        items={items}
        answers={answers}
        setAnswers={setAnswers}
        notes={notes}
        setNotes={setNotes}
        onNext={() => setStep(3)}
      />
    );
  if (step === 3)
    return (
      <StepResult
        items={items}
        answers={answers}
        notes={notes}
        profile={profile}
        onReset={handleReset}
      />
    );

  return null;
}
