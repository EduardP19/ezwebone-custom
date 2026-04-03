import { auditAgent } from "@/agents/audit";
import { emailAgent } from "@/agents/email";
import { prequalifyAgent } from "@/agents/prequalify";

type AgentRunner = {
  run: (input: unknown) => Promise<unknown>;
};

const agentRegistry = {
  prequalify: prequalifyAgent,
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
