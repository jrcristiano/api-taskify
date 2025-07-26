import { IPaginationOptions } from "../interfaces/pagination.options.interface";
import { IPaginationResult } from "../interfaces/pagination.result.interface";


export async function paginate<T>(
  model: any,
  options: IPaginationOptions = {},
  args: any = {}
): Promise<IPaginationResult<T>> {
  const page = Number(options.page) || 1;
  const perPage = Number(options.perPage) || 15;

  const skip = page > 0 ? perPage * (page - 1) : 0;

  const [total, data] = await Promise.all([
    model.count({ where: args.where }),
    model.findMany({
      ...args,
      take: perPage,
      skip,
    }),
  ]);

  const lastPage = Math.ceil(total / perPage);

  return {
    data,
    meta: {
      total,
      lastPage,
      currentPage: page,
      perPage,
      prev: page > 1 ? page - 1 : null,
      next: page < lastPage ? page + 1 : null,
    },
  };
}
