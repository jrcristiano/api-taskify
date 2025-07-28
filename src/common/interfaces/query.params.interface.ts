import { SortOrder } from "../enums/sort.order.enum";
import { TaskStatus } from "../enums/task.status.enum";

export interface QueryParams {
  /**
   * Status para filtrar os resultados (opcional)
   */
  status?: TaskStatus;

  /**
   * Termo de busca para filtrar os resultados (opcional)
   */
  search?: string;

  /**
   * Número da página para paginação (opcional)
   */
  page?: number;

  /**
   * Quantidade de itens por página (opcional)
   */
  perPage?: number;

  /**
   * Flag para incluir registros excluídos (soft delete) (opcional)
   */
  withTrashed?: string;

  /**
   * Campo para ordenação dos resultados (opcional)
   */
  sort?: string;

  /**
   * Direção da ordenação (asc ou desc) (opcional)
   */
  order?: SortOrder;
}
