export const TaskStatus = {
	All: 0,
  PENDING: 1,
  DONE: 2,
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];
