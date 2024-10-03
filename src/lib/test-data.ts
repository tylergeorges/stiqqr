import type { Member, Project, User } from '@/types';
import { Task, TaskLabel } from '@/types/project';

export const user1: User = {
  id: 'ewfr23f21',
  username: 'kneadle'
};

export const user2: User = {
  id: '12432fdsfsd',
  username: 'snoozie'
};

export const user3: User = {
  id: 'sdfabt544d',
  username: 'tyler'
};

export const user4: User = {
  id: 'gbretg34bgf',
  username: 'rexwuzhere'
};

export const member1: Member = {
  ...user1
};

export const member2: Member = {
  ...user2
};

export const member3: Member = {
  ...user3
};

export const member4: Member = {
  ...user4
};

export const project1: Project = {
  name: 'test project',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita laborum omnis velit! Adipisci maiores corrupti quis aspernatur minus cum voluptatum sapiente provident labore eligendi, tenetur praesentium eius necessitatibus culpa consequuntur!',
  members: [member1],
  id: '12489td9f0gdsgus'
};

export const project2: Project = {
  name: 'project #2',
  description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita laborum omnis ',
  members: [member2, member3],
  id: '09-980238r970fdhuio'
};

export const project3: Project = {
  name: 'every member welcome to the party!',
  description:
    'project with every member in it. Adipisci maiores corrupti quis aspernatur minus cum voluptatum sapiente provident ',
  members: [member1, member2, member3, member4],
  id: 'oigkhfdmmmfg9090!'
};

export const project4: Project = {
  name: 'ewr23 member welcome to the party!',
  description:
    'project with every member in it. Adipisci maiores corrupti quis aspernatur minus cum voluptatum sapiente providentproject with every member in it. Adipisci maiores corrupti quis aspernatur minus cum voluptatum sapiente providentproject with every member in it. Adipisci maiores corrupti quis aspernatur minus cum voluptatum sapiente provident ',
  members: [member1, member2, member3, member4],
  id: 'oigkhfdm32423423mmfg9090!'
};

export const projects = [project1, project2, project3, project4];

const issueCreatedAt = new Date();

const bugLabel: TaskLabel = {
  color: 'rgb(235, 87, 87)',
  value: 'Bug'
};

const featureLabel: TaskLabel = {
  color: 'rgb(187, 135, 252)',
  value: 'Feature'
};

const improvementLabel: TaskLabel = {
  color: 'rgb(78, 167, 252)',
  value: 'Improvement'
};

export const task1: Task = {
  createdAt: issueCreatedAt,
  updatedAt: issueCreatedAt,
  labels: [bugLabel],
  members: [member1],
  name: 'Fix bug where lorem ipsum fdsfsafsad fdsfasdfsa.',
  status: 'todo',
  project: project1
};

export const task2: Task = {
  createdAt: issueCreatedAt,
  updatedAt: issueCreatedAt,
  labels: [featureLabel],
  members: [member3],
  name: 'Add draggable list lorem ipsum fdsfsafsad fdsfasdfsa.',
  status: 'todo',
  project: project1
};

export const task3: Task = {
  createdAt: issueCreatedAt,
  updatedAt: issueCreatedAt,
  labels: [improvementLabel, bugLabel],
  members: [member1, member2, member3],
  name: 'Improve design lorem ipsum fdsfsafsad fdsfasdfsa.',
  status: 'in-progress',
  project: project1
};

export const tasks = [task1, task2, task3];
