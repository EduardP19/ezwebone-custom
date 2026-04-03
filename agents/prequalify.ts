export const prequalifyAgent = {
  async run(input: unknown) {
    return {
      agent: "prequalify",
      status: "ok",
      qualified: true,
      score: 82,
      summary: "Mock prequalification completed.",
      input,
    };
  },
};
