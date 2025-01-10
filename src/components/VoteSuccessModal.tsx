import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface VoteSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export const VoteSuccessModal = ({ open, onClose }: VoteSuccessModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(true);

  useEffect(() => {
    if (open) {
      setIsSubmitting(true);
      const timer = setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] text-center p-6">
        <div className="flex flex-col items-center gap-4">
          {isSubmitting ? (
            <>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Submitting Vote...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we process your vote.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Vote Submitted!</h3>
                <p className="text-sm text-gray-500">
                  Thank you for voting. Your vote has been successfully recorded.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 