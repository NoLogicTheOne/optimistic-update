import { useMutation, useQuery } from "react-query";
import { fastServer } from "../../fakeServer";
import { TargetTemperatureControl } from "../../ui";

const server = fastServer;

export const TargetTemperature = () => {
  const { data: temperature, isLoading } = useQuery("temperature", () =>
    server.get("temperature")
  );

  const { mutateAsync: setTemperature } = useMutation(
    (nextTemperature: number) => server.put("temperature", nextTemperature)
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
