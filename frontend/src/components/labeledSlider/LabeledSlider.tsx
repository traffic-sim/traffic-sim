import "../../theme/panelTheme.css";
import "./LabeledSlider.css";

interface LabeledSliderProps {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function LabeledSlider({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
}: LabeledSliderProps) {
  return (
    <div className="field">
      <div className="field-row">
        <span className="field-label">{label}</span>
        <span className="field-value">{displayValue}</span>
      </div>
      <input
        type="range"
        className="labeled-slider__input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
