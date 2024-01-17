import { PedidoOutput } from "../adapters/pedido";
import { StatusPedidoEnum } from "../common/enum/status-pedido-enum";
import { Pedido } from "../entities/pedido.entity";
import { PedidoProps } from "../entities/props/pedido.props";
import { IPedidoGateway } from "../interfaces/gateway/pedido.gateway.interface";

export class PedidoUseCases {
	static async CriarPedido(
		pedidoGatewayInterface: IPedidoGateway,
		pedidoProps: PedidoProps
	) {
		const novoPedido = new Pedido(pedidoProps);

		return pedidoGatewayInterface.CriarPedido(novoPedido.object);
	}

	static async BuscarPedidoPorID(
		pedidoGatewayInterface: IPedidoGateway,
		pedidoID: string
	): Promise<PedidoOutput | null> {
		const pedidoEncontrado = await pedidoGatewayInterface.BuscarPedidoPorID(
			pedidoID
		);

		if (!pedidoEncontrado) {
			throw new Error("Pedido não encontrado");
		}

		return pedidoEncontrado;
	}

	static async AlterarStatusPedido(
		pedidoGatewayInterface: IPedidoGateway,
		pedidoID: string,
		statusPedido: StatusPedidoEnum
	): Promise<PedidoOutput> {
		if (!Object.values(StatusPedidoEnum).includes(statusPedido)) {
			throw new Error("Status de pedido inválido");
		}

		const pedidoEncontrado = await pedidoGatewayInterface.BuscarPedidoPorID(
			pedidoID
		);

		if (!pedidoEncontrado) {
			throw new Error("Pedido não encontrado");
		}

		pedidoEncontrado.statusPedido = statusPedido;

		return pedidoGatewayInterface.EditarPedido(pedidoEncontrado);
	}

	static async ListaPedidos(
		pedidoGatewayInterface: IPedidoGateway
	): Promise<PedidoOutput[]> {
		return pedidoGatewayInterface.ListarPedidos();
	}
}
