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
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80",
    country: "United States",
    foundedYear: 2015,
  },
  {
    slug: "anthropic",
    name: "Anthropic",
    description: "AI safety and research company known for Claude 3.5 Sonnet, constitutional AI, and steerable models.",
    website: "https://anthropic.com",
    logoUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&q=80",
    country: "United States",
    foundedYear: 2021,
  },
  {
    slug: "google-deepmind",
    name: "Google DeepMind",
    description: "Frontier research organization combining Google Brain and DeepMind, makers of Gemini 1.5, AlphaFold, and Gemma.",
    website: "https://deepmind.google",
    logoUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&q=80",
    country: "United Kingdom",
    foundedYear: 2010,
  },
  {
    slug: "meta-ai",
    name: "Meta AI",
    description: "Open source foundation model champion, creators of the Llama 3 family (8B, 70B, 405B) and PyTorch.",
    website: "https://ai.meta.com",
    logoUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=128&q=80",
    country: "United States",
    foundedYear: 2013,
  },
  {
    slug: "mistral-ai",
    name: "Mistral AI",
    description: "European AI champion building efficient open-weights and commercial frontier models like Mistral Large 2 and Codestral.",
    website: "https://mistral.ai",
    logoUrl: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=128&q=80",
    country: "France",
    foundedYear: 2023,
  },
  {
    slug: "deepseek",
    name: "DeepSeek",
    description: "High-performance open-architecture AI lab from China, creators of DeepSeek-V3, DeepSeek-Coder-V2, and MoE breakthroughs.",
    website: "https://deepseek.com",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80",
    country: "China",
    foundedYear: 2023,
  },
  {
    slug: "cohere",
    name: "Cohere",
    description: "Enterprise-focused generative AI platform developing Command R+, Embed v3, and multilingual RAG pipelines.",
    website: "https://cohere.com",
    logoUrl: "https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=128&q=80",
    country: "Canada",
    foundedYear: 2019,
  },
  {
    slug: "xai",
    name: "xAI",
    description: "Mission-driven AI lab building Grok 2 with real-time understanding and strong reasoning capabilities.",
    website: "https://x.ai",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80",
    country: "United States",
    foundedYear: 2023,
  },
  {
    slug: "qwen-alibaba",
    name: "Qwen (Alibaba)",
    description: "Alibaba's foundational model team delivering the world-class open-weights Qwen 2.5 series across language, math, and code.",
    website: "https://qwenlm.github.io",
    logoUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=128&q=80",
    country: "China",
    foundedYear: 2023,
  },
];
