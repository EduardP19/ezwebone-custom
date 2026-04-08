import { auditAgent } from "@/agents/audit";
import { emailAgent } from "@/agents/email";
import { prequalifyAgent } from "@/agents/prequalify";
import { prequalifyNewBusinessAgent } from "@/agents/prequalify-new-business";

type AgentRunner = {
  run: (input: unknown) => Promise<unknown>;
};

const agentRegistry = {
  prequalify: prequalifyAgent,
  prequalifyNewBusiness: prequalifyNewBusinessAgent,
  audit: auditAgent,
  email: emailAgent,
} satisfies Record<string, AgentRunner>;

export type AgentKey = keyof typeof agentRegistry;

export async function runAgent(agentKey: string, input: unknown) {
  const runner = agentRegistry[agentKey as AgentKey];

  if (!runner) {
    throw new Error(`Unknown agent: ${agentKey}`);
  }

  return runner.run(input);
}
