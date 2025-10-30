'use client';

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

type Mode = "login" | "signup";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

type AuthFormProps = {
  initialMode?: Mode;
};

export function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const router = useRouter();
  const { supabase } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const ctaLabel = useMemo(
    () => (mode === "login" ? "Se connecter" : "Créer mon compte"),
    [mode]
  );

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const canSubmit = useMemo(() => {
    return EMAIL_REGEX.test(normalizedEmail) && password.length >= 6;
  }, [normalizedEmail, password]);

  useEffect(() => {
    setError(null);
    setStatus("idle");
  }, [mode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Merci de fournir un email valide et un mot de passe (6+ caractères).");
      return;
    }

    setStatus("loading");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        setStatus("idle");
        setError(error.message);
        return;
      }

      setStatus("success");
      router.replace("/dashboard");
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setStatus("idle");
      setError(payload?.error ?? "Impossible de créer le compte.");
      return;
    }

    setStatus("success");
    router.replace("/dashboard");
  };

  return (
    <div className="auth-card">
      <div className="auth-tabs">
        <button
          type="button"
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
          aria-pressed={mode === "login"}
        >
          Connexion
        </button>
        <button
          type="button"
          className={mode === "signup" ? "active" : ""}
          onClick={() => setMode("signup")}
          aria-pressed={mode === "signup"}
        >
          Inscription
        </button>
      </div>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="auth-field">
          <span>Mot de passe</span>
          <input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
        </label>

        {error ? <p className="auth-error">{error}</p> : null}

        <button
          type="submit"
          className="auth-submit"
          disabled={!canSubmit || status === "loading"}
        >
          {status === "loading" ? "En cours..." : ctaLabel}
        </button>
      </form>
    </div>
  );
}
