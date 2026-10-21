import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Prix } from "./Prix";

describe("Prix", () => {
  it("affiche le prix seul hors promotion", () => {
    render(<Prix prix={5000} />);
    expect(screen.getByText(/5\s000\sFCFA/)).toBeInTheDocument();
    expect(screen.queryByText(/Prix habituel/)).not.toBeInTheDocument();
  });

  it("affiche le prix promo et barre l'ancien prix", () => {
    render(<Prix prix={5000} prixPromo={4000} />);
    expect(screen.getByText(/Prix promotionnel/).parentElement).toHaveTextContent(/4\s000\sFCFA/);
    expect(screen.getByText(/Prix habituel/).closest("s")).toHaveTextContent(/5\s000\sFCFA/);
  });

  it("ignore un prix promo supérieur ou égal au prix", () => {
    render(<Prix prix={5000} prixPromo={5000} />);
    expect(screen.queryByText(/Prix habituel/)).not.toBeInTheDocument();
  });
});
