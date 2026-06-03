export interface Instructor {
  id: string;
  name: string;
  capacity: number;
}

export const INSTRUCTORS: Instructor[] = [
  { id: '1', name: 'รศ. ดร. ธันยวัน สวนทวี', capacity: 2 },
  { id: '2', name: 'ผศ.ดร.จรูญศรี ชูศักดิ์', capacity: 2 },
  { id: '3', name: 'รศ. ดร. สุวิมล ทรัพย์วโรบล', capacity: 2 },
  { id: '4', name: 'รศ. ดร. สถาพร งานอุโฆษ', capacity: 2 },
  { id: '5', name: 'ผศ.ดร.วรัญญา เตชะสุขถาวร', capacity: 2 },
  { id: '6', name: 'ศ.ดร. สิริชัย อดิศักดิ์วัฒนา', capacity: 2 },
  { id: '7', name: 'ผศ. ดร. แพรว จันทรศิลปิน', capacity: 3 },
  { id: '8', name: 'ผศ. ดร. สุกฤต ศิริขวัญพงศ์', capacity: 4 },
  { id: '9', name: 'ผศ. ดร. วัชรี บุญลือ', capacity: 4 },
];

export const TOTAL_STUDENTS = 23;

export const ALPHABETICAL_INSTRUCTORS = [...INSTRUCTORS].sort((a, b) =>
  a.name.localeCompare(b.name, 'th')
);

export type Rankings = Record<string, string[]>;
export type AssignmentResult = Record<string, number[]>;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function compile(rankings: Rankings): AssignmentResult {
  const assignments: AssignmentResult = {};
  const remaining = new Map<string, number>();

  for (const inst of INSTRUCTORS) {
    assignments[inst.id] = [];
    remaining.set(inst.id, inst.capacity);
  }

  const unassigned = new Set(
    Array.from({ length: TOTAL_STUDENTS }, (_, i) => i + 1)
  );

  for (let rank = 0; rank < INSTRUCTORS.length; rank++) {
    if (unassigned.size === 0) break;

    const groups = new Map<string, number[]>();
    for (const studentId of unassigned) {
      const prefs = rankings[String(studentId)];
      if (!prefs || rank >= prefs.length) continue;
      const instructorId = prefs[rank];
      if (!groups.has(instructorId)) groups.set(instructorId, []);
      groups.get(instructorId)!.push(studentId);
    }

    for (const [instructorId, students] of groups) {
      const cap = remaining.get(instructorId) ?? 0;
      if (cap <= 0) continue;

      const toAssign =
        students.length <= cap ? students : shuffle(students).slice(0, cap);

      for (const sid of toAssign) {
        assignments[instructorId].push(sid);
        remaining.set(instructorId, (remaining.get(instructorId) ?? 0) - 1);
        unassigned.delete(sid);
      }
    }
  }

  // Assign any remaining students (those who didn't rank all instructors)
  for (const studentId of unassigned) {
    for (const [instructorId, cap] of remaining) {
      if (cap > 0) {
        assignments[instructorId].push(studentId);
        remaining.set(instructorId, cap - 1);
        unassigned.delete(studentId);
        break;
      }
    }
  }

  for (const key of Object.keys(assignments)) {
    assignments[key].sort((a, b) => a - b);
  }

  return assignments;
}
