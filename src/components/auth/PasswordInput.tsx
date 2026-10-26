"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "../icons";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: "current-password" | "new-password";
}

/** Labelled password field with a show/hide toggle (one implementation for every auth form). */
export default function PasswordInput({ id, label, value, onChange, placeholder, autoComplete = "current-password" }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label>
      <div className="input w-full items-center gap-2">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="grow"
        />
        <button type="button" onClick={() => setVisible((v) => !v)} className="btn btn-ghost btn-circle btn-xs" aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible}>
          {visible ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
    </div>
  );
}
