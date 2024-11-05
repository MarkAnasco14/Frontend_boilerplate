export interface ActivityLog {
  actionType: string;
  ipAddress: string;
  browserInfo: string;
  details: string;
  timestamp: string;
}

export default ActivityLog;