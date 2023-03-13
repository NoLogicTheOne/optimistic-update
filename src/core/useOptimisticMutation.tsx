import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "react-query";

type TransformObject<TVariables, TContext> = {
  queryKey: string;
  transformFunc: (nextData: TVariables) => TContext;
};

export function useOptimisticMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFunc: MutationFunction<TData, TVariables>,
  transformObject: string | TransformObject<TVariables, TContext>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();
  const hasTransformFunc = typeof transformObject !== "string";

  const queryKey = !hasTransformFunc
    ? transformObject
    : transformObject.queryKey;

  return useMutation<TData, TError, TVariables>(mutationFunc, {
    onMutate: async (nextData) => {
      await queryClient.cancelQueries(queryKey);

      const prevData = queryClient.getQueryData(queryKey);

      const preparedData = hasTransformFunc
        ? transformObject.transformFunc(nextData)
        : nextData;

      queryClient.setQueryData(queryKey, preparedData);

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
