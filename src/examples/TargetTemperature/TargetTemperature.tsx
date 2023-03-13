import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { longServer } from "../../fakeServer";
import { TargetTemperatureControl } from "../../ui";

const server = longServer;

export const TargetTemperature = () => {
  const queryClient = useQueryClient();
  const [stateTemperature, setStateTemperature] = useState<number>();

  const { isLoading } = useQuery(
    "temperature",
    () => server.get("temperature"),
    {
      onSuccess: (data) => setStateTemperature(data),
    }
  );

  const { mutateAsync: setTemperature } = useMutation(
    (nextTemperature: number) => server.put("temperature", nextTemperature),
    {
      onSuccess: () => queryClient.invalidateQueries("temperature"),
      onMutate: (nextTemperature) => setStateTemperature(nextTemperature),
    }
  );

  if (isLoading) return <>Loading</>;

  return (
    <TargetTemperatureControl
      increment={() => {
        setTemperature(stateTemperature! + 1);
      }}
      decrement={() => {
        setTemperature(stateTemperature! - 1);
      }}
      current={stateTemperature!}
    />
  );
};
