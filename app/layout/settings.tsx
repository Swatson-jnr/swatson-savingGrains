import { SettingsHeader } from "@/components/includes/settings-header";
import { Card } from "@/components/ui/card";
import { LayoutProps } from "@/types";
import { AppLayout } from "./app";

export function SettingsLayout({ children }: LayoutProps) {
  return (
    <>
      <AppLayout>
        <div className="container px-8">
          <h4 className="mb-5 text-lg font-semibold">Settings</h4>

          <div>
            <SettingsHeader />

            <Card className="rounded-0 p-4">
              <section>{children}</section>
            </Card>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
