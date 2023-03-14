import { useMutation, useQuery, useQueryClient } from "react-query";
import { longServer } from "../../fakeServer";
import { TargetTemperatureControl } from "../../ui";

const server = longServer;

export const TargetTemperature = () => {
  const queryClient = useQueryClient();

  const { data: temperature, isLoading } = useQuery("temperature", () =>
    server.get("temperature")
  );

  const { mutateAsync: setTemperature } = useMutation(
    (nextTemperature: number) => server.put("temperature", nextTemperature),
    {
      onMutate: async (nextTemperature) => {
        await queryClient.cancelQueries("temperature");

        const prevTemperature = queryClient.getQueryData("temperature");
        queryClient.setQueryData("temperature", nextTemperature);

        return prevTemperature;
      },
      onError: (_err, _nextTemperature, context) => {
        queryClient.setQueryData("temperature", context);
        // Тут можно дополнительно обработать ошибку
      },
      onSettled: () => {
        queryClient.invalidateQueries("temperature");
      },
    }
  );

  if (isLoading) return <>Loading</>;

  return (
    <>
      <TargetTemperatureControl
        increment={() => {
          setTemperature(temperature! + 1);
        }}
        decrement={() => {
          setTemperature(temperature! - 1);
        }}
        current={temperature!}
      />
      <Addict />
    </>
  );
};

function Addict() {
  const { data: temperature } = useQuery("temperature", () =>
    server.get("temperature")
  );

  return <>{temperature}&deg;</>;
}
