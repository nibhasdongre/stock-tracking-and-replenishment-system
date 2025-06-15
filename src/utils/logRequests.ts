
export type LogRequest = {
  id: string;
  description: string;
  change: string;
  status: "pending" | "approved" | "rejected";
};

const STORAGE_KEY = "log-requests";

export function getLogRequests(): LogRequest[] {
  const vals = localStorage.getItem(STORAGE_KEY);
  if (!vals) return [];
  try {
    return JSON.parse(vals);
  } catch {
    return [];
  }
}

export function addLogRequest(req: LogRequest) {
  const logs = getLogRequests();
  logs.push(req);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}
export function setLogRequests(all: LogRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
