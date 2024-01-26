import { CategoriaEnum } from "../../common/enum/categoria-enum";
import { StatusPedidoEnum } from "../../common/enum/status-pedido-enum";

export type PedidoProps = {
    id: string;
    produtos: produtoProps[];
    cliente: string;
    numeroPedido: number;
    statusPedido: StatusPedidoEnum;
};

export type produtoProps = {
    descricao: string;
    categoria: CategoriaEnum;
};