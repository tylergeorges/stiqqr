'use client';

import { ColumnDef } from '@tanstack/react-table';

import type { Task } from '@/lib/db/queries/project';

import { DataTableColumnHeader } from './data-table-column-header';
import { TaskStatusIndicator } from '@/components/task-status-indicator';
import { taskStatuses } from '@/components/status-switcher';

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Task" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      console.log(row);
      // const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          <TaskStatusIndicator status={row.original.status} />

          <span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = taskStatuses.find(status => status.value === row.getValue('status'));

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <TaskStatusIndicator status={row.original.status} />

          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />
  // }
];
