"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

const EXAMPLE_DISPUTES = [
  {
    label: "Fuel surcharge overcharge",
    message: `Hi, I'm Maria Chen from FastFreight Logistics. We received invoice INV-002 and we're disputing the fuel surcharge. You've billed us 24% but our contract clearly states a maximum cap of 20%. The base freight was $2,500 so the overcharge is significant. Please review and issue a credit.`,
  },
  {
    label: "Detention charge dispute",
    message: `This is James Okafor at Pacific Container Lines. Invoice inv-003 includes a detention charge of $65 that we believe is incorrect. Our driver was in and out in under an hour — well within the free detention window in our contract. Please investigate.`,
  },
  {
    label: "Valid detention (Scenario 1)",
    message: `Hi, FastFreight here. We received invoice inv-001 and want to dispute the detention charge of $150. Can you verify this against our shipment records?`,
  },
];

interface DisputeInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onExampleClick: (message: string) => void;
  isLoading: boolean;
}

export function DisputeInput({
  inputValue,
  onInputChange,
  onSubmit,
  onExampleClick,
  isLoading,
}: DisputeInputProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur sticky bottom-0">
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground self-center mr-1">
            Try an example:
          </span>
          {EXAMPLE_DISPUTES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => onExampleClick(ex.message)}
              disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ex.label}
            </button>
          ))}
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Describe your invoice dispute…"
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
