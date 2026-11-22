export interface SeedLab {
  slug: string;
  name: string;
  description: string;
  website: string;
  logoUrl?: string;
  country: string;
  foundedYear: number;
}

export const labsData: SeedLab[] = [
  {
    slug: "openai",
    name: "OpenAI",
    description: "Pioneer in artificial general intelligence research and creator of GPT-4, o1 reasoning models, and DALL-E.",
    website: "https://openai.com",
    logoUrl: "/logos/openai.svg",
    country: "United States",
    foundedYear: 2015,
  },
  {
    slug: "anthropic",
    name: "Anthropic",
    description: "AI safety and research company known for Claude 3.5 Sonnet, constitutional AI, and steerable models.",
    website: "https://anthropic.com",
    logoUrl: "/logos/anthropic.svg",
    country: "United States",
    foundedYear: 2021,
  },
  {
    slug: "google-deepmind",
    name: "Google DeepMind",
    description: "Frontier research organization combining Google Brain and DeepMind, makers of Gemini 1.5, AlphaFold, and Gemma.",
    website: "https://deepmind.google",
    logoUrl: "/logos/google-deepmind.svg",
    country: "United Kingdom",
    foundedYear: 2010,
  },
  {
    slug: "meta-ai",
    name: "Meta AI",
    description: "Open source foundation model champion, creators of the Llama 3 family (8B, 70B, 405B) and PyTorch.",
    website: "https://ai.meta.com",
    logoUrl: "/logos/meta-ai.svg",
    country: "United States",
    foundedYear: 2013,
  },
  {
    slug: "mistral-ai",
    name: "Mistral AI",
    description: "European AI champion building efficient open-weights and commercial frontier models like Mistral Large 2 and Codestral.",
    website: "https://mistral.ai",
    logoUrl: "/logos/mistral-ai.svg",
    country: "France",
    foundedYear: 2023,
  },
  {
    slug: "deepseek",
    name: "DeepSeek",
    description: "High-performance open-architecture AI lab from China, creators of DeepSeek-V3, DeepSeek-Coder-V2, and MoE breakthroughs.",
    website: "https://deepseek.com",
    logoUrl: "/logos/deepseek.svg",
    country: "China",
    foundedYear: 2023,
  },
  {
    slug: "cohere",
    name: "Cohere",
    description: "Enterprise-focused generative AI platform developing Command R+, Embed v3, and multilingual RAG pipelines.",
    website: "https://cohere.com",
    logoUrl: "/logos/cohere.svg",
    country: "Canada",
    foundedYear: 2019,
  },
  {
    slug: "xai",
    name: "xAI",
    description: "Mission-driven AI lab building Grok 2 with real-time understanding and strong reasoning capabilities.",
    website: "https://x.ai",
    logoUrl: "/logos/xai.svg",
    country: "United States",
    foundedYear: 2023,
  },
  {
    slug: "qwen-alibaba",
    name: "Qwen (Alibaba)",
    description: "Alibaba's foundational model team delivering the world-class open-weights Qwen 2.5 series across language, math, and code.",
    website: "https://qwenlm.github.io",
    logoUrl: "/logos/qwen-alibaba.svg",
    country: "China",
    foundedYear: 2023,
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    description: "Global computing pioneer and creator of Microsoft Copilot, Azure AI foundation infrastructure, and the Phi small language model series.",
    website: "https://copilot.microsoft.com",
    logoUrl: "/logos/microsoft.svg",
    country: "United States",
    foundedYear: 1975,
  },
];
