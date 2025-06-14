
import { MailPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Emails() {
  function handleSend() {
    toast({
      title: "Emails sent!",
      description: "Automated replenishment emails were sent to suppliers."
    });
  }

  return (
    <div className="max-w-screen-lg mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <MailPlus size={28} className="text-primary" />
        Email Automation
      </h2>
      <p className="text-lg text-muted-foreground mb-4">
        Manage and send automated replenishment emails to suppliers.
      </p>
      <button
        className="bg-primary text-primary-foreground px-5 py-3 rounded hover-scale text-lg flex items-center gap-2"
        onClick={handleSend}
      >
        <MailPlus size={20} />
        Send Test Email
      </button>
    </div>
  );
}
