'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { INSTRUCTORS, ALPHABETICAL_INSTRUCTORS, TOTAL_STUDENTS, type Instructor } from '@/lib/data';
import { getStudentRanking, setStudentRanking } from '@/lib/store';
import SortableCard from '@/components/SortableCard';

export default function StudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = parseInt(params.id as string);

  const [items, setItems] = useState<Instructor[]>([]);
  const [saved, setSaved] = useState(false);
  const [hasPrior, setHasPrior] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isNaN(studentId) || studentId < 1 || studentId > TOTAL_STUDENTS) {
      router.push('/');
      return;
    }
    const existing = getStudentRanking(studentId);
    if (existing) {
      setHasPrior(true);
      const ordered = existing
        .map((id) => INSTRUCTORS.find((i) => i.id === id))
        .filter((i): i is Instructor => Boolean(i));
      setItems(ordered);
    } else {
      setItems([...ALPHABETICAL_INSTRUCTORS]);
    }
    setReady(true);
  }, [studentId, router]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const from = prev.findIndex((i) => i.id === active.id);
      const to = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, from, to);
    });
    setSaved(false);
  }

  function handleSave() {
    setStudentRanking(studentId, items.map((i) => i.id));
    setSaved(true);
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-14">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-[#0071E3]
            hover:text-[#0077ED] transition-colors mb-12"
        >
          <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden>
            <path d="M6 1L1.5 5.5L6 10" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Overview
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-[#6E6E73] mb-1 tracking-wide uppercase">
            Student
          </p>
          <h1 className="text-6xl font-semibold tracking-tight text-[#1D1D1F]">
            #{studentId}
          </h1>
          <p className="mt-3 text-base text-[#6E6E73]">
            Drag the cards to order your preference. Top card = first choice.
          </p>
        </div>

        {/* Sortable list */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2.5">
              {items.map((instructor, index) => (
                <SortableCard
                  key={instructor.id}
                  id={instructor.id}
                  name={instructor.name}
                  rank={index + 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Actions */}
        <div className="mt-10 flex items-center gap-5">
          <button
            onClick={handleSave}
            className={[
              'px-8 py-3.5 rounded-full text-base font-medium transition-colors duration-150',
              saved
                ? 'bg-[#34C759] text-white'
                : 'bg-[#1D1D1F] text-white hover:bg-[#2D2D2F] active:bg-[#0D0D0F]',
            ].join(' ')}
          >
            {saved ? 'Saved ✓' : hasPrior ? 'Update Ranking' : 'Save Ranking'}
          </button>
          {saved && (
            <Link
              href="/"
              className="text-sm text-[#0071E3] hover:text-[#0077ED] transition-colors"
            >
              Back to overview →
            </Link>
          )}
        </div>

        {hasPrior && !saved && (
          <p className="mt-4 text-sm text-[#86868B]">
            Previously saved ranking loaded. Drag to change, then save.
          </p>
        )}
      </div>
    </div>
  );
}
