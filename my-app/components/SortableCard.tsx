'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  id: string;
  name: string;
  rank: number;
}

export default function SortableCard({ id, name, rank }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={[
        'flex items-center gap-4 bg-white rounded-2xl px-5 py-4',
        'border border-[#E8E8ED] select-none',
        'cursor-grab active:cursor-grabbing',
        'transition-all duration-150',
        isDragging
          ? 'opacity-40 shadow-xl scale-[1.02] z-50'
          : 'shadow-sm hover:shadow-md hover:border-[#C7C7CC]',
      ].join(' ')}
    >
      <span
        className={[
          'w-8 h-8 rounded-full flex items-center justify-center',
          'text-sm font-semibold flex-shrink-0 transition-colors',
          rank === 1 ? 'bg-[#1D1D1F] text-white' : 'bg-[#F5F5F7] text-[#6E6E73]',
        ].join(' ')}
      >
        {rank}
      </span>

      <span className="flex-1 text-[#1D1D1F] font-medium text-base leading-snug">
        {name}
      </span>

      <svg
        className="flex-shrink-0 text-[#C7C7CC]"
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        aria-hidden
      >
        <circle cx="5" cy="4" r="1.5" fill="currentColor" />
        <circle cx="11" cy="4" r="1.5" fill="currentColor" />
        <circle cx="5" cy="10" r="1.5" fill="currentColor" />
        <circle cx="11" cy="10" r="1.5" fill="currentColor" />
        <circle cx="5" cy="16" r="1.5" fill="currentColor" />
        <circle cx="11" cy="16" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}
