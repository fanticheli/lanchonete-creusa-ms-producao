import { StatusPedidoEnum } from "../common/enum/status-pedido-enum";
import { produtoProps } from "../entities/props/pedido.props";

export interface PedidoOutput {
    id: string;
    produtos: produtoProps[];
    numeroPedido: number;
    cliente: string;
    statusPedido: StatusPedidoEnum;
}