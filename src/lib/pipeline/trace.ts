import { TraceStage, TraceStageKind, TraceStageStatus } from "@/lib/contracts/trace";

export class TraceCollector {
  private stages: TraceStage[] = [];

  record(stage: TraceStage): void {
    this.stages.push(stage);
  }

  async runStage<T>(
    name: string,
    kind: TraceStageKind,
    fn: () => Promise<{ result: T; detail: string; itemsIn?: number; itemsOut?: number; status?: TraceStageStatus }>
  ): Promise<T> {
    const startedAt = Date.now();
    try {
      const { result, detail, itemsIn, itemsOut, status = "ok" } = await fn();
      const durationMs = Date.now() - startedAt;

      this.record({
        name,
        status,
        startedAt,
        durationMs,
        kind,
        detail,
        itemsIn,
        itemsOut,
      });

      return result;
    } catch (err) {
      const durationMs = Date.now() - startedAt;
      this.record({
        name,
        status: "failed",
        startedAt,
        durationMs,
        kind,
        detail: `Error in ${name}: ${(err as Error).message}`,
      });
      throw err;
    }
  }

  getStages(): TraceStage[] {
    return [...this.stages];
  }
}
