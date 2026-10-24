import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JsonLd } from "./JsonLd";

describe("JsonLd", () => {
  it("ajoute le contexte schema.org et neutralise une balise de fermeture", () => {
    const { container } = render(
      <JsonLd donnees={{ "@type": "Product", name: "</script><script>alert(1)</script>" }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.innerHTML).not.toContain("</script>");
    expect(JSON.parse(script?.textContent ?? "")).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "</script><script>alert(1)</script>",
    });
  });
});
