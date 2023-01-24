export interface IdBasedResource {
  id: string;
  name: string;
}

interface WorkSession {
  date: Date;
  duration: number;
}

interface SubTask {
  name: string;
  completed: boolean;
}

export interface Task extends IdBasedResource {
  dueDate: Date | null;
  description: string;
  estimatedHours: number;
  completed: boolean;
  planned: WorkSession[];
  subTasks: SubTask[];
  tagId: string | null;
  issueId: string | null;
}

export interface Issue extends IdBasedResource {
  description: string;
}

export interface Tag extends IdBasedResource {}
