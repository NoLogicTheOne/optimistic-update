import { useQuery } from "react-query";
import { useOptimisticMutation } from "../../core/useOptimisticMutation";
import { longServer } from "../../fakeServer";
import { Breakpoint } from "../../types";
import { BreakpointsControl } from "../../ui";

const server = longServer;

export const TargetTemperature = () => {
  const { data: breakpoints, isLoading } = useQuery("breakpoints", () =>
    server.get("breakpoints")
  );

  const { mutateAsync: addBreakpoint } = useOptimisticMutation(
    (nextBreakpoint: Breakpoint) => server.post("breakpoints", nextBreakpoint),
    {
      queryKey: "breakpoints",
      transformFunc: (nextData) => [...(breakpoints || []), nextData],
    }
  );

  const { mutateAsync: deleteBreakpoint } = useOptimisticMutation(
    (id: string) => server.delete("breakpoints", id),
    {
      queryKey: "breakpoints",
      transformFunc: (id) => (breakpoints || [])?.filter((bp) => bp.id !== id),
    }
  );

  if (isLoading) return <>Loading</>;

  return (
    <span>
      {breakpoints && (
        <BreakpointsControl
          onAdd={addBreakpoint}
          onDelete={deleteBreakpoint}
          breakpoints={breakpoints}
        />
      )}
    </span>
  );
};
