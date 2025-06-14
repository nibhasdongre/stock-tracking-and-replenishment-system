
import { MailPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import StarBackground from "@/components/StarBackground";

export default function Emails() {
  function handleSend() {
    toast({
      title: "Emails sent!",
      description: "Automated replenishment emails were sent to suppliers.",
    });
  }

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <StarBackground />
      <div className="relative z-10 max-w-screen-lg mx-auto px-6 py-10 bg-black/70 rounded-lg shadow border border-cosmic-blue">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-cosmic-blue">
          <MailPlus size={28} className="text-cosmic-gold" />
          Email Automation
        </h2>
        <p className="text-lg text-slate-200 mb-4">
          Manage and send automated replenishment emails to suppliers.
        </p>
        <button
          className="bg-cosmic-blue text-cosmic-gold px-5 py-3 rounded hover-scale text-lg flex items-center gap-2"
          onClick={handleSend}
        >
          <MailPlus size={20} />
          Send Test Email
        </button>
      </div>
    </div>
  );
}
