'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';

import type { Task, TaskGroup } from '@/types/project';
import { cn } from '@/lib/utils';

import { renderTaskListItem } from '@/components/task-list-item';
import { TaskStatusIndicator } from '@/components/task-status-indicator';

interface TaskListGroupProps {
  taskGroup: TaskGroup;
  tasks: Task[];
}

export const TaskListGroup = ({ taskGroup, tasks }: TaskListGroupProps) => {
  const renderItem = renderTaskListItem(tasks);

  return (
    <Droppable droppableId={taskGroup.value} renderClone={renderItem}>
      {(droppableProvided, snapshot) => (
        <div
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
          className={cn(
            'w-full text-sm ring-2 ring-blue-500 ring-opacity-0 transition duration-300',
            snapshot.isDraggingOver && 'ring-opacity-100'
          )}
        >
          <div className="w-full gap-2 bg-muted-foreground/10 px-4 py-2 font-medium horizontal center-v">
            <TaskStatusIndicator status={taskGroup.value} />
            {taskGroup.label}
          </div>

          <div className=" ">
            {tasks.map((task, idx) => (
              <Draggable key={task.name} draggableId={task.name} index={idx} >
                {renderItem}
              </Draggable>
            ))}
          </div>

          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
