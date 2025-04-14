import { Separator as RadixSeparator } from 'radix-ui';

export default function Separator() {
  return (
    <RadixSeparator.Root className="my-[15px] bg-foreground opacity-10 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" />
  );
}
