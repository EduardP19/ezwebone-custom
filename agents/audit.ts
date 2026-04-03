export const auditAgent = {
  async run(input: unknown) {
    return {
      agent: "audit",
      status: "ok",
      findings: [
        "Booking journey has friction on mobile.",
        "Follow-up automation opportunities detected.",
        "Homepage CTA hierarchy can be improved.",
      ],
      summary: "Mock audit completed.",
      input,
    };
  },
};
