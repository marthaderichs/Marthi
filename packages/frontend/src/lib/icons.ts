import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const getIcon = (name: string | undefined): LucideIcon => {
  if (!name) return Icons.HelpCircle;
  const Icon = (Icons as any)[name];
  return Icon || Icons.HelpCircle;
};
