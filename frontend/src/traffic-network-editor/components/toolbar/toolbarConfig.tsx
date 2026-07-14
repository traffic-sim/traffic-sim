import { EditorTool } from "../../model/EditorTool";

import type { ToolDefinition } from "./ToolDefinition";

export const TOOLS: ToolDefinition[] = [
  {
    id: EditorTool.Select,
    key: "V",
    title: "Select (V)\nClick to select a road or node.\nDelete key removes selection.",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2.5 2l9 5.5-5 1-1.5 4.5L2.5 2z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: EditorTool.Draw,
    key: "R",
    title:
      "Draw Road (R)\nClick to place a point.\nClick a second point to connect it.\nClick the same point to cancel.",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 12C4 8 8 6 12 3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="2" cy="12" r="1.6" fill="currentColor" />
        <circle cx="12" cy="3" r="1.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: EditorTool.Pan,
    key: "H",
    title: "Pan (H)\nDrag to pan the canvas.",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 1v12M1 7h12M3.5 3.5L1 7l2.5 3.5M10.5 3.5L13 7l-2.5 3.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];
