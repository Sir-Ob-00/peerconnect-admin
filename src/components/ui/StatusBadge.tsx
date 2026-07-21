import React from 'react';
import { Badge } from './Badge';

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  
  if (normalized === 'active' || normalized === 'completed' || normalized === 'accepted' || normalized === 'approved') {
    return <Badge variant="success">{status}</Badge>;
  }
  if (normalized === 'pending') {
    return <Badge variant="warning">{status}</Badge>;
  }
  if (normalized === 'suspended' || normalized === 'rejected' || normalized === 'cancelled' || normalized === 'dismissed') {
    return <Badge variant="danger">{status}</Badge>;
  }
  return <Badge variant="default">{status}</Badge>;
}
