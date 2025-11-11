import { Card } from "@/components/ui/card";
import { LayoutProps } from "@/types";
import { AppLayout } from "./app";
import useLocation from "@/hooks/location";

export function GrainTransfersLayout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <>
      <AppLayout>
        <div className="container px-8">
          <h4 className="mb-5 text-lg font-semibold">Grain Transfers</h4>
          <div>
            <Card className="rounded-0 p-4">
              <section>{children}</section>
            </Card>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
