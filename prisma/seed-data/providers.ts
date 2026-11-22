export interface SeedProvider {
  slug: string;
  name: string;
  website: string;
  regions: string[];
  description: string;
  logoUrl?: string;
}

export const providersData: SeedProvider[] = [
  {
    slug: "openai-api",
    name: "OpenAI Direct",
    website: "https://platform.openai.com",
    regions: ["us-east-1", "us-west-2", "eu-central-1"],
    description: "Direct official API endpoint with earliest feature access, Batch API discounts, and fine-tuning support.",
    logoUrl: "/logos/openai.svg",
  },
  {
    slug: "anthropic-api",
    name: "Anthropic Console",
    website: "https://console.anthropic.com",
    regions: ["us-east-1", "us-west-2"],
    description: "First-party API for Claude models with prompt caching and computer-use capabilities.",
    logoUrl: "/logos/anthropic.svg",
  },
  {
    slug: "google-vertex-ai",
    name: "Google Vertex AI",
    website: "https://cloud.google.com/vertex-ai",
    regions: ["us-central1", "europe-west1", "asia-east1", "global"],
    description: "Google Cloud enterprise platform hosting Gemini, Gemma, and third-party partner models with SLA guarantees.",
    logoUrl: "/logos/google-vertex-ai.svg",
  },
  {
    slug: "groq",
    name: "Groq",
    website: "https://groq.com",
    regions: ["us-west-1", "us-east-1"],
    description: "LPU inference engine offering unprecedented token generation speeds (200-400 tokens/sec) for open models.",
    logoUrl: "/logos/groq.svg",
  },
  {
    slug: "together-ai",
    name: "Together AI",
    website: "https://together.ai",
    regions: ["us-central", "us-east", "eu-west"],
    description: "Leading decentralized cloud for open-weights AI inference, custom fine-tuning, and dedicated endpoints.",
    logoUrl: "/logos/together-ai.svg",
  },
  {
    slug: "fireworks-ai",
    name: "Fireworks AI",
    website: "https://fireworks.ai",
    regions: ["us-east", "us-west"],
    description: "Speed-optimized cloud inference runtime for compound AI systems and open-weights models.",
    logoUrl: "/logos/fireworks-ai.svg",
  },
  {
    slug: "aws-bedrock",
    name: "AWS Bedrock",
    website: "https://aws.amazon.com/bedrock",
    regions: ["us-east-1", "us-west-2", "eu-west-1", "ap-northeast-1"],
    description: "Fully managed enterprise service offering foundation models from Anthropic, Meta, Mistral, and Amazon Titan.",
    logoUrl: "/logos/aws-bedrock.svg",
  },
  {
    slug: "azure-openai",
    name: "Azure AI Studio",
    website: "https://azure.microsoft.com/en-us/products/ai-services/openai-service",
    regions: ["eastus", "westus", "westeurope", "southeastasia"],
    description: "Microsoft cloud hosting OpenAI GPT models and open models with enterprise compliance and VNet isolation.",
    logoUrl: "/logos/azure-openai.svg",
  },
  {
    slug: "deepseek-api",
    name: "DeepSeek API",
    website: "https://platform.deepseek.com",
    regions: ["global", "ap-southeast"],
    description: "Direct official API offering ultra-low cost token pricing with cache hit discounts.",
    logoUrl: "/logos/deepseek.svg",
  },
];
