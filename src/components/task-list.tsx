'use client';

import { useMemo, useState } from 'react';
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';

import { capitalize, keys } from '@/lib/utils';
import { tasks } from '@/lib/test-data';
import type { TaskStatus, Task, GroupedTask } from '@/types/project';

import { TaskListGroup } from '@/components/task-list-group';

const reorder = (list: Task[], start: number, end: number, groupLabel: TaskStatus): Task[] => {
  const result = Array.from(list);
  const [removed] = result.splice(start, 1);

  result.splice(end, 0, { ...removed, status: groupLabel });

  return result;
};

const getGroupLabel = (group: TaskStatus) => {
  if (group.includes('-')) {
    return group.split('-').map(capitalize).join(' ');
  }

  return capitalize(group);
};

export const TaskList = () => {
  const [projectTasks, setProjectTasks] = useState(tasks);

  const onDragEnd: OnDragEndResponder = result => {
    // dropped outside the list
    if (!result.destination) return;
    const { source, destination } = result;

    const items = reorder(
      projectTasks,
      source.index,
      destination.index,
      destination.droppableId as TaskStatus
    );

    const state = { items };

    setProjectTasks(state.items);
  };

  const groupedTasks = useMemo<GroupedTask>(() => {
    const taskLookup = {} as GroupedTask;

    for (let i = 0; i < projectTasks.length; i++) {
      const projectTask = projectTasks[i];
      const issueGroup = taskLookup[projectTask.status];

      if (issueGroup === undefined) {
        taskLookup[projectTask.status] = {
          tasks: [],
          group: { label: getGroupLabel(projectTask.status), value: projectTask.status }
        };
      }

      taskLookup[projectTask.status].tasks.push(projectTask);
    }

    return taskLookup;
  }, [projectTasks]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="rounded-t-xl border border-muted-foreground/20">
        {keys(groupedTasks)
          .toSorted(a => {
            if (a === 'in-progress') return -1;
            if (a === 'todo') return 0;
            if (a === 'backlog') return 1;

            return 4;
          })
          .map(issueGroupKey => {
            return (
              <TaskListGroup
                key={issueGroupKey}
                taskGroup={groupedTasks[issueGroupKey].group}
                tasks={groupedTasks[issueGroupKey].tasks}
              />
            );
          })}
      </div>
    </DragDropContext>
  );
};
