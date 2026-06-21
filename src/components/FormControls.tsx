import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      {children}
    </label>
  );
}

interface ChoiceGridProps {
  legend: string;
  children: ReactNode;
}

export function ChoiceGrid({ legend, children }: ChoiceGridProps) {
  return (
    <fieldset className="choice-group">
      <legend>{legend}</legend>
      <div className="choice-grid">{children}</div>
    </fieldset>
  );
}

interface CheckboxChipProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxChip({ label, checked, onChange }: CheckboxChipProps) {
  return (
    <label className={`chip ${checked ? "is-selected" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

interface RadioCardProps {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}

export function RadioCard({
  label,
  name,
  value,
  checked,
  onChange,
}: RadioCardProps) {
  return (
    <label className={`radio-card ${checked ? "is-selected" : ""}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span>{label}</span>
    </label>
  );
}

export function toggleListValue(
  values: string[],
  value: string,
  checked: boolean,
) {
  if (checked) {
    return values.includes(value) ? values : [...values, value];
  }

  return values.filter((item) => item !== value);
}
