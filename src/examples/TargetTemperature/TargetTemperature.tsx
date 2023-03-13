import { useQuery } from "react-query";
import { useOptimisticMutation } from "../../core/useOptimisticMutation";
import { longServer } from "../../fakeServer";
import { TargetTemperatureControl } from "../../ui";

const server = longServer;

export const TargetTemperature = () => {
  const { data: temperature, isLoading } = useQuery("temperature", () =>
    server.get("temperature")
  );

  const { mutateAsync: setTemperature } = useOptimisticMutation(
    (nextTemperature: number) => server.put("temperature", nextTemperature),
    "temperature"
  );

  if (isLoading) return <>Loading</>;

  return (
    <TargetTemperatureControl
      increment={() => {
        setTemperature(temperature! + 1);
      }}
      decrement={() => {
        setTemperature(temperature! - 1);
      }}
      current={temperature!}
    />
  );
};
