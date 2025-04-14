import * as React from 'react';
import { Switch } from 'radix-ui';

export default function RadixSwitch({ id, label, value, onToggle }: ISwitch) {
  console.log('value', value);
  return (
    <form>
      <div className="flex items-center">
        <label
          className="pr-[15px] text-[15px] leading-none text-foreground whitespace-nowrap"
          htmlFor={id}
        >
          {label}
        </label>
        <Switch.Root
          className="relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
          defaultChecked={value}
          id={id}
          checked={value}
          onCheckedChange={onToggle}
        >
          <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root>
      </div>
    </form>
  );
}

interface ISwitch {
  readonly id: string;
  readonly label: string;
  readonly value: boolean;
  readonly onToggle: () => void;
}
