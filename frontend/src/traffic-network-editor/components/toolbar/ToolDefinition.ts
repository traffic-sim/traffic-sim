import type React from "react";

import type { EditorTool } from "../../model/EditorTool";

export interface ToolDefinition {
  id: EditorTool;
  key: string;
  title: string;
  icon: React.ReactNode;
}
