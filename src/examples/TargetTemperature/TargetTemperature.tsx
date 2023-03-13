import { useQuery } from "react-query";
import { useOptimisticMutation } from "../../core/useOptimisticMutation";
import { longServer } from "../../fakeServer";
import { Breakpoint } from "../../types";
import { BreakpointsControl, TargetTemperatureControl } from "../../ui";

const server = longServer;

export const TargetTemperature = () => {
  const { data: temperature, isLoading } = useQuery("temperature", () =>
    server.get("temperature")
  );
  const { data: breakpoints } = useQuery("breakpoints", () =>
    server.get("breakpoints")
  );

  const { mutateAsync: setTemperature } = useOptimisticMutation(
    (nextTemperature: number) => server.put("temperature", nextTemperature),
    "temperature"
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
      <TargetTemperatureControl
        increment={() => {
          setTemperature(temperature! + 1);
        }}
        decrement={() => {
          setTemperature(temperature! - 1);
        }}
        current={temperature}
      />
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
