import { ObjectId } from "mongodb";
import { PedidoOutput } from "../../../adapters/pedido";
import { PedidoProps } from "../../../entities/props/pedido.props";
import { IPedidoGateway } from "../../../interfaces/gateway/pedido.gateway.interface";
import { PedidoMongo } from "../model/pedido";
import { StatusPedidoEnum } from "../../../common/enum/status-pedido-enum";

export class PedidoRepositoryInMongo implements IPedidoGateway {
	private _model;

	constructor() {
		this._model = PedidoMongo;
	}

	async CriarPedido(pedidoProps: PedidoProps): Promise<PedidoOutput> {
		return this._model.create(pedidoProps);
	}

	async BuscarPedidoPorID(pedidoID: string): Promise<PedidoOutput | null> {
		if (!ObjectId.isValid(pedidoID)) {
			throw new Error("ID inválido");
		}

		const pedidoEncontrado = await this._model.findById(pedidoID);

		if (!pedidoEncontrado) {
			return null;
		}

		return pedidoEncontrado;
	}

	async EditarPedido(pedidoEditar: PedidoProps): Promise<PedidoOutput> {
		if (!pedidoEditar.id || !ObjectId.isValid(pedidoEditar.id)) {
			throw new Error("ID inválido");
		}

		return this._model.findByIdAndUpdate(pedidoEditar.id, pedidoEditar, {
			new: true,
		});
	}

	async ListarPedidos(): Promise<PedidoOutput[]> {
		const pipeline = [
			{
				$match: {
					statusPedido: { $nin: [StatusPedidoEnum.FINALIZADO] },
				},
			},
			{
				$sort: { createdAt: -1 },
			},
			{
				$addFields: {
					orderStatusValue: {
						$switch: {
							branches: [
								{
									case: {
										$eq: [
											"$statusPedido",
											StatusPedidoEnum.PRONTO,
										],
									},
									then: 1,
								},
								{
									case: {
										$eq: [
											"$statusPedido",
											StatusPedidoEnum.PREPARACAO,
										],
									},
									then: 2,
								},
								{
									case: {
										$eq: [
											"$statusPedido",
											StatusPedidoEnum.RECEBIDO,
										],
									},
									then: 3,
								},
							],
							default: 4,
						},
					},
				},
			},
			{
				$sort: { orderStatusValue: 1 },
			},
			{
				$project: {
					orderStatusValue: 0,
				},
			},
		];

		return this._model.aggregate(pipeline);
	}
}
