import type { BoundaryNode } from "../../../../entities/network";

import { SinkPanel } from "./SinkPanel";
import { SourcePanel } from "./SourcePanel";

export function BoundaryNodePanel({ node }: { node: BoundaryNode }) {
  if (node.role.kind === "source") {
    return <SourcePanel node={node} role={node.role} />;
  }

  return <SinkPanel node={node} role={node.role} />;
}
