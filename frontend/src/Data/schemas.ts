export interface IdBasedResource {
  id: string;
}

export interface IdNameBasedResource extends IdBasedResource {
  name: string;
}

export interface WorkSession extends IdBasedResource {
  taskId: string;
  date: Date;
  duration: number;
}

export interface SubTask extends IdNameBasedResource {
  completed: boolean;
}

export interface Task extends IdNameBasedResource {
  dueDate: Date | null;
  description: string;
  estimatedHours: number;
  completed: boolean;
  subTasks: SubTask[];
  tagId: string | null;
  issueId: string | null;
}

export interface Tag extends IdNameBasedResource {}
