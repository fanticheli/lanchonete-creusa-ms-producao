import { PedidoOutput } from "../../adapters/pedido";
import { PedidoProps } from "../../entities/props/pedido.props";

export interface IPedidoGateway {
    CriarPedido(pedidoProps: PedidoProps): Promise<PedidoOutput>;
    BuscarPedidoPorID(pedidoID: string): Promise<PedidoOutput | null>;
    EditarPedido(pedidoEditar: PedidoProps): Promise<PedidoOutput>;
    ListarPedidos(): Promise<PedidoOutput[]>;
}