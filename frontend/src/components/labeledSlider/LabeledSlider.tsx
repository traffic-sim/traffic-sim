import "./LabeledSlider.css";

interface LabeledSliderProps {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function LabeledSlider({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
  disabled = false,
}: LabeledSliderProps) {
  return (
    <div className={`field ${disabled ? "field--disabled" : ""}`}>
      <div className="field-row">
        <span className="field-label">{label}</span>
        <span className="field-value">{displayValue}</span>
      </div>
      <input
        type="range"
        className="labeled-slider__input"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
