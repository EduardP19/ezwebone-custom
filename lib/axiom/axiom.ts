import { Axiom } from "@axiomhq/js";

export function getAxiomDataset() {
  const candidates = [
    process.env.AXIOM_DATA_SET,
    process.env.AXIOM_DATASET,
    process.env.NEXT_PUBLIC_AXIOM_DATASET,
  ];

  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return "nextjs-console";
}

const token = process.env.AXIOM_API_KEY?.trim();

export const axiomClient = token ? new Axiom({ token }) : null;
