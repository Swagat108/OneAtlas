# Brand Logos Attribution & Licensing — OneAtlas

All brand logos and trademarks in OneAtlas are the property of their respective owners and are used strictly for nominative identification and informational reference purposes under fair use.

Official vector SVG assets are sourced from [`@lobehub/icons`](https://github.com/lobehub/lobe-icons) (licensed under the **MIT License**) and official brand assets.

---

## 1. AI Research Labs

| Lab Name | Slug | Vector Asset | Source | License |
|---|---|---|---|---|
| **OpenAI** | `openai` | `/logos/openai.svg` | `@lobehub/icons` (`OpenAI/Mono`) | MIT / Brand Guidelines |
| **Anthropic** | `anthropic` | `/logos/anthropic.svg` | `@lobehub/icons` (`Anthropic/Mono`) | MIT / Brand Guidelines |
| **Google DeepMind** | `google-deepmind` | `/logos/google-deepmind.svg` | `@lobehub/icons` (`DeepMind/Color`) | MIT / Google Brand Resource Center |
| **Meta AI** | `meta-ai` | `/logos/meta-ai.svg` | `@lobehub/icons` (`Meta/Color`) | MIT / Meta Brand Center |
| **Mistral AI** | `mistral-ai` | `/logos/mistral-ai.svg` | `@lobehub/icons` (`Mistral/Color`) | MIT / Mistral AI Press Kit |
| **DeepSeek** | `deepseek` | `/logos/deepseek.svg` | `@lobehub/icons` (`DeepSeek/Color`) | MIT / DeepSeek AI |
| **Cohere** | `cohere` | `/logos/cohere.svg` | `@lobehub/icons` (`Cohere/Color`) | MIT / Cohere Brand Kit |
| **xAI** | `xai` | `/logos/xai.svg` | `@lobehub/icons` (`Grok/Mono`) | MIT / xAI Press Assets |
| **Qwen (Alibaba)** | `qwen-alibaba` | `/logos/qwen-alibaba.svg` | `@lobehub/icons` (`Qwen/Color`) | MIT / Alibaba Cloud Brand |
| **Microsoft** | `microsoft` | `/logos/microsoft.svg` | `@lobehub/icons` (`Microsoft/Color`) | MIT / Microsoft Brand Central |
| **Microsoft Copilot** | `microsoft-copilot` | `/logos/copilot.svg` | `@lobehub/icons` (`Copilot/Color`) | MIT / Microsoft Copilot Brand |

---

## 2. Cloud AI Hosting Providers

| Provider Name | Slug | Vector Asset | Source | License |
|---|---|---|---|---|
| **OpenAI Direct** | `openai-api` | `/logos/openai.svg` | `@lobehub/icons` (`OpenAI/Mono`) | MIT / Brand Guidelines |
| **Anthropic Console** | `anthropic-api` | `/logos/anthropic.svg` | `@lobehub/icons` (`Anthropic/Mono`) | MIT / Brand Guidelines |
| **Google Vertex AI** | `google-vertex-ai` | `/logos/google-vertex-ai.svg` | `@lobehub/icons` (`Google/Color`) | MIT / Google Cloud Brand |
| **Groq** | `groq` | `/logos/groq.svg` | `@lobehub/icons` (`Groq/Mono`) | MIT / Groq Press Kit |
| **Together AI** | `together-ai` | `/logos/together-ai.svg` | `@lobehub/icons` (`Together/Color`) | MIT / Together AI Brand Kit |
| **Fireworks AI** | `fireworks-ai` | `/logos/fireworks-ai.svg` | `@lobehub/icons` (`Fireworks/Color`) | MIT / Fireworks AI Assets |
| **AWS Bedrock** | `aws-bedrock` | `/logos/aws-bedrock.svg` | `@lobehub/icons` (`Bedrock/Color`) | MIT / Amazon Web Services |
| **Azure AI Studio** | `azure-openai` | `/logos/azure-openai.svg` | `@lobehub/icons` (`Azure/Color`) | MIT / Microsoft Brand Central |
| **DeepSeek API** | `deepseek-api` | `/logos/deepseek.svg` | `@lobehub/icons` (`DeepSeek/Color`) | MIT / DeepSeek AI |

---

## 3. Fallback Mechanism

If any new or unindexed model, lab, or provider lacks a stored `logoUrl` or fails network retrieval, `<BrandLogo />` dynamically falls back to an **accessible initials avatar**:
- Generates 1–2 uppercase letters from the entity name.
- Computes a deterministic high-contrast background color from the string hash (selected from accessible Tailwind palettes: Blue, Emerald, Indigo, Purple, Amber, Rose, Cyan, Slate).
- Guarantees zero layout shift with fixed-dimension CSS bounding boxes.
