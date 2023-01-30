export interface IdBasedResource {
  id: string;
  name: string;
}

interface WorkSession {
  date: Date;
  duration: number;
}

export interface SubTask extends IdBasedResource {
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
