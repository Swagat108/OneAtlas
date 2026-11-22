# Feature: AI Models Discovery & Catalog

- **Domain:** Model Catalog & Single-Model Intelligence
- **Routes:** \/models\, \/models/[slug]\, \/api/models\, \/api/models/[slug]\
- **Key Components:** \ModelCard.tsx\, \ModelListItem.tsx\, \useModels\, \useModelDetail\
- **Database Tables:** \Model\, \Lab\, \ModelProvider\, \Capability\, \InputModality\, \OutputModality\
- **Capabilities:**
  1. Multi-faceted filtering across Labs, Providers, Modalities, Architectures, and Context Window sizes.
  2. Live dual-layout view: Responsive Fluid Grid (2-4 columns) and Linear Compact List view.
  3. Real-time token pricing calculations normalized to USD per 1M tokens.
  4. Single-model deep dive spec sheet with supported modalities, capabilities, provider economics, and benchmark performance.
