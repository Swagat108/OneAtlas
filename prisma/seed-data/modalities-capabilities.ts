export const modalitiesData = [
  { slug: "text", name: "Text", description: "Natural language input and generated prose, code, and structured output." },
  { slug: "image", name: "Image", description: "Static raster and vector imagery processing or generation." },
  { slug: "audio", name: "Audio", description: "Speech-to-text, audio analysis, or synthesized voice audio stream." },
  { slug: "video", name: "Video", description: "Video frames and sequential visual temporal input or output." },
  { slug: "code", name: "Code", description: "Specialized syntax, AST understanding, and program generation." },
  { slug: "file", name: "File / PDF", description: "Documents, PDFs, spreadsheets, and complex file parsing." },
];

export const capabilitiesData = [
  { slug: "function-calling", name: "Function Calling", description: "Structured JSON schema tool calling and execution feedback." },
  { slug: "json-mode", name: "JSON Mode", description: "Guaranteed valid RFC 8259 JSON output syntax." },
  { slug: "reasoning", name: "Chain-of-Thought Reasoning", description: "Extended deliberate test-time compute thinking tokens before final answer." },
  { slug: "streaming", name: "Token Streaming", description: "Server-Sent Events (SSE) real-time token streaming." },
  { slug: "vision", name: "Vision Analysis", description: "Optical character recognition, image reasoning, and chart parsing." },
  { slug: "tool-use", name: "Multi-step Tool Use", description: "Autonomous iterative invocation of external API tools." },
  { slug: "code-interpreter", name: "Code Execution Sandbox", description: "Integrated sandboxed Python/JS execution." },
  { slug: "prompt-caching", name: "Prompt Caching", description: "KV-cache reuse for repeated prefixes reducing latency and cost." },
  { slug: "fine-tunable", name: "Fine-Tunable", description: "Supports LoRA or full-parameter custom fine-tuning." },
];
