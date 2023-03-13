import { useQuery } from "react-query";
import { useOptimisticMutation } from "../../core/useOptimisticMutation";
import { longServer } from "../../fakeServer";
import { BreakpointsControl, TargetTemperatureControl } from "../../ui";

const server = longServer;

const nope = () => new Promise(() => {});

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
          onAdd={nope}
          onDelete={nope}
          breakpoints={breakpoints}
        />
      )}
    </span>
  );
};
