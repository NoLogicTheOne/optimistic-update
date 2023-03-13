import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "react-query";

export function useOptimisticMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFunc: MutationFunction<TData, TVariables>,
  queryKey: string,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>(mutationFunc, {
    onMutate: async (nextData) => {
      await queryClient.cancelQueries(queryKey);

      const prevData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, nextData);

      return prevData;
    },
    onError: (err, _nextData, prevData) => {
      options?.onError?.(err, _nextData, prevData as TContext);

      queryClient.setQueryData(queryKey, prevData);
      console.error(err);
    },
    onSettled: (...props) => {
      //@ts-ignore
      options?.onSettled?.(...props);
      queryClient.invalidateQueries(queryKey);
    },
  });
}
