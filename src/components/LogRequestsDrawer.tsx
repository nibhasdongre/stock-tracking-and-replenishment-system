
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

type LogRequest = {
  id: string;
  description: string;
  change: string;
  status: "pending" | "approved" | "rejected";
};

type LogRequestsDrawerProps = {
  open: boolean;
  requests: LogRequest[];
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export default function LogRequestsDrawer({ open, requests, onClose, onApprove, onReject }: LogRequestsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Log Requests</DrawerTitle>
        </DrawerHeader>
        <div className="max-h-72 overflow-y-auto px-4 py-2">
          {requests.length === 0 && <div className="text-muted-foreground text-center">No log requests.</div>}
          <ul>
            {requests.map(req => (
              <li key={req.id} className="border-b py-3 flex flex-col gap-2">
                <div>
                  <span className="font-semibold">{req.description}</span>
                  <div className="text-xs text-cosmic-blue">{req.change}</div>
                </div>
                {req.status === "pending" && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onApprove(req.id)}>Approve</Button>
                    <Button variant="destructive" onClick={() => onReject(req.id)}>Reject</Button>
                  </div>
                )}
                {req.status !== "pending" && (
                  <span className={`text-xs ${req.status === "approved" ? "text-green-400" : "text-red-400"}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <DrawerFooter>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
