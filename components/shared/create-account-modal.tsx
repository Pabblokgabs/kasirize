"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveStoredAuthUser } from "@/lib/auth";
import { getStoredProfile, saveStoredProfile } from "@/lib/store";
import { useKasirizeStore } from "@/store/kasirize-store";
import { CheckCircle2, Loader2, Lock, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  actionName?: string;
}

export function CreateAccountModal({
  isOpen,
  onClose,
  onSuccess,
  actionName = "continue",
}: CreateAccountModalProps) {
  const [profile, setProfile] = useState(() => getStoredProfile());
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("Soweto");
  const [province, setProvince] = useState("Gauteng");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Synchronize with local storage whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      const p = getStoredProfile();
      setProfile(p);
      setFullName(p.fullName || "");
      setEmail(p.email && !p.email.includes("local") ? p.email : "");
      setLocation(p.location || "Soweto");
      setProvince(p.province || "Gauteng");
      setPassword("");
      setErrorMessage("");
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage("Please provide your name and email.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/register-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          location: location.trim(),
          province,
          experienceStory: profile.experienceStory || "",
          confidenceScore: profile.overallConfidenceScore || 65,
          skills: profile.skills || [],
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create account.");
      }

      // Upgrade local storage and Zustand auth state to full account
      const updatedAuthUser = {
        id: json.data.id,
        name: json.data.name,
        email: json.data.email,
        role: "role-user" as const,
        isGuest: false,
        location: json.data.location,
      };

      saveStoredAuthUser(updatedAuthUser);
      useKasirizeStore.getState().setAuthUser(updatedAuthUser);

      // Also update stored profile with permanent id and non-guest flag
      saveStoredProfile({
        ...profile,
        id: json.data.id,
        fullName: json.data.name,
        email: json.data.email,
        location: location.trim(),
        province,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsLoading(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMessage((err as Error).message || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-card border border-border rounded-card shadow-2xl p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X className="size-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-7" />
            </div>
            <h3 className="text-xl font-bold font-heading text-foreground">
              Account Created Successfully!
            </h3>
            <p className="text-sm text-muted-foreground">
              You are now fully registered. Full access to task applications, chats, and transport stipends is unlocked.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
                <Lock className="size-3.5" />
                <span>Account Required</span>
              </div>
              <h2 className="text-xl font-bold font-heading text-foreground">
                Create Account to {actionName}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                You built your profile as a guest. Set up your permanent account to unlock live applications and chat with township businesses.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="reg-name" className="text-xs font-semibold">
                  Full Name
                </Label>
                <Input
                  id="reg-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-email" className="text-xs font-semibold">
                  Email Address
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="e.g. yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-password" className="text-xs font-semibold">
                  Create Password (min 6 characters)
                </Label>
                <Input
                  id="reg-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="reg-loc" className="text-xs font-semibold">
                    Township / Area
                  </Label>
                  <Input
                    id="reg-loc"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-prov" className="text-xs font-semibold">
                    Province
                  </Label>
                  <select
                    id="reg-prov"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-btn border border-input bg-background text-foreground text-xs"
                  >
                    <option value="Gauteng">Gauteng</option>
                    <option value="Western Cape">Western Cape</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="Free State">Free State</option>
                    <option value="North West">North West</option>
                    <option value="Northern Cape">Northern Cape</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted border border-border flex items-start gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Your {profile.skills?.length || 0} extracted skills and confidence score ({profile.overallConfidenceScore}%) will be linked to your permanent Neon database record.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-2 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-1.5" />
                      <span>Saving to DB...</span>
                    </>
                  ) : (
                    "Create Permanent Account"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

