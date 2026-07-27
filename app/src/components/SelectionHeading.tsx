import type { ReactNode } from 'react';

interface SelectionHeadingProps {
  /** The tab clipped to the frame's top-left, as a layer name would be. */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * A section title dressed as a selected object on a design canvas: a tinted
 * box, a hairline border, a handle at each corner, and the layer's name on a
 * tab above it.
 *
 * The metaphor is the whole point of the look being copied here — the page
 * presents itself as a file open in a design tool — so it lives in one
 * component and every section leads with it.
 */
const SelectionHeading = ({ label, children, className = '' }: SelectionHeadingProps) => (
  <div className={`relative inline-block ${className}`}>
    <span className="absolute -top-[13px] left-0 rounded-t-[3px] bg-[#1a8cff] px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-wide text-white">
      {label}
    </span>

    <div className="relative border border-[#1a8cff] bg-[#1a8cff]/[0.07] px-6 py-4 md:px-10 md:py-6">
      {children}

      {/* Corner handles, drawn on the border rather than inside it. */}
      {[
        '-top-[4px] -left-[4px]',
        '-top-[4px] -right-[4px]',
        '-bottom-[4px] -left-[4px]',
        '-bottom-[4px] -right-[4px]',
      ].map((position) => (
        <span
          key={position}
          className={`absolute h-[7px] w-[7px] border border-[#1a8cff] bg-white ${position}`}
        />
      ))}
    </div>
  </div>
);

export default SelectionHeading;
