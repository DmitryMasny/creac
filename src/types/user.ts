import { ComponentNode } from './componentNode';

interface ProfileData {
  name: string;
}

export interface ProjectData {
  id: string;
  title: string;
  nodes: Record<string, ComponentNode>;
  components: Record<string, ComponentNode>;
  updated: string;
  config: { type: string };
}

export interface UserData {
  projects: ProjectData[];
  profile: ProfileData;
}
