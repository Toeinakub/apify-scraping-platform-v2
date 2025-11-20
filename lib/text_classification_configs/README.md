# SA Text Classification Config

This zip contains two main folders for your scraping / marketing analytics project:

- `general/` — keyword config + helper for **Facebook Groups / General user posts**
- `competitor/` — keyword config + helper for **Competitor Facebook Pages / Brand posts**

## Structure

- `general/classification.ts`
  - Enums: `PostIntent`, `HouseZone`, `PainPointTag`, `MaterialCategory`, `DesignStyleTag`, `JourneyStage`, `PersonaType`
  - Keyword dictionaries: `POST_INTENT_KEYWORDS`, `HOUSE_ZONE_KEYWORDS`, etc.
  - Helper: `classifyGeneralText(text)` → returns `ClassifiedPostMeta`

- `competitor/classification.ts`
  - Enums: `PagePostGoal`, `ValuePropTag`, `PromoMechanic`, `ChannelTag`, `CTAType`
  - Keyword dictionaries: `PAGE_POST_GOAL_KEYWORDS`, `VALUE_PROP_KEYWORDS`, etc.
  - Helper: `classifyPageText(text)` → returns `ClassifiedPagePostMeta`

You can import these into your Next.js / Node project and Vibe Coding further:
- add weighting / priority rules
- connect to your scraped JSON
- store `ClassifiedPostMeta` into your DB for dashboards.