import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DemoDashboard() {
  return (
    <div className="flex flex-col min-h-[60vh] justify-center space-y-8 w-full animate-in fade-in slide-in-from-bottom-[10px] duration-700 max-w-3xl mx-auto pt-8 pb-16">
      <div className="text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto shadow-sm ring-1 ring-primary/20">
          <span className="text-3xl">⚖️</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Logistics dispute agent
          </h2>
          <p className="text-muted-foreground text-[15px] max-w-xl mx-auto text-balance">
            Resolving an invoice dispute traditionally takes 30-60 minutes
            across multiple systems. See how the agent uses step-by-step
            reasoning to automate the workflow in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        <Card className="border-border/60 shadow-none bg-muted/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[15px] text-muted-foreground font-medium">
                Manual workflow
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-0 text-xs font-medium"
              >
                ~45 mins
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li className="flex gap-3 items-start">
                <span className="text-orange-500/70 mt-0.5 shrink-0">•</span>
                <span>Read dispute email from customer</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-orange-500/70 mt-0.5 shrink-0">•</span>
                <span>Pull invoice from accounting system</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-orange-500/70 mt-0.5 shrink-0">•</span>
                <span>Check timeline via tracking system</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-orange-500/70 mt-0.5 shrink-0">•</span>
                <span>Look up contract terms (PDFs/Drive)</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-orange-500/70 mt-0.5 shrink-0">•</span>
                <span>Manually calculate & validate charges</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-orange-500/70 mt-0.5 shrink-0">•</span>
                <span>Draft response & update CRM</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md ring-1 ring-primary/10 bg-linear-to-br from-primary/5 via-card to-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[50px] rounded-full mix-blend-multiply pointer-events-none" />
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[15px] font-medium text-primary">
                Agent workflow
              </CardTitle>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 text-xs font-medium">
                Autonomous
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <ul className="space-y-3.5 text-sm text-foreground/90">
              <li className="flex gap-3 items-start">
                <span className="text-primary mt-0.5 text-sm leading-none shrink-0 font-bold">
                  ✓
                </span>
                <span>Understands context instantly</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-primary mt-0.5 text-sm leading-none shrink-0 font-bold">
                  ✓
                </span>
                <span>
                  <strong>Cross-system reasoning:</strong> Automatically acts
                  across Accounting, Tracking & CRM
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-primary mt-0.5 text-sm leading-none shrink-0 font-bold">
                  ✓
                </span>
                <span>Extracts exact contractual terms</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-primary mt-0.5 text-sm leading-none shrink-0 font-bold">
                  ✓
                </span>
                <span>Validates logic & calculates credits</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-primary mt-0.5 text-sm leading-none shrink-0 font-bold">
                  ✓
                </span>
                <span>Drafts evidence-backed response</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
