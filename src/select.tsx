import React, { ChangeEvent, useState } from 'react';
import emitter from './emitter';

interface Props {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange?: (value: string) => void;
}

export default function Select({ id, label, value, options, onChange }: Props) {
  const [currentValue, setCurrentValue] = useState(value);

  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setCurrentValue(newValue);
    onChange && onChange(newValue);
    emitter.emit(id, newValue);
  };

  return (
    <select
      id={id.replace(/\./g, '-')}
      className="control input select"
      onChange={onChangeHandler}
      defaultValue={currentValue}
    >
      {options.map((optionValue, i) => (
        <option key={i} value={optionValue}>
          {optionValue}
        </option>
      ))}
    </select>
  );
}
