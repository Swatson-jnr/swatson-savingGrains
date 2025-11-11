import { Status } from "@/types";
import { Case, Default, Switch } from "react-if";
import { Badge } from "./ui/badge";

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Switch>
      <Case condition={status === "SUCCESSFUL"}>
        <Badge variant="success" className="text-xs">
          {status}
        </Badge>
      </Case>

      <Case condition={status === "FAILED" || status === "REJECTED"}>
        <Badge variant="danger" className="text-xs">
          {status}
        </Badge>
      </Case>

      <Case condition={status === "PENDING" || status === "PROCESSING"}>
        <Badge variant="warning" className="text-xs">
          {status}
        </Badge>
      </Case>

      <Default>
        <Badge>{status}</Badge>
      </Default>
    </Switch>
  );
}
