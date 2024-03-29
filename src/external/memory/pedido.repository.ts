import { PedidoOutput } from "../../adapters/pedido";
import { Pedido } from "../../entities/pedido.entity";
import { PedidoProps } from "../../entities/props/pedido.props";
import { IPedidoGateway } from "../../interfaces/gateway/pedido.gateway.interface";

export class PedidoRepositoryInMemory implements IPedidoGateway {
	private pedidos: Pedido[] = [];

	constructor() {}

	async CriarPedido(pedidoProps: PedidoProps): Promise<PedidoOutput> {
		const pedido = new Pedido(pedidoProps);
		pedido.id = this.pedidos.length.toString() + 1;
		this.pedidos.push(pedido);
		return pedido.object;
	}

	async BuscarPedidoPorID(pedidoID: string): Promise<PedidoOutput | null> {
		const pedidoEncontrado = this.pedidos.find(
			(pedido) => pedido.id === pedidoID
		);

		if (!pedidoEncontrado) {
			return null;
		}

		return pedidoEncontrado.object;
	}

	async EditarPedido(editarPedidoDTO: PedidoProps): Promise<PedidoOutput> {
        if (!editarPedidoDTO.id) {
            throw new Error("ID do Pedido não informado");
        }

        const pedidoIndex = this.pedidos.findIndex(
            (pedido) => pedido.id === editarPedidoDTO.id
        );

        if (pedidoIndex === -1) {
            throw new Error("ID do Pedido não informado");
        }

        this.pedidos[pedidoIndex].statusPedido = editarPedidoDTO.statusPedido;

        return this.pedidos[pedidoIndex].object;
    }
	async ListarPedidos(): Promise<PedidoOutput[]> {
		return this.pedidos.map((pedido) => pedido.object);
	}
}
