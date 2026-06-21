import { validateAndParseSchema } from "@/lib/seo";
import type { SeoFields } from "@/types/api";

export function JsonLd({ schema }: { schema: SeoFields["structure_schema"] }) {
  const parsed = validateAndParseSchema(schema);
  if (!parsed) return null;

  const schemas = Array.isArray(parsed) ? parsed : [parsed];

  return (
    <>
      {schemas.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
