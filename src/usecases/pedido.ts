import amqp from "amqplib";
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

		const wasPublished = await PedidoUseCases.EnviarAlteracaoStatusPedido(pedidoEncontrado.id, statusPedido);

		if (!wasPublished) {
			throw new Error("Erro ao enviar alteração de status do pedido");
		}

		return pedidoGatewayInterface.EditarPedido(pedidoEncontrado);
	}

	static async ListaPedidos(
		pedidoGatewayInterface: IPedidoGateway
	): Promise<PedidoOutput[]> {
		return pedidoGatewayInterface.ListarPedidos();
	}

	static async EnviarAlteracaoStatusPedido(
		idPedido: string,
		statusPedido: StatusPedidoEnum
	): Promise<boolean> {
		try {
			const connection = await amqp.connect(process.env.QUEUE_HOST || '');
			const channel = await connection.createConfirmChannel();
			const queueName = process.env.QUEUE_PRONTOS_NAME || '';
			await channel.assertQueue(queueName, { durable: true });
			const messageContent = JSON.stringify({ idPedido, statusPedido });
			await channel.sendToQueue(queueName, Buffer.from(messageContent), undefined, (err) => {
				if (err !== null) throw err;
				connection.close();
			});
			return true;
		}
		catch (error) {
			throw error;
		}

	}
}
