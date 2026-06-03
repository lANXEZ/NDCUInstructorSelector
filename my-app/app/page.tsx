'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { INSTRUCTORS, TOTAL_STUDENTS, compile, type AssignmentResult } from '@/lib/data';
import { getRankings, getResult, saveResult, resetAll } from '@/lib/store';

export default function HomePage() {
  const [rankings, setRankings] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<AssignmentResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setRankings(getRankings());
    setResult(getResult());
  }, []);

  const rankedCount = Object.keys(rankings).filter((k) => {
    const n = parseInt(k);
    return n >= 1 && n <= TOTAL_STUDENTS;
  }).length;

  const runCompile = useCallback(() => {
    setIsCompiling(true);
    setTimeout(() => {
      const fresh = getRankings();
      const newResult = compile(fresh);
      saveResult(newResult);
      setRankings(fresh);
      setResult(newResult);
      setIsCompiling(false);
    }, 350);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <header className="flex items-start justify-between mb-14">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-[#1D1D1F]">
              Instructor Selector
            </h1>
            <p className="mt-3 text-xl text-[#6E6E73]">
              Nutritions and Dietetics · NUTR 69-S1
            </p>
          </div>

          {/* Reset — two-step inline confirmation */}
          <div className="flex items-center gap-2 mt-2 flex-shrink-0">
            {confirmReset ? (
              <>
                <span className="text-sm text-[#6E6E73]">Reset everything?</span>
                <button
                  onClick={() => {
                    resetAll();
                    setRankings({});
                    setResult(null);
                    setConfirmReset(false);
                  }}
                  className="px-4 py-1.5 bg-[#FF3B30] text-white rounded-full text-sm
                    font-medium hover:bg-[#E0332A] transition-colors duration-150"
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-4 py-1.5 border border-[#D2D2D7] text-[#1D1D1F] rounded-full
                    text-sm font-medium hover:bg-[#F5F5F7] transition-colors duration-150"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-4 py-1.5 border border-[#D2D2D7] text-[#6E6E73] rounded-full
                  text-sm font-medium hover:bg-[#F5F5F7] hover:text-[#1D1D1F]
                  transition-colors duration-150"
              >
                Reset
              </button>
            )}
          </div>
        </header>

        {/* Student grid */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-xl font-semibold text-[#1D1D1F]">Students</h2>
            <span className="text-sm text-[#6E6E73]">
              {rankedCount} of {TOTAL_STUDENTS} submitted
            </span>
          </div>
          <div className="grid grid-cols-8 gap-2.5 sm:grid-cols-10 md:grid-cols-12">
            {Array.from({ length: TOTAL_STUDENTS }, (_, i) => i + 1).map((id) => {
              const done = !!rankings[String(id)];
              return (
                <Link key={id} href={`/student/${id}`} className="aspect-square">
                  <div
                    className={[
                      'w-full h-full rounded-xl flex items-center justify-center',
                      'text-sm font-medium transition-all duration-200',
                      'hover:scale-110 hover:shadow-md',
                      done
                        ? 'bg-[#1D1D1F] text-white'
                        : 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E8E8ED]',
                    ].join(' ')}
                  >
                    {id}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Compile */}
        <div className="mb-16">
          <button
            onClick={runCompile}
            disabled={isCompiling}
            className="px-9 py-3.5 bg-[#0071E3] text-white rounded-full text-base font-medium
              hover:bg-[#0077ED] active:bg-[#006ACD] transition-colors duration-150
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompiling ? 'Compiling…' : 'Compile'}
          </button>
          {rankedCount < TOTAL_STUDENTS && (
            <p className="mt-2.5 text-sm text-[#86868B]">
              {TOTAL_STUDENTS - rankedCount} student
              {TOTAL_STUDENTS - rankedCount !== 1 ? 's' : ''}{' '}haven&apos;t submitted yet —
              they will be randomly placed.
            </p>
          )}
        </div>

        {/* Result */}
        {result && (
          <section>
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-xl font-semibold text-[#1D1D1F]">Assignment Result</h2>
              <button
                onClick={runCompile}
                disabled={isCompiling}
                className="px-5 py-2 border border-[#D2D2D7] text-[#1D1D1F] rounded-full
                  text-sm font-medium hover:bg-[#F5F5F7] transition-colors duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Recompile
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INSTRUCTORS.map((instructor) => {
                const assigned = result[instructor.id] ?? [];
                return (
                  <div key={instructor.id} className="bg-[#F5F5F7] rounded-2xl p-5">
                    <p className="text-xs font-medium text-[#6E6E73] mb-1.5">
                      {assigned.length} / {instructor.capacity} students
                    </p>
                    <h3 className="text-sm font-semibold text-[#1D1D1F] mb-4 leading-snug">
                      {instructor.name}
                    </h3>
                    {assigned.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {assigned.map((sid) => (
                          <span
                            key={sid}
                            className="px-3 py-1 bg-white rounded-full text-xs font-medium
                              text-[#1D1D1F] shadow-sm"
                          >
                            #{sid}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#86868B]">No students assigned</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
